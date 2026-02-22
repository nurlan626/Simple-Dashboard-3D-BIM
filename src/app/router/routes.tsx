import { EditorPage } from "../../pages/Editor/ui/EditorPage";
import Layout from "../layouts/Layout";
import { DesignersPage } from "../../pages/Designers/ui/DesignersPage";
import type { RouteObject } from "react-router";




export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
            <DesignersPage />
        ),
      },
      {
        path: "/editor",
        element: (
            <EditorPage />
        ),
      }
    
  
    ],
  }
];
