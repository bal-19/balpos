import type { ReportFilter } from "@restaurant-pos/types";

export interface Bucket {
  start: Date;
  end: Date;
  label: string;
}

export interface ResolvedRange {
  from: Date;
  to: Date;
  buckets: Bucket[];
}

/** Resolve filter (Harian/Mingguan/Bulanan/Custom) -> range tanggal konkret + bucket harian. */
export function resolveReportRange(filter: ReportFilter, from?: string, to?: string): ResolvedRange {
  const now = new Date();
  let start: Date;
  let end: Date;

  if (filter === "CUSTOM") {
    start = new Date(from!);
    end = new Date(to!);
  } else if (filter === "DAILY") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
    end = new Date(start);
    end.setDate(end.getDate() + 1);
  } else if (filter === "WEEKLY") {
    start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);
    end = new Date(now);
    end.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() + 1);
  } else {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
    end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  }

  const buckets: Bucket[] = [];
  const cursor = new Date(start);
  while (cursor < end) {
    const bucketStart = new Date(cursor);
    const bucketEnd = new Date(cursor);
    bucketEnd.setDate(bucketEnd.getDate() + 1);
    buckets.push({
      start: bucketStart,
      end: bucketEnd,
      label: new Intl.DateTimeFormat("id-ID", { day: "2-digit", month: "short" }).format(bucketStart),
    });
    cursor.setDate(cursor.getDate() + 1);
  }

  return { from: start, to: end, buckets };
}
