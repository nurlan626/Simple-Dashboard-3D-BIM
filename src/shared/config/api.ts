/**
 * API config: mock vs real backend.
 * VITE_USE_MOCK=true → mock (MSW). Otherwise use VITE_API_BASE_URL in baseQuery.
 */
export const isMock =
  import.meta.env.VITE_USE_MOCK === "true" || import.meta.env.VITE_USE_MOCK === "1";
