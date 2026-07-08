import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as tableService from "../service/table.service.js";

export async function listTables(req: Request, res: Response) {
  ok(res, await tableService.listTables(req.user!.outletId));
}
