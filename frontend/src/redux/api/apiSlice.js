import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://mern12-y4o1.onrender.com/api',
    credentials: 'include',
  }),
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
