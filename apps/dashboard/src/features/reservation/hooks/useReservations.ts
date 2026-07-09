import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelReservation,
  checkInReservation,
  completeReservation,
  confirmReservation,
  createReservation,
  fetchReservations,
  markNoShow,
  type ReservationPayload,
} from "../services/reservation.service";

export function useReservations(date?: string) {
  return useQuery({
    queryKey: ["reservation", "reservations", date ?? "all"],
    queryFn: () => fetchReservations(date),
  });
}

export function useReservationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["reservation", "reservations"] });
    queryClient.invalidateQueries({ queryKey: ["pos", "tables"] });
  };

  const create = useMutation({ mutationFn: (payload: ReservationPayload) => createReservation(payload), onSuccess: invalidate });
  const confirm = useMutation({ mutationFn: (id: string) => confirmReservation(id), onSuccess: invalidate });
  const checkIn = useMutation({ mutationFn: (id: string) => checkInReservation(id), onSuccess: invalidate });
  const complete = useMutation({ mutationFn: (id: string) => completeReservation(id), onSuccess: invalidate });
  const cancel = useMutation({ mutationFn: (id: string) => cancelReservation(id), onSuccess: invalidate });
  const noShow = useMutation({ mutationFn: (id: string) => markNoShow(id), onSuccess: invalidate });

  return { create, confirm, checkIn, complete, cancel, noShow };
}
