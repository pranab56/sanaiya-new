import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./baseApi"; // adjust path if needed

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
