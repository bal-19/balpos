import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as reservationController from "../controller/reservation.controller.js";
import { createReservationSchema, listReservationsQuerySchema } from "../schema/reservation.schema.js";

export const reservationRoutes = Router();

reservationRoutes.use(requireAuth);

reservationRoutes.get(
  "/reservations",
  requirePermission(PERMISSION_CODES.RESERVATION_VIEW),
  validate(listReservationsQuerySchema, "query"),
  asyncHandler(reservationController.listReservations),
);
reservationRoutes.post(
  "/reservations",
  requirePermission(PERMISSION_CODES.RESERVATION_MANAGE),
  validate(createReservationSchema),
  asyncHandler(reservationController.createReservation),
);
reservationRoutes.patch(
  "/reservations/:id/confirm",
  requirePermission(PERMISSION_CODES.RESERVATION_MANAGE),
  asyncHandler(reservationController.confirmReservation),
);
reservationRoutes.patch(
  "/reservations/:id/check-in",
  requirePermission(PERMISSION_CODES.RESERVATION_MANAGE),
  asyncHandler(reservationController.checkInReservation),
);
reservationRoutes.patch(
  "/reservations/:id/complete",
  requirePermission(PERMISSION_CODES.RESERVATION_MANAGE),
  asyncHandler(reservationController.completeReservation),
);
reservationRoutes.patch(
  "/reservations/:id/cancel",
  requirePermission(PERMISSION_CODES.RESERVATION_MANAGE),
  asyncHandler(reservationController.cancelReservation),
);
reservationRoutes.patch(
  "/reservations/:id/no-show",
  requirePermission(PERMISSION_CODES.RESERVATION_MANAGE),
  asyncHandler(reservationController.markNoShow),
);
