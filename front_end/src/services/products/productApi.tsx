import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ApiRes } from "@/admin/products/components/table/getApiRes";
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" ,credentials: 'include',  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query<ApiRes, void>({
      query: () => "/products",
      providesTags: (result) =>
        result?.products
          ? [
              ...result.products.map((p) => ({
                type: "Product" as const,
                id: p._id,
              })),
              { type: "Product" as const, id: "LIST" },
            ]
          : [{ type: "Product" as const, id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: "/product",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...updatedProduct }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: updatedProduct,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Product", id }],
    }),
    deleteDetail: builder.mutation({
      query: ( detailId ) => ({
        url: `/detail/${detailId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),
    uploadProductImage: builder.mutation({
      query: (formData) => ({
        url: "/upload-image",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});
export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteDetailMutation,
  useUploadProductImageMutation,
} = productApi;
