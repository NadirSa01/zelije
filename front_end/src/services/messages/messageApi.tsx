import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { messagePayload } from "./messagePayload";
import type { IMessage } from "@/types/message";

export const messageApi = createApi({
  reducerPath: "messageApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" ,credentials: 'include',  }),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query<messagePayload, void>({
      query: () => "/messages",
      providesTags: (result) =>
        result?.messages?.length
          ? [
              ...result.messages.map((m) => ({
                type: "Message" as const,
                id: m._id,
              })),
              { type: "Message" as const, id: "LIST" },
            ]
          : [{ type: "Message" as const, id: "LIST" }],
    }),
    createMessage:builder.mutation({
      query:(message)=>({
        url : "/message",
        method:"POST",
        body : message,
      }),
      invalidatesTags:["Message"],
    }),
    deleteMessage: builder.mutation<void, string>({
      query: (messageId) => ({
        url: `/message/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, messageId) => [
        { type: "Message", id: messageId },
        { type: "Message", id: "LIST" },
      ],
    }),
    getMessageById: builder.query<IMessage, string>({
      query: (messageId) => `/message/${messageId}`,
      providesTags: (result, error, id) => [{ type: "Message", id }],
    }),
  }),
});

export const { 
  useGetMessagesQuery, 
  useDeleteMessageMutation, 
  useGetMessageByIdQuery ,
  useCreateMessageMutation
} = messageApi;
