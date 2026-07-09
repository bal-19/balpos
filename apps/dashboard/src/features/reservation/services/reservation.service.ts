import type { ApiSuccessEnvelope, Reservation } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export interface ReservationPayload {
  tableId: string;
  customerId?: string | null;
  customerName: string;
  customerPhone?: string | null;
  partySize: number;
  reservedAt: string;
  notes?: string | null;
}

export async function fetchReservations(date?: string) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Reservation[]>>("/api/reservation/reservations", {
    params: date ? { date } : undefined,
  });
  return data.data;
}

export async function createReservation(payload: ReservationPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Reservation>>(
    "/api/reservation/reservations",
    payload,
  );
  return data.data;
}

async function transition(id: string, action: string) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<Reservation>>(
    `/api/reservation/reservations/${id}/${action}`,
  );
  return data.data;
}

export const confirmReservation = (id: string) => transition(id, "confirm");
export const checkInReservation = (id: string) => transition(id, "check-in");
export const completeReservation = (id: string) => transition(id, "complete");
export const cancelReservation = (id: string) => transition(id, "cancel");
export const markNoShow = (id: string) => transition(id, "no-show");
