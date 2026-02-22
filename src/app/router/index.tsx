import { Suspense } from "react";
import { routes } from "./routes.tsx";
import { useRoutes } from "react-router";

export function AppRouter() {
  const routing = useRoutes(routes);

  return (
    <Suspense fallback={<div className="">Loading...</div>}>
      {routing}
    </Suspense>
  );
}
