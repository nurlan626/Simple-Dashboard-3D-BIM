// import { BrowserRouter } from "react-router-dom";

import { BrowserRouter } from "react-router";
import { StoreProvider } from "./StoreProvider";

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <StoreProvider>
        {children}
      </StoreProvider>
    </BrowserRouter>
  );
}
