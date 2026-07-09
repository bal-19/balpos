import { redis } from "./redis.js";

const REDIS_TIMEOUT_MS = 250;

/**
 * `redis` (core/redis.ts) dikonfigurasi `maxRetriesPerRequest: null` supaya BullMQ
 * Worker retry tanpa batas — tapi itu artinya command biasa (get/set/del) akan
 * menggantung selamanya kalau Redis sedang down, bukan reject. Cache di sini harus
 * best-effort (boleh gagal diam-diam), jadi setiap panggilan dibungkus timeout pendek
 * supaya endpoint yang pakai cache tidak pernah nge-hang gara-gara Redis down.
 */
function withTimeout<T>(promise: Promise<T>): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("redis timeout")), REDIS_TIMEOUT_MS)),
  ]);
}

/**
 * Cache read-through sederhana lewat Redis — hanya dipakai untuk data read-heavy
 * yang toleran stale (dashboard aggregates, katalog kategori/produk). JANGAN
 * dipakai untuk data realtime-critical (order/kitchen/table/shift) yang sudah
 * punya mekanisme invalidasi Socket.IO sendiri di frontend. Kalau Redis tidak
 * bisa diakses, fallback diam-diam ke `fetcher()` langsung (cache murni best-effort).
 */
export async function getOrSetCache<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
  try {
    const cached = await withTimeout(redis.get(key));
    if (cached) return JSON.parse(cached) as T;
  } catch (err) {
    console.error(`[cache] gagal baca key "${key}", fallback ke fetcher`, err);
  }

  const fresh = await fetcher();

  withTimeout(redis.set(key, JSON.stringify(fresh), "EX", ttlSeconds)).catch((err) =>
    console.error(`[cache] gagal simpan key "${key}"`, err),
  );

  return fresh;
}

export function invalidateCache(key: string): Promise<void> {
  return withTimeout(redis.del(key))
    .then(() => undefined)
    .catch((err) => console.error(`[cache] gagal invalidate key "${key}"`, err));
}
