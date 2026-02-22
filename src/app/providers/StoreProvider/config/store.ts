import { configureStore } from "@reduxjs/toolkit";
import { designersApi } from "../../../../entities/designer/api/designerApi";
import { objectsApi } from "../../../../entities/object/api/objectApi";

export const store = configureStore({
  reducer: {
    [designersApi.reducerPath]: designersApi.reducer,
    [objectsApi.reducerPath]: objectsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      designersApi.middleware,
      objectsApi.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
