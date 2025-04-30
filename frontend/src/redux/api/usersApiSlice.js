import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST',
            }),
        }),

        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data,
            }),
        }),

        profile: builder.mutation({
            query: data => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data,
            }),
        }),

        getUsers: builder.query({
            query: () => ({
                url: USERS_URL
            }),
            providesTags:['User'],
            keepUnusedDataFor:5,

        }),
        deleteUser:builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'DELETE',
            }),
        }),

        getUserDetails: builder.mutation({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure token is stored and retrieved correctly
                },
            }),
            keepUnusedDataFor:5,
        }),

        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags:['User'],
        }),
    }),
});

export const { 
    useLoginMutation, 
    useLogoutMutation ,
    useRegisterMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteUserMutation,
    useGetUserDetailsQuery,
    useUpdateUserMutation,
} = userApiSlice;
