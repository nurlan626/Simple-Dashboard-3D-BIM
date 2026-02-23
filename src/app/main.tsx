import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { isMock } from "../shared/config";
import { startMockServer } from "../shared/mock/startMockServer";
import App from "./App.tsx";
import "./styles/index.css";

async function bootstrap() {
  if (isMock) {
    try {
      await startMockServer();
    } catch (err) {
      console.error("[MSW] Failed to start mock server:", err);
    }
  }
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

bootstrap();
