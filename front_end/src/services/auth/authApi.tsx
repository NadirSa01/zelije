import { apiSlice } from "../api/apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/admin/login",
        method: "POST",
        data: { email, password }, 
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
     me: builder.query<any, void>({ 
      query: () => ({
        url: "/admin/me",
        method: "GET",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi;
