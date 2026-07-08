import { createApiClient } from "@restaurant-pos/api-client";

/** Tidak butuh auth wiring — semua endpoint yang dipakai layar ini publik. */
export const apiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);
