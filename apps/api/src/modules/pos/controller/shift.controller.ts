import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as shiftService from "../service/shift.service.js";
import type {
    CloseShiftInput,
    OpenShiftInput,
} from "../schema/shift.schema.js";

export async function getCurrentShift(req: Request, res: Response) {
    ok(res, await shiftService.getCurrentShift(req.user!.outletId));
}

export async function openShift(req: Request, res: Response) {
    const input = req.body as OpenShiftInput;
    const shift = await shiftService.openShift(
        req.user!.outletId,
        req.user!.sub,
        input,
    );
    ok(res, shift, 201);
}

export async function closeShift(req: Request, res: Response) {
    const input = req.body as CloseShiftInput;
    const shift = await shiftService.closeShift(
        req.user!.outletId,
        req.user!.sub,
        input,
    );
    ok(res, shift);
}

export async function getShiftById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || Array.isArray(id)) {
        throw new Error("ID shift tidak valid");
    }
    const shift = await shiftService.getShiftById(req.user!.outletId, id);
    ok(res, shift);
}

export async function getShiftHistory(req: Request, res: Response) {
    const { page, limit, status, startDate, endDate } = req.query;
    const result = await shiftService.getShiftHistory(req.user!.outletId, {
        page: page ? Number.parseInt(page as string) : undefined,
        limit: limit ? Number.parseInt(limit as string) : undefined,
        status: status as "OPEN" | "CLOSED" | undefined,
        startDate: startDate as string | undefined,
        endDate: endDate as string | undefined,
    });
    ok(res, result);
}
