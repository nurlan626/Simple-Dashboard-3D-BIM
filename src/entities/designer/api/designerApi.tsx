import { createApi } from "@reduxjs/toolkit/query/react";
import type { Designer } from "../model/types";
import { baseQuery } from "../../../shared/api/baseQuery";

const DESIGNERS_TAG = "Designer" as const;

export const designersApi = createApi({
  reducerPath: "designersApi",
  baseQuery,
  tagTypes: [DESIGNERS_TAG],
  endpoints: (builder) => ({
    getDesigners: builder.query<Designer[], void>({
      query: () => "/api/designers",
      providesTags: [DESIGNERS_TAG],
    }),
    addDesigner: builder.mutation<Designer, Partial<Designer>>({
      query: (body) => ({
        url: "/api/designers",
        method: "POST",
        body,
      }),
      invalidatesTags: [DESIGNERS_TAG],
    }),
    updateDesigner: builder.mutation<Designer, { id: string; body: Partial<Designer> }>({
      query: ({ id, body }) => ({
        url: `/api/designers/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [DESIGNERS_TAG],
    }),
    deleteDesigner: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/designers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [DESIGNERS_TAG],
    }),
  }),
});

export const {
  useGetDesignersQuery,
  useAddDesignerMutation,
  useUpdateDesignerMutation,
  useDeleteDesignerMutation,
} = designersApi;
