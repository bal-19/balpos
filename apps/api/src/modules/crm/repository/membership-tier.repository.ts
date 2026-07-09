import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function findManyMembershipTiers(outletId: string) {
  return prisma.membershipTier.findMany({ where: { outletId }, orderBy: { minPoint: "asc" } });
}

export function findMembershipTierById(id: string, outletId: string) {
  return prisma.membershipTier.findFirst({ where: { id, outletId } });
}

export function createMembershipTier(data: Prisma.MembershipTierUncheckedCreateInput) {
  return prisma.membershipTier.create({ data });
}

export function updateMembershipTier(id: string, data: Prisma.MembershipTierUpdateInput) {
  return prisma.membershipTier.update({ where: { id }, data });
}

export function deleteMembershipTier(id: string) {
  return prisma.membershipTier.delete({ where: { id } });
}
