import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as auditLogService from "../service/audit-log.service.js";
import type { ListAuditLogQuery } from "../schema/audit-log.schema.js";

export async function listAuditLogs(req: Request, res: Response) {
  const query = req.query as unknown as ListAuditLogQuery;
  ok(res, await auditLogService.listOutletAuditLogs(req.user!.outletId, query));
}
