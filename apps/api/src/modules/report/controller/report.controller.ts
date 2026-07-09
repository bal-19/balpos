import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as reportService from "../service/report.service.js";
import type { CreateExportInput, ListExportsQuery, ReportSummaryQuery } from "../schema/report.schema.js";

export async function getSummary(req: Request, res: Response) {
  ok(res, await reportService.getSummary(req.user!.outletId, req.query as unknown as ReportSummaryQuery));
}

export async function createExport(req: Request, res: Response) {
  const input = req.body as CreateExportInput;
  const job = await reportService.requestExport(req.user!.outletId, req.user!.tenantId, req.user!.sub, input);
  ok(res, job, 202);
}

export async function listExports(req: Request, res: Response) {
  ok(res, await reportService.listExports(req.user!.outletId, req.query as unknown as ListExportsQuery));
}

export async function getExport(req: Request, res: Response) {
  ok(res, await reportService.getExportById(req.params.id as string, req.user!.outletId));
}
