import { createApi } from "@reduxjs/toolkit/query/react";
import axios, {   AxiosError, type AxiosRequestConfig } from "axios";

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig["method"];
  data?: any;
}

const axiosBaseQuery =
  ({ baseUrl }: { baseUrl?: string } = {}) =>
  async ({ url, method, data }: AxiosBaseQueryArgs) => {
    try {
      const result = await axios({
        url: baseUrl + url,
        method,
        data,
        withCredentials: true, 
      });
      return { data: result.data };
    } catch (error) {
      const err = error as AxiosError; // cast to AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };

export const apiSlice = createApi({
  baseQuery: axiosBaseQuery({ baseUrl: "http://localhost:3000/api" }),
  endpoints: () => ({}),
});
