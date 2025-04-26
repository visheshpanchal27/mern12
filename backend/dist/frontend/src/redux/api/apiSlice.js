import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    credentials: 'include',
  }),
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({}),
});
