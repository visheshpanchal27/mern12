import { PRODUCTS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
<<<<<<< HEAD
    endpoints: (builder) => ({
        getProducts: builder.query({
          query: ({ keyword }) => ({
            url: `${PRODUCTS_URL}`,
            params: { keyword },
          }),
          keepUnusedDataFor: 5,
          providesTags: ["Product"],
        }),

        getProductById: builder.query({
            query: (productId) => `${PRODUCTS_URL}/${productId}`,
            providesTags: (result, error, productId) => [{ type: "Product",id:productId }],
        }),
        
        allProducts: builder.query({
            query: () => `${PRODUCTS_URL}/allProducts`,
        }),

        getProductDetails: builder.query({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
            }),
            keepUnusedDataFor: 5,
        }),

        createProduct: builder.mutation({
            query: (formData) => ({
              url: `${PRODUCTS_URL}`,
              method: "POST",
              body: formData,
            }),
            invalidatesTags: ["Product"],
        }),
        

        updateProduct: builder.mutation({
            query: ({ productId, formData }) => ({
              url: `${PRODUCTS_URL}/${productId}`,
              method: "PUT",
              body: formData,
            }),
            invalidatesTags: ["Product"],
          }),          

        uploadProductImage: builder.mutation({
            query: (data) => ({
                url: `${UPLOAD_URL}`,
                method: "POST",
                body: data,
              }),
        }),

        deleteProduct: builder.mutation({
            query: (productId) => ({
                url: `${PRODUCTS_URL}/${productId}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Product"],
        }),

        createReview: builder.mutation({
            query: (data) => ({
                url: `${PRODUCTS_URL}/${data.productId}/reviews`,
                method: "POST",
                body: data,
            }),
        }),

        getTopProducts: builder.query({
            query: () => `${PRODUCTS_URL}/top`,
            keepUnusedDataFor: 5,
        }),

        getNewProducts: builder.query({
            query: () => `${PRODUCTS_URL}/new`,
            keepUnusedDataFor: 5,
        }),

        getFilteredProducts: builder.query({
            query: ({ checked, radio }) => ({
              url: `${PRODUCTS_URL}/filtered-products`,
              method: "POST",
              body: { checked, radio },
            }),
          }),

=======
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCTS_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
>>>>>>> 72818dd476f79bebc98e6e1ec0e5ea3d11dedaed
    }),

    getProductById: builder.query({
      query: (productId) => `${PRODUCTS_URL}/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Product", id: productId }],
    }),

    allProducts: builder.query({
      query: () => `${PRODUCTS_URL}/allProducts`,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (formData) => ({
        url: `${PRODUCTS_URL}`,
        method: "POST",
        body: formData,
        headers: {}, // If you need any headers like Content-Type, add here
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),

    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Product"],
    }),

    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCTS_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
    }),

    getTopProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5,
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCTS_URL}/new`,
      keepUnusedDataFor: 5,
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCTS_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAllProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useGetFilteredProductsQuery,
} = productApiSlice;
