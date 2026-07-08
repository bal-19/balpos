import type { Table as TableDto } from "@restaurant-pos/types";
import type { Table } from "@prisma/client";

export function toTableDto(table: Table): TableDto {
  return {
    id: table.id,
    outletId: table.outletId,
    name: table.name,
    capacity: table.capacity,
    isActive: table.isActive,
  };
}
