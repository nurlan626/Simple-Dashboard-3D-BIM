import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiBaseUrl } from "../config/api";

export const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseUrl,
  prepareHeaders(headers) {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});
