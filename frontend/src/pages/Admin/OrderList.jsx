import Message from "../../components/Massage";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetOrdersQuery, useDeleteOrderMutation } from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import DeleteIcon from '@mui/icons-material/Delete';

const OrderList = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [deleteOrder] = useDeleteOrderMutation();

  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(orderId).unwrap();
        refetch();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-0 p-5">
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-black/50 backdrop-blur-md rounded-xl shadow-md border border-gray-700 text-white">
              <thead className="bg-black/60 border-b border-gray-700">
                <tr className="text-left text-gray-300">
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Order ID</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Delivered</th>
                  <th className="px-4 py-3">Payment Method</th>
                  <th className="px-4 py-3">Actions</th> {/* Renamed from Details */}
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-800 transition duration-200 border-b border-gray-700"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={
                          order.orderItems[0]?.image.startsWith("http")
                            ? order.orderItems[0]?.image
                            : `${import.meta.env.VITE_API_URL}${order.orderItems[0]?.image}`
                        }
                        alt="order item"
                        className="w-16 h-16 object-cover rounded-md"
                      />
                    </td>

                    <td className="px-4 py-3">{order._id}</td>
                    <td className="px-4 py-3">
                      {order.user ? order.user.username : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      {order.createdAt
                        ? order.createdAt.substring(0, 10)
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      ${order.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.isPaid || order.paymentMethod === "CashOnDelivery"
                            ? "bg-green-500 text-black"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {order.isPaid || order.paymentMethod === "CashOnDelivery"
                          ? "Completed"
                          : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          order.isDelivered
                            ? "bg-green-500 text-black"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {order.isDelivered ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-white font-medium">
                        {order.paymentMethod === "CashOnDelivery"
                          ? "Cash on Delivery"
                          : order.paymentMethod || "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <Link to={`/order/${order._id}`}>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full transition">
                          More
                        </button>
                      </Link>
                      <DeleteIcon className="text-red-500 cursor-pointer hover:text-red-700" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
};

export default OrderList;
