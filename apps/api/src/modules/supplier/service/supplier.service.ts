import type { Supplier } from "@prisma/client";
import type { Supplier as SupplierDto } from "@restaurant-pos/types";
import { NotFoundError } from "../../../shared/errors/app-error.js";
import {
  createSupplier,
  deleteSupplier,
  findManySuppliers,
  findSupplierById,
  updateSupplier,
} from "../repository/supplier.repository.js";
import type { CreateSupplierInput, UpdateSupplierInput } from "../schema/supplier.schema.js";

function toSupplierDto(supplier: Supplier): SupplierDto {
  return {
    id: supplier.id,
    outletId: supplier.outletId,
    name: supplier.name,
    phone: supplier.phone,
    address: supplier.address,
  };
}

export async function listSuppliers(outletId: string) {
  const suppliers = await findManySuppliers(outletId);
  return suppliers.map(toSupplierDto);
}

export async function createOutletSupplier(outletId: string, input: CreateSupplierInput) {
  const supplier = await createSupplier({ ...input, outletId });
  return toSupplierDto(supplier);
}

export async function updateOutletSupplier(id: string, outletId: string, input: UpdateSupplierInput) {
  const existing = await findSupplierById(id, outletId);
  if (!existing) throw new NotFoundError("Supplier tidak ditemukan");
  const supplier = await updateSupplier(id, input);
  return toSupplierDto(supplier);
}

export async function deleteOutletSupplier(id: string, outletId: string) {
  const existing = await findSupplierById(id, outletId);
  if (!existing) throw new NotFoundError("Supplier tidak ditemukan");
  await deleteSupplier(id);
}
