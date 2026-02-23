import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const useMock =
  import.meta.env.VITE_USE_MOCK === "true" || import.meta.env.VITE_USE_MOCK === "1";
const apiBaseUrl = useMock ? "" : (import.meta.env.VITE_API_BASE_URL ?? "");

export const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders(headers) {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});
