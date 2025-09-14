
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { OrderServicePayload, OrderSPayload } from "./serviceOrderPayload";

export const serviceOrderApi = createApi({
  reducerPath: "serviceOrderApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  tagTypes: ["ServiceOrder"],
  endpoints: (builder) => ({
    getOrderServices: builder.query<OrderServicePayload,void>({
      query: () => "/service-order",
      providesTags: (result) =>
        result?.orders
          ? [
              ...result.orders.map((p) => ({
                type: "ServiceOrder" as const,
                id: p._id,
              })),
              { type: "ServiceOrder" as const, id: "LIST" },
            ]
          : [{ type: "ServiceOrder" as const, id: "LIST" }],
    }),
    getOrderServiceById : builder.query<OrderSPayload,string>({
      query: (id)=> `/service-order/${id}`,
      providesTags: (result, error, id) => [{ type: "ServiceOrder", id }],
    }),
    updateServicePrice: builder.mutation({
      query: ({ id, newPrice }) => ({
        url: `/service-order/${id}`, 
        method: "PUT",
        body: { newPrice }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ServiceOrder", id },
        { type: "ServiceOrder", id: "LIST" }
      ]
    }),
    updateServiceState: builder.mutation({
      query: ({ id, newState }) => ({
        url: `/service-order/s/${id}`, 
        method: "PUT",
        body: { newState }
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ServiceOrder", id },
        { type: "ServiceOrder", id: "LIST" }
      ]
    }),
  }),
});
export const {useGetOrderServicesQuery,useGetOrderServiceByIdQuery,useUpdateServicePriceMutation,useUpdateServiceStateMutation} = serviceOrderApi;
