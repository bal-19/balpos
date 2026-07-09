import type { Customer, MembershipTier } from "@prisma/client";
import type { Customer as CustomerDto } from "@restaurant-pos/types";
import { NotFoundError } from "../../../shared/errors/app-error.js";
import {
  createCustomer,
  findCustomerById,
  findManyCustomers,
  softDeleteCustomer,
  updateCustomer,
} from "../repository/customer.repository.js";
import type { CreateCustomerInput, UpdateCustomerInput } from "../schema/customer.schema.js";

type CustomerWithTier = Customer & { membershipTier: MembershipTier | null };

function toCustomerDto(customer: CustomerWithTier): CustomerDto {
  return {
    id: customer.id,
    outletId: customer.outletId,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    membershipTierId: customer.membershipTierId,
    membershipTierName: customer.membershipTier?.name ?? null,
    pointBalance: customer.pointBalance,
    createdAt: customer.createdAt.toISOString(),
  };
}

export async function listCustomers(outletId: string) {
  const customers = await findManyCustomers(outletId);
  return customers.map(toCustomerDto);
}

export async function getCustomer(id: string, outletId: string) {
  const customer = await findCustomerById(id, outletId);
  if (!customer) throw new NotFoundError("Pelanggan tidak ditemukan");
  return toCustomerDto(customer);
}

export async function createOutletCustomer(outletId: string, input: CreateCustomerInput) {
  const customer = await createCustomer({
    ...input,
    phone: input.phone ?? null,
    email: input.email ?? null,
    membershipTierId: input.membershipTierId ?? null,
    outletId,
  });
  return toCustomerDto(customer);
}

export async function updateOutletCustomer(id: string, outletId: string, input: UpdateCustomerInput) {
  const existing = await findCustomerById(id, outletId);
  if (!existing) throw new NotFoundError("Pelanggan tidak ditemukan");
  const customer = await updateCustomer(id, input);
  return toCustomerDto(customer);
}

export async function deleteOutletCustomer(id: string, outletId: string) {
  const existing = await findCustomerById(id, outletId);
  if (!existing) throw new NotFoundError("Pelanggan tidak ditemukan");
  await softDeleteCustomer(id);
}
