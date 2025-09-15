import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { orderPayload, orders, payloadOrderGET } from "./orderPayload";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" ,credentials: 'include',  }),
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
    getOrderById: builder.query<orders, string>({
      query: (orderId) => `order/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    updateOrderQuantity: builder.mutation<void, {orderLineId:string,newqty:number}>({
      query: ({orderLineId,newqty}) => ({
        url: `order/quantity/${orderLineId}`,
        method: "PUT",
        body: {newqty},
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrderState: builder.mutation<void, { orderId: string; state: string }>(
      {
        query: ({ orderId, state }) => ({
          url: `order/${orderId}`,
          method: "PUT",
          body: { state },
        }),
      }
    ),
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
export const {
  useUpdateOrderQuantityMutation,
  useAddOrderMutation,
  useGetOrderQuery,
  useDeleteOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderStateMutation
} = orderApi;
