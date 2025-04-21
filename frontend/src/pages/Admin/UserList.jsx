import { useEffect,useState } from "react";
import { FaTrash,FaEdit,FaCheck,FaTimes } from "react-icons/fa";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import {    
    useGetUsersQuery,
    useDeleteUserMutation,
    useUpdateUserMutation,} from "../../redux/api/usersApiSlice";
import Massage from "../../components/Massage"
import AdminMenu from "./AdminMenu";

const UserList =()=>{
    const {data: users, refetch, isLoading,error}=useGetUsersQuery()
    const [deleteUser] = useDeleteUserMutation();
    const [updateUser] = useUpdateUserMutation();

    const [editableUserId, setEditableUserId] = useState(null);
    const [editableUserName, setEditableUserName] = useState('');
    const [editableUserEmail, setEditableUserEmail] = useState('');
    
    useEffect(() =>{
        refetch()
    },[refetch]);

    const deleteHandler = async (id) =>{
        if(window.confirm('Are you sure you want to delete')){
            try {
                await deleteUser(id)
            } catch (error) {
                toast.error(error.data.message || error.error)
            }
        }
    }

    const toggleEdit = (id,username,email) =>{
        setEditableUserId(id);
        setEditableUserName(username);
        setEditableUserEmail(email);
    }

    const updateHandler = async(id) =>{
        console.log("Updating user with ID:", id); // Debugging log

        try {
            await updateUser({
                id,
                username: editableUserName,
                email: editableUserEmail
            })

            setEditableUserId(null)
            refetch();

        } catch (error) {
            toast.error(error.data.message || error.error)
        }
    }

    return <div className="p-4">
        
        <h1 className="text-center text-2xl font-bold mb-4">User List</h1>
        <br/>
        {isLoading ? (<Loader/>): error ? (<Massage variant='danger'>{error?.data?.message || error.message}</Massage>
        ):(
        <div className="flex flex-col md:flex-row">
            <AdminMenu/>
            <table className="w-full md:w-4/5 mx-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left">Id</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Admin</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user =>(
                        <tr key={user._id}>
                            <td className="px-4 py-2">{user._id}</td>
                            <td className="px-4 py-2">
                                {editableUserId === user._id ?(
                                    <div className="flex item-center">
                                        <input type="text" value={editableUserName} onChange={e => setEditableUserName(e.target.value)} className="w-full p-2 border rounded-lg"/>
                                        <button onClick={() => updateHandler(user._id)} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                            <FaCheck/>
                                        </button>
                                    </div>
                                ):(
                                    <div className="flex item-center">
                                        {user.username}{""}
                                        <button onClick={()=> toggleEdit(user._id,user.username,user.email)}>
                                            <FaEdit className="ml-[1rem]"/>
                                        </button>
                                    </div>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                {editableUserId === user._id ?(
                                    <div className="flex item-center">
                                        <input type="text" value={editableUserEmail} onChange={e =>
                                            setEditableUserEmail(e.target.value)} className="w-full p-2 border rounded-lg"/>
                                            <button onClick={() => updateHandler(user._id)} className="ml-2 bg-blue-500 text-white py-2 px-4 rounded-lg">
                                                <FaCheck/>
                                            </button>
                                    </div>
                                ):(
                                    <div className="flex item-center">
                                        <p>{user.email}</p>
                                        <button onClick={()=> toggleEdit(user._id,user.username,user.email)}>
                                            <FaEdit className="ml-[1rem]"/>
                                        </button>
                                    </div>
                                )}
                            </td>

                            <td className="px-4 py-3">
                                {user.isAdmin ?(
                                    <FaCheck style={{color:'green'}}/>
                                ):(
                                    <FaTimes style={{color:'red'}}/>
                                )}
                            </td>
                                
                                <td className="td px-4 py-2">
                                    {!user.isAdmin && (
                                        <div className="flex">
                                            <button onClick={()=> deleteHandler(user._id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                                <FaTrash/>
                                            </button>
                                        </div>
                                    )}
                                </td>

                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
        )}
    </div>
};

export default UserList;