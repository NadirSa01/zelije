import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { orderPayload, payloadOrderGET } from "./orderPayload";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    getOrder: builder.query<payloadOrderGET, void>({
      query: () => "/orders",
      providesTags: (result) =>
        result?.orders?.length
          ? [
              ...result.orders.map((m) => ({
                type: "Order" as const,
                id: m._id,
              })),
              { type: "Order" as const, id: "LIST" },
            ]
          : [{ type: "Order" as const, id: "LIST" }],
    }),
    addOrder: builder.mutation({
      query: ({ data, orderPayload }: orderPayload) => ({
        url: `/order`,
        method: "POST",
        body: { data, orderPayload },
      }),
      invalidatesTags: ["Order"],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Order", id }],
    }),
  }),
});
export const { useAddOrderMutation, useGetOrderQuery,useDeleteOrderMutation } = orderApi;
