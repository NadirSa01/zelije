import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ServicePayload } from "./servicePayload";


export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  tagTypes: ["Service"],
  endpoints: (builder) => ({
    getServices: builder.query<ServicePayload, void>({
      query: () => "/service",
      providesTags: (result) =>
        result?.services
          ? [
              ...result.services.map((p) => ({
                type: "Service" as const,
                id: p._id,
              })),
              { type: "Service" as const, id: "LIST" },
            ]
          : [{ type: "Service" as const, id: "LIST" }],
    }),
    getServiceById : builder.query({
      query : (serviceId) =>`/service/${serviceId}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],

    }),
    createService:builder.mutation({
      query:(newService)=>({
          url : "/service",
          method :"POST",
          body:newService
      }),
      invalidatesTags:["Service"],
    })
    ,
    updateService:builder.mutation({
      query:({id,...updatedService})=>({
        url:`/service/${id}`,
        method:"PUT",
        body:updatedService,
      }),
      invalidatesTags:(result, error,{id}) =>[{type:"Service",id}],
    })
    ,
    deleteService: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/service/${id}`,
        method: "DELETE",
      }),
      invalidatesTags:["Service"]

  }),
})
})
export const { 
  useGetServicesQuery,
  useDeleteServiceMutation,
  useCreateServiceMutation,
  useGetServiceByIdQuery,
  useUpdateServiceMutation
} = serviceApi;

