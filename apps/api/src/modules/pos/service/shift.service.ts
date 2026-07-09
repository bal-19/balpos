import type { Shift as ShiftDto } from "@restaurant-pos/types";
import { getIO } from "../../../core/socket.js";
import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import {
    closeShiftRecord,
    createShift,
    findActiveShift,
    findShiftById,
    findShifts,
    getCashSalesForShift,
    type ShiftWithUsers,
} from "../repository/shift.repository.js";
import type {
    CloseShiftInput,
    OpenShiftInput,
} from "../schema/shift.schema.js";

function round2(value: number): number {
    return Math.round(value * 100) / 100;
}

async function toShiftDto(
    shift: ShiftWithUsers,
    outletId: string,
): Promise<ShiftDto> {
    const cashSalesSoFar =
        shift.status === "OPEN"
            ? await getCashSalesForShift(outletId, shift.id)
            : 0;
    return {
        id: shift.id,
        outletId: shift.outletId,
        openedBy: shift.openedBy,
        openedByName: shift.openedByUser.name,
        closedBy: shift.closedBy,
        closedByName: shift.closedByUser?.name ?? null,
        openingBalance: shift.openingBalance.toString(),
        closingBalance: shift.closingBalance?.toString() ?? null,
        expectedBalance: shift.expectedBalance?.toString() ?? null,
        variance: shift.variance?.toString() ?? null,
        cashSalesSoFar: cashSalesSoFar.toFixed(2),
        status: shift.status,
        notes: shift.notes,
        openedAt: shift.openedAt.toISOString(),
        closedAt: shift.closedAt?.toISOString() ?? null,
    };
}

function emitShiftUpdated(outletId: string, status: "OPEN" | "CLOSED") {
    getIO().to(`outlet:${outletId}`).emit("pos:shift.updated", { status });
}

export async function getCurrentShift(
    outletId: string,
): Promise<ShiftDto | null> {
    const shift = await findActiveShift(outletId);
    if (!shift) return null;
    return toShiftDto(shift, outletId);
}

/** Dipakai order.service.ts untuk memastikan ada shift aktif sebelum order POS dibuat. */
export async function assertActiveShiftId(outletId: string): Promise<string> {
    const shift = await findActiveShift(outletId);
    if (!shift) {
        throw new AppError(
            "Sesi kasir belum dibuka. Buka sesi terlebih dahulu sebelum membuat order.",
            400,
        );
    }
    return shift.id;
}

export async function openShift(
    outletId: string,
    userId: string,
    input: OpenShiftInput,
): Promise<ShiftDto> {
    const existing = await findActiveShift(outletId);
    if (existing) {
        throw new AppError(
            "Sesi kasir sudah dibuka. Tutup sesi yang sedang berjalan terlebih dahulu.",
            400,
        );
    }

    const shift = await createShift({
        outletId,
        openedBy: userId,
        openingBalance: input.openingBalance,
        status: "OPEN",
    });

    emitShiftUpdated(outletId, "OPEN");
    return toShiftDto(shift, outletId);
}

export async function closeShift(
    outletId: string,
    userId: string,
    input: CloseShiftInput,
): Promise<ShiftDto> {
    const existing = await findActiveShift(outletId);
    if (!existing)
        throw new NotFoundError("Tidak ada sesi kasir yang sedang berjalan");

    const cashSales = await getCashSalesForShift(outletId, existing.id);
    const expectedBalance = round2(
        existing.openingBalance.toNumber() + cashSales,
    );
    const closingBalance = round2(Number.parseFloat(input.closingBalance));
    const variance = round2(closingBalance - expectedBalance);

    const shift = await closeShiftRecord(existing.id, {
        closedBy: userId,
        closingBalance: closingBalance.toFixed(2),
        expectedBalance: expectedBalance.toFixed(2),
        variance: variance.toFixed(2),
        notes: input.notes ?? null,
        closedAt: new Date(),
    });

    emitShiftUpdated(outletId, "CLOSED");
    return toShiftDto(shift, outletId);
}

export async function getShiftById(
    outletId: string,
    shiftId: string,
): Promise<ShiftDto> {
    const shift = await findShiftById(shiftId, outletId);
    if (!shift) throw new NotFoundError("Shift tidak ditemukan");
    return toShiftDto(shift, outletId);
}

export async function getShiftHistory(
    outletId: string,
    options: {
        page?: number;
        limit?: number;
        status?: "OPEN" | "CLOSED";
        startDate?: string;
        endDate?: string;
    },
): Promise<{ shifts: ShiftDto[]; total: number; page: number; limit: number }> {
    const page = options.page ?? 1;
    const limit = options.limit ?? 20;

    const { shifts, total } = await findShifts(outletId, {
        page,
        limit,
        status: options.status,
        startDate: options.startDate ? new Date(options.startDate) : undefined,
        endDate: options.endDate ? new Date(options.endDate) : undefined,
    });

    const shiftsDto = await Promise.all(
        shifts.map((s) => toShiftDto(s, outletId)),
    );

    return { shifts: shiftsDto, total, page, limit };
}
