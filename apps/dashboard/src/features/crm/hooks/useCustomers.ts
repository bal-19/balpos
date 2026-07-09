import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCustomer,
  deleteCustomer,
  fetchCustomerPoints,
  fetchCustomers,
  updateCustomer,
  type CustomerPayload,
} from "../services/crm.service";

export function useCustomers() {
  return useQuery({ queryKey: ["crm", "customers"], queryFn: fetchCustomers });
}

export function useCustomerPoints(id: string | null) {
  return useQuery({
    queryKey: ["crm", "customers", id, "points"],
    queryFn: () => fetchCustomerPoints(id as string),
    enabled: !!id,
  });
}

export function useCustomerMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["crm", "customers"] });

  const create = useMutation({
    mutationFn: (payload: CustomerPayload) => createCustomer(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CustomerPayload> }) =>
      updateCustomer(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
