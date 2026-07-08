import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as storeSettingService from "../service/store-setting.service.js";
import type { UpdateStoreSettingInput } from "../schema/store-setting.schema.js";

export async function getPublicTheme(_req: Request, res: Response) {
  ok(res, await storeSettingService.getPublicTheme());
}

export async function getPublicOutletInfo(_req: Request, res: Response) {
  ok(res, await storeSettingService.getPublicOutletInfo());
}

export async function getStoreSetting(req: Request, res: Response) {
  ok(res, await storeSettingService.getStoreSetting(req.user!.outletId));
}

export async function updateStoreSetting(req: Request, res: Response) {
  const input = req.body as UpdateStoreSettingInput;
  ok(res, await storeSettingService.updateStoreSetting(req.user!.outletId, input));
}
