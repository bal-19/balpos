import { Card, CardHeader, CardTitle, Spinner } from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { useReservations } from "../../reservation/hooks/useReservations";

export function UpcomingReservationsWidget() {
  const { data, isLoading } = useReservations();
  const upcoming = (data ?? [])
    .filter((r) => (r.status === "PENDING" || r.status === "CONFIRMED") && new Date(r.reservedAt) >= new Date())
    .sort((a, b) => new Date(a.reservedAt).getTime() - new Date(b.reservedAt).getTime())
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck size={16} className="text-primary" />
          Reservasi Mendatang
        </CardTitle>
      </CardHeader>
      {isLoading ? (
        <Spinner />
      ) : upcoming.length === 0 ? (
        <p className="text-sm text-black/40">Tidak ada reservasi mendatang.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {upcoming.map((reservation) => (
            <div
              key={reservation.id}
              className="flex items-center justify-between rounded-xl border border-black/10 p-2 text-sm"
            >
              <div>
                <p className="font-medium">{reservation.customerName}</p>
                <p className="text-xs text-black/40">
                  Meja {reservation.tableName} • {reservation.partySize} tamu •{" "}
                  {formatDateTime(reservation.reservedAt)}
                </p>
              </div>
              <ChevronRight size={16} className="shrink-0 text-black/30" />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
