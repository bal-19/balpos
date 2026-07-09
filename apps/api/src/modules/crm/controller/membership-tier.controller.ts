import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as membershipTierService from "../service/membership-tier.service.js";
import type { CreateMembershipTierInput, UpdateMembershipTierInput } from "../schema/membership-tier.schema.js";

export async function listMembershipTiers(req: Request, res: Response) {
  ok(res, await membershipTierService.listMembershipTiers(req.user!.outletId));
}

export async function createMembershipTier(req: Request, res: Response) {
  const input = req.body as CreateMembershipTierInput;
  ok(res, await membershipTierService.createOutletMembershipTier(req.user!.outletId, input), 201);
}

export async function updateMembershipTier(req: Request, res: Response) {
  const input = req.body as UpdateMembershipTierInput;
  ok(
    res,
    await membershipTierService.updateOutletMembershipTier(req.params.id as string, req.user!.outletId, input),
  );
}

export async function deleteMembershipTier(req: Request, res: Response) {
  await membershipTierService.deleteOutletMembershipTier(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}
