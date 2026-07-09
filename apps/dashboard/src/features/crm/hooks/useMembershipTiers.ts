import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMembershipTier,
  deleteMembershipTier,
  fetchMembershipTiers,
  updateMembershipTier,
  type MembershipTierPayload,
} from "../services/crm.service";

export function useMembershipTiers() {
  return useQuery({ queryKey: ["crm", "membership-tiers"], queryFn: fetchMembershipTiers });
}

export function useMembershipTierMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["crm", "membership-tiers"] });

  const create = useMutation({
    mutationFn: (payload: MembershipTierPayload) => createMembershipTier(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<MembershipTierPayload> }) =>
      updateMembershipTier(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteMembershipTier(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
