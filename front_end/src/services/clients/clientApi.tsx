import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 
import type { clientPayload } from "./clientPayload";

export const clientApi = createApi({
  reducerPath: "clientApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  tagTypes: ["Client"],
  endpoints: (builder) => ({
    getClients: builder.query<clientPayload, void>({
      query: () => "/client",
      providesTags: (result) =>
        result?.clients
          ? [
              ...result.clients.map((c) => ({ type: "Client" as const, id: c._id })),
              { type: "Client" as const, id: "LIST" },
            ]
          : [{ type: "Client" as const, id: "LIST" }],
    }),
    getClientById: builder.query({
      query: (id) => `/client/${id}`,
      providesTags: (result, error, id) => [{ type: "Client", id }],
    }),
    createClient: builder.mutation({
      query: (newClient) => ({
        url: "/client",
        method: "POST",
        body: newClient,
      }),
      invalidatesTags: ["Client"],
    }),
    updateClient: builder.mutation({
      query: ({ id, ...updatedClient }) => ({
        url: `/client/${id}`,
        method: "PUT",
        body: updatedClient,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Client", id }],
    }),
    deleteClient: builder.mutation({
      query: (clientId) => ({
        url: `/client/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, clientId) => [{ type: "Client", id: clientId }],
    }),
  }),
});

// ✅ Export the auto-generated hooks
export const {
  useGetClientsQuery,
  useGetClientByIdQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientApi;
