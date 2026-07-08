import { toTableDto } from "../dto/table.dto.js";
import { findManyTables } from "../repository/table.repository.js";

export async function listTables(outletId: string) {
  const tables = await findManyTables(outletId);
  return tables.map(toTableDto);
}
