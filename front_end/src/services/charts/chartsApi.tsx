import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MetricsApiResponse } from "./chartPayload";

export const chartApi = createApi({
  reducerPath: "chartApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api" ,credentials: 'include',  }),
  tagTypes: ["Chart"],
  endpoints: (builder) => ({
    getChart: builder.query({
      query: ({ startDate, endDate }) =>
        `/orders/chart/${startDate}/${endDate}`,
      providesTags: (result) =>
        result
          ? [{ type: "Chart", id: "LIST" }]
          : [{ type: "Chart", id: "LIST" }],
    }),
     getMetrics: builder.query<MetricsApiResponse, { startDate: string; endDate: string }>({
      query: ({ startDate, endDate }) => ({
        url: `/orders/metrics/${startDate}/${endDate}`,
        method: 'GET',
      }),
      providesTags: ['Chart'],
    }),
  }),
});
export const {useGetChartQuery,useGetMetricsQuery}=chartApi