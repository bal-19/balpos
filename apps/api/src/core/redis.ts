import IORedis from "ioredis";
import { env } from "../config/env.js";

/**
 * Shared Redis connection — dipakai langsung untuk cache/pubsub dan
 * sebagai `connection` untuk setiap BullMQ Queue/Worker per module.
 */
export const redis = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});
