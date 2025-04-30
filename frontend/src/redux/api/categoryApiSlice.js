import { apiSlice } from "./apiSlice";
import { CATEGORY_URL } from "../constants";


export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createCategory: builder.mutation({
            query:(newCategory)=>({
                url: `${CATEGORY_URL}`,
                method: 'post',
                body: newCategory,
            }),
        }),

        updateCategory:builder.mutation({
            query:({categoryId,updatedCategory})=>({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: 'put',
                body: updatedCategory
            }),
        }),


        deleteCategory: builder.mutation({
            query:({categoryId})=>({
                url: `${CATEGORY_URL}/${categoryId}`,
                method: 'delete',
            }),
        }),

        fetchCategories: builder.query({
            query: ()=>`${CATEGORY_URL}/categories`,
        }),
    }),
});

export const {
    useCreateCategoryMutation,  
    useUpdateCategoryMutation, 
    useDeleteCategoryMutation, 
    useFetchCategoriesQuery,  
} = categoryApiSlice;