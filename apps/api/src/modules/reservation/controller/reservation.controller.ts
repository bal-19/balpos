import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as reservationService from "../service/reservation.service.js";
import type { CreateReservationInput, ListReservationsQuery } from "../schema/reservation.schema.js";

export async function listReservations(req: Request, res: Response) {
  const query = req.query as unknown as ListReservationsQuery;
  const from = query.date ? new Date(`${query.date}T00:00:00`) : undefined;
  const to = query.date ? new Date(`${query.date}T23:59:59.999`) : undefined;
  ok(res, await reservationService.listReservations(req.user!.outletId, { from, to, status: query.status }));
}

export async function createReservation(req: Request, res: Response) {
  const input = req.body as CreateReservationInput;
  ok(res, await reservationService.createOutletReservation(req.user!.outletId, input), 201);
}

export async function confirmReservation(req: Request, res: Response) {
  ok(res, await reservationService.confirmReservation(req.params.id as string, req.user!.outletId));
}

export async function checkInReservation(req: Request, res: Response) {
  ok(res, await reservationService.checkInReservation(req.params.id as string, req.user!.outletId));
}

export async function completeReservation(req: Request, res: Response) {
  ok(res, await reservationService.completeReservation(req.params.id as string, req.user!.outletId));
}

export async function cancelReservation(req: Request, res: Response) {
  ok(res, await reservationService.cancelReservation(req.params.id as string, req.user!.outletId));
}

export async function markNoShow(req: Request, res: Response) {
  ok(res, await reservationService.markNoShow(req.params.id as string, req.user!.outletId));
}
