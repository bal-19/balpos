import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { closeShift, fetchCurrentShift, openShift } from "../services/pos.service";

export function useCurrentShift() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["pos", "shift", "current"], queryFn: fetchCurrentShift });

  useSocketEvent("pos:shift.updated", () => {
    queryClient.invalidateQueries({ queryKey: ["pos", "shift", "current"] });
  });

  return query;
}

export function useOpenShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { openingBalance: string }) => openShift(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pos", "shift", "current"] }),
  });
}

export function useCloseShift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { closingBalance: string; notes?: string | null }) => closeShift(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pos", "shift", "current"] }),
  });
}
