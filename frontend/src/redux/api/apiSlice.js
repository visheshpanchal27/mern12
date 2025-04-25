import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
    baseQuery: fetchBaseQuery({
  baseUrl: 'https://mern12-y4o1.onrender.com/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.userInfo?.token;
    console.log("TOKEN FROM REDUX:", token);

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      return headers;
      },
    }),

  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}), 
});
