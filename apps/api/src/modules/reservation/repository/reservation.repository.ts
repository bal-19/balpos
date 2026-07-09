import type { Prisma, ReservationStatus, TableStatus } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

const ACTIVE_STATUSES: ReservationStatus[] = ["PENDING", "CONFIRMED", "SEATED"];

export function findManyReservations(
  outletId: string,
  filters: { from?: Date; to?: Date; status?: ReservationStatus },
) {
  return prisma.reservation.findMany({
    where: {
      outletId,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.from || filters.to
        ? {
            reservedAt: {
              ...(filters.from ? { gte: filters.from } : {}),
              ...(filters.to ? { lt: filters.to } : {}),
            },
          }
        : {}),
    },
    include: { table: true },
    orderBy: { reservedAt: "asc" },
  });
}

export function findReservationById(id: string, outletId: string) {
  return prisma.reservation.findFirst({ where: { id, outletId }, include: { table: true } });
}

/** Cek konflik jadwal: reservasi aktif lain di meja sama dalam window ±windowMs dari reservedAt. */
export function findOverlappingReservations(tableId: string, reservedAt: Date, windowMs: number) {
  const from = new Date(reservedAt.getTime() - windowMs);
  const to = new Date(reservedAt.getTime() + windowMs);
  return prisma.reservation.findMany({
    where: { tableId, status: { in: ACTIVE_STATUSES }, reservedAt: { gte: from, lte: to } },
  });
}

export function createReservation(data: Prisma.ReservationUncheckedCreateInput) {
  return prisma.reservation.create({ data, include: { table: true } });
}

export function updateReservationStatus(id: string, status: ReservationStatus) {
  return prisma.reservation.update({ where: { id }, data: { status }, include: { table: true } });
}

export function findTableForOutlet(id: string, outletId: string) {
  return prisma.table.findFirst({ where: { id, outletId } });
}

export function updateTableStatus(id: string, status: TableStatus) {
  return prisma.table.update({ where: { id }, data: { status } });
}
