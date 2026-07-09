import type { MembershipTier } from "@prisma/client";
import type { MembershipTier as MembershipTierDto } from "@restaurant-pos/types";
import { NotFoundError } from "../../../shared/errors/app-error.js";
import {
  createMembershipTier,
  deleteMembershipTier,
  findManyMembershipTiers,
  findMembershipTierById,
  updateMembershipTier,
} from "../repository/membership-tier.repository.js";
import type { CreateMembershipTierInput, UpdateMembershipTierInput } from "../schema/membership-tier.schema.js";

function toMembershipTierDto(tier: MembershipTier): MembershipTierDto {
  return {
    id: tier.id,
    outletId: tier.outletId,
    name: tier.name,
    minPoint: tier.minPoint,
    discountPercent: tier.discountPercent.toString(),
  };
}

export async function listMembershipTiers(outletId: string) {
  const tiers = await findManyMembershipTiers(outletId);
  return tiers.map(toMembershipTierDto);
}

export async function createOutletMembershipTier(outletId: string, input: CreateMembershipTierInput) {
  const tier = await createMembershipTier({ ...input, outletId });
  return toMembershipTierDto(tier);
}

export async function updateOutletMembershipTier(id: string, outletId: string, input: UpdateMembershipTierInput) {
  const existing = await findMembershipTierById(id, outletId);
  if (!existing) throw new NotFoundError("Membership tier tidak ditemukan");
  const tier = await updateMembershipTier(id, input);
  return toMembershipTierDto(tier);
}

export async function deleteOutletMembershipTier(id: string, outletId: string) {
  const existing = await findMembershipTierById(id, outletId);
  if (!existing) throw new NotFoundError("Membership tier tidak ditemukan");
  await deleteMembershipTier(id);
}
