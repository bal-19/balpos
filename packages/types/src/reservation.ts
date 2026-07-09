import type { ReservationStatus } from "./enums.js";

export interface Reservation {
  id: string;
  outletId: string;
  tableId: string;
  tableName: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string | null;
  partySize: number;
  reservedAt: string;
  status: ReservationStatus;
  notes: string | null;
  createdAt: string;
}
