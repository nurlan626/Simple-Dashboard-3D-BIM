/**
 * API config: mock vs real backend. When mock, baseUrl is empty so MSW intercepts same-origin /api/*.
 */
const raw = import.meta.env.VITE_USE_MOCK;
export const isMock = raw === "true" || raw === "1";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const apiBaseUrl = isMock ? "" : (baseUrl ?? "");
