import type { Reservation, ReservationStatus, Table, TableStatus } from "@prisma/client";
import type { Reservation as ReservationDto } from "@restaurant-pos/types";
import { getIO } from "../../../core/socket.js";
import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import {
  createReservation,
  findManyReservations,
  findOverlappingReservations,
  findReservationById,
  findTableForOutlet,
  updateReservationStatus,
  updateTableStatus,
} from "../repository/reservation.repository.js";
import type { CreateReservationInput } from "../schema/reservation.schema.js";

/** Durasi asumsi 1 sesi reservasi — dipakai untuk cek konflik jadwal per meja. */
const CONFLICT_WINDOW_MS = 2 * 60 * 60 * 1000;

type ReservationWithTable = Reservation & { table: Table };

function toReservationDto(reservation: ReservationWithTable): ReservationDto {
  return {
    id: reservation.id,
    outletId: reservation.outletId,
    tableId: reservation.tableId,
    tableName: reservation.table.name,
    customerId: reservation.customerId,
    customerName: reservation.customerName,
    customerPhone: reservation.customerPhone,
    partySize: reservation.partySize,
    reservedAt: reservation.reservedAt.toISOString(),
    status: reservation.status,
    notes: reservation.notes,
    createdAt: reservation.createdAt.toISOString(),
  };
}

function emitTableStatus(outletId: string, tableId: string, status: TableStatus) {
  getIO().to(`outlet:${outletId}`).emit("table:status.updated", { tableId, status });
}

export async function listReservations(
  outletId: string,
  filters: { from?: Date; to?: Date; status?: ReservationStatus },
) {
  const reservations = await findManyReservations(outletId, filters);
  return reservations.map(toReservationDto);
}

export async function createOutletReservation(outletId: string, input: CreateReservationInput) {
  const table = await findTableForOutlet(input.tableId, outletId);
  if (!table) throw new NotFoundError("Meja tidak ditemukan");

  const reservedAt = new Date(input.reservedAt);
  const overlapping = await findOverlappingReservations(input.tableId, reservedAt, CONFLICT_WINDOW_MS);
  if (overlapping.length > 0) {
    throw new AppError("Meja sudah punya reservasi lain di sekitar waktu ini", 400);
  }

  const reservation = await createReservation({
    outletId,
    tableId: input.tableId,
    customerId: input.customerId ?? null,
    customerName: input.customerName,
    customerPhone: input.customerPhone ?? null,
    partySize: input.partySize,
    reservedAt,
    notes: input.notes ?? null,
  });

  return toReservationDto(reservation);
}

async function transitionReservation(
  id: string,
  outletId: string,
  expectedFrom: ReservationStatus[],
  nextStatus: ReservationStatus,
  tableStatus: TableStatus | null,
) {
  const existing = await findReservationById(id, outletId);
  if (!existing) throw new NotFoundError("Reservasi tidak ditemukan");
  if (!expectedFrom.includes(existing.status)) {
    throw new AppError(`Reservasi berstatus ${existing.status}, tidak bisa diubah ke ${nextStatus}`, 400);
  }

  const reservation = await updateReservationStatus(id, nextStatus);
  if (tableStatus) {
    await updateTableStatus(existing.tableId, tableStatus);
    emitTableStatus(outletId, existing.tableId, tableStatus);
  }

  return toReservationDto(reservation);
}

export function confirmReservation(id: string, outletId: string) {
  return transitionReservation(id, outletId, ["PENDING"], "CONFIRMED", "RESERVED");
}

export function checkInReservation(id: string, outletId: string) {
  return transitionReservation(id, outletId, ["CONFIRMED"], "SEATED", "OCCUPIED");
}

export function completeReservation(id: string, outletId: string) {
  return transitionReservation(id, outletId, ["SEATED"], "COMPLETED", "AVAILABLE");
}

export function cancelReservation(id: string, outletId: string) {
  return transitionReservation(id, outletId, ["PENDING", "CONFIRMED"], "CANCELLED", "AVAILABLE");
}

export function markNoShow(id: string, outletId: string) {
  return transitionReservation(id, outletId, ["CONFIRMED"], "NO_SHOW", "AVAILABLE");
}
