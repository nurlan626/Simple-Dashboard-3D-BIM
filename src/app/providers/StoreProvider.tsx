import type { ReactNode } from "react";
import { store } from "./StoreProvider/config/store";
import { Provider } from "react-redux";

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
