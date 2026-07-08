import { prisma } from "../../../database/prisma.js";
import type { Prisma } from "@prisma/client";

export function findFirstStoreSetting() {
  return prisma.storeSetting.findFirst();
}

export function findStoreSettingByOutlet(outletId: string) {
  return prisma.storeSetting.findUnique({ where: { outletId } });
}

export function updateStoreSettingByOutlet(outletId: string, data: Prisma.StoreSettingUpdateInput) {
  return prisma.storeSetting.update({ where: { outletId }, data });
}
