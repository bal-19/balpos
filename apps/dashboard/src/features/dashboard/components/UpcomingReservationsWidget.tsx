import { Card, CardHeader, CardTitle, Spinner } from "@restaurant-pos/ui";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, ChevronRight } from "lucide-react";
import { useReservations } from "../../reservation/hooks/useReservations";

const timeFormatter = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" });

export function UpcomingReservationsWidget() {
  const { data, isLoading } = useReservations();
  const upcoming = (data ?? [])
    .filter((r) => (r.status === "PENDING" || r.status === "CONFIRMED") && new Date(r.reservedAt) >= new Date())
    .sort((a, b) => new Date(a.reservedAt).getTime() - new Date(b.reservedAt).getTime())
    .slice(0, 3);

  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-black/90">
          <CalendarCheck size={16} className="text-primary" />
          Reservasi Mendatang
        </CardTitle>
        <Link to="/reservation" className="text-xs font-semibold text-primary hover:underline">
          Lihat Semua
        </Link>
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
              className="flex items-center gap-3 rounded-lg bg-black/[0.03] p-2.5 text-sm transition-colors hover:bg-black/[0.06]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                {timeFormatter.format(new Date(reservation.reservedAt))}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-black/85">{reservation.customerName}</p>
                <p className="truncate text-xs text-black/45">
                  Meja {reservation.tableName} • {reservation.partySize} tamu
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
