import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

const shiftInclude = {
    openedByUser: { select: { name: true } },
    closedByUser: { select: { name: true } },
} satisfies Prisma.ShiftInclude;

export type ShiftWithUsers = Prisma.ShiftGetPayload<{
    include: typeof shiftInclude;
}>;

export function findActiveShift(
    outletId: string,
): Promise<ShiftWithUsers | null> {
    return prisma.shift.findFirst({
        where: { outletId, status: "OPEN" },
        include: shiftInclude,
    });
}

export function findShiftById(
    id: string,
    outletId: string,
): Promise<ShiftWithUsers | null> {
    return prisma.shift.findFirst({
        where: { id, outletId },
        include: shiftInclude,
    });
}

export function createShift(
    data: Prisma.ShiftUncheckedCreateInput,
): Promise<ShiftWithUsers> {
    return prisma.shift.create({ data, include: shiftInclude });
}

export function closeShiftRecord(
    id: string,
    data: {
        closedBy: string;
        closingBalance: string;
        expectedBalance: string;
        variance: string;
        notes: string | null;
        closedAt: Date;
    },
): Promise<ShiftWithUsers> {
    return prisma.shift.update({
        where: { id },
        data: { ...data, status: "CLOSED" },
        include: shiftInclude,
    });
}

/** Total penjualan CASH yang sudah COMPLETED dalam shift ini — dipakai untuk hitung expectedBalance. */
export async function getCashSalesForShift(
    outletId: string,
    shiftId: string,
): Promise<number> {
    const result = await prisma.order.aggregate({
        where: {
            outletId,
            shiftId,
            status: "COMPLETED",
            payments: { some: { method: "CASH", status: "PAID" } },
        },
        _sum: { totalAmount: true },
    });
    return result._sum.totalAmount?.toNumber() ?? 0;
}

export interface FindShiftsOptions {
    page?: number;
    limit?: number;
    status?: "OPEN" | "CLOSED";
    startDate?: Date;
    endDate?: Date;
}

export async function findShifts(
    outletId: string,
    options: FindShiftsOptions = {},
): Promise<{ shifts: ShiftWithUsers[]; total: number }> {
    const { page = 1, limit = 20, status, startDate, endDate } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ShiftWhereInput = {
        outletId,
        ...(status && { status }),
        ...(startDate && { openedAt: { gte: startDate } }),
        ...(endDate && { openedAt: { lte: endDate } }),
    };

    const [shifts, total] = await Promise.all([
        prisma.shift.findMany({
            where,
            include: shiftInclude,
            orderBy: { openedAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.shift.count({ where }),
    ]);

    return { shifts, total };
}
