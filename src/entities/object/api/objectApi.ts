import { createApi } from "@reduxjs/toolkit/query/react";
import type { SceneObject } from "../model/types";
import { baseQuery } from "../../../shared/api/baseQuery";

const OBJECTS_TAG = "SceneObject" as const;
const DESIGNER_TAG = "Designer" as const;

export const objectsApi = createApi({
  reducerPath: "objectsApi",
  baseQuery,
  tagTypes: [OBJECTS_TAG, DESIGNER_TAG],
  endpoints: (builder) => ({
    getObjects: builder.query<SceneObject[], void>({
      query: () => "/api/objects",
      providesTags: [OBJECTS_TAG],
    }),
    addObject: builder.mutation<SceneObject, Omit<SceneObject, "id">>({
      query: (body) => ({
        url: "/api/objects",
        method: "POST",
        body,
      }),
      invalidatesTags: [OBJECTS_TAG, DESIGNER_TAG],
    }),
    updateObject: builder.mutation<
      SceneObject,
      { id: string; body: Partial<Omit<SceneObject, "id">> }
    >({
      query: ({ id, body }) => ({
        url: `/api/objects/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: [OBJECTS_TAG, DESIGNER_TAG],
    }),
    deleteObject: builder.mutation<void, string>({
      query: (id) => ({
        url: `/api/objects/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [OBJECTS_TAG, DESIGNER_TAG],
    }),
    deleteAllObjects: builder.mutation<void, void>({
      query: () => ({
        url: "/api/objects",
        method: "DELETE",
      }),
      invalidatesTags: [OBJECTS_TAG, DESIGNER_TAG],
    }),
  }),
});

export const {
  useGetObjectsQuery,
  useAddObjectMutation,
  useUpdateObjectMutation,
  useDeleteObjectMutation,
  useDeleteAllObjectsMutation,
} = objectsApi;
