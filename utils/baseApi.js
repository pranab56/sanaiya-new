import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.senaeya.net/api/v1",
  }),
  tagTypes: ["Example"], // declare tags here
  endpoints: (builder) => ({
    // GET request
    getInvoice: builder.query({
      query: () => "/invoices/694beb54eeca164534ef6693?providerWorkShopId=692fbff4c1a36f45b4d46dc1", // just URL, GET is default
      providesTags: ["Example"],
    }),

    // // POST/PUT request (mutation)
    // updateExample: builder.mutation({
    //   query: (data) => ({
    //     url: "/example",
    //     method: "POST", // or "PUT"
    //     body: data,      // body goes here
    //   }),
    //   invalidatesTags: ["Example"], // to refresh cache
    // }),
  }),
});

export const { useGetInvoiceQuery } = baseApi;
