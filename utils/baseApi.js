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
      query: ({ id, providerWorkShopId }) => `/invoices/${id}?providerWorkShopId=${providerWorkShopId}`, // just URL, GET is default
      providesTags: ["Example"],
    }),

    // getReport: builder.query({
    //   query: () => "/reports/?endDate=2025-12-13&startDate=2025-9-13&isReleased=true&lang=ar&noOfCars=true", // just URL, GET is default
    //   headers: {
    //     authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MmZjODAzYzFhMzZmNDViNGQ0NmVkNiIsInJvbGUiOiJXT1JLU0hPUF9PV05FUiIsImVtYWlsIjoiZmFoZHR2QGdtYWlsLmNvbSIsImNvbnRhY3QiOiIrOTY2NTAzMzQzMDAwIiwiZGV2aWNlSWQiOiIiLCJ3b3JrU2hvcHMiOlsiNjkyZmM5MTljMWEzNmY0NWI0ZDQ2ZWVhIl0sImlhdCI6MTc2Nzk1MDYzNiwiZXhwIjoxNzcwNTQyNjM2fQ.vGaTUIDnZnc1kZqQAyuTP1WPMUeOSuPuGN789Na52N8`,
    //     // "Content-Type": "application/json",

    //   },
    //   providesTags: ["Example"],
    // }),


    getReport: builder.query({
      query: ({ startDate, endDate, providerWorkShopId, lang, isReleased, token }) => ({
        url: `/reports?startDate=${startDate}&endDate=${endDate}&isReleased=${isReleased}&lang=${lang}&providerWorkShopId=${providerWorkShopId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),




  }),
});

export const { useGetInvoiceQuery, useGetReportQuery } = baseApi;
