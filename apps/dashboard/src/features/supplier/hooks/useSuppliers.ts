import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSupplier,
  deleteSupplier,
  fetchSuppliers,
  updateSupplier,
  type SupplierPayload,
} from "../services/supplier.service";

export function useSuppliers() {
  return useQuery({ queryKey: ["supplier", "suppliers"], queryFn: fetchSuppliers });
}

export function useSupplierMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["supplier", "suppliers"] });

  const create = useMutation({
    mutationFn: (payload: SupplierPayload) => createSupplier(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SupplierPayload> }) =>
      updateSupplier(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteSupplier(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
