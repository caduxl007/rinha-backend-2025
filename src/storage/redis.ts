import { createClient } from "redis";
import { CreatePayment } from "../interfaces";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

const KEY = "payments";

export async function connectRedis() {
  await redis.connect();
  console.log("Connected to Redis");
}

export async function disconnectRedis() {
  await redis.quit();
  console.log("Disconnected from Redis");
}

export async function savePayment(payment: CreatePayment) {
  const timestamp = Date.now();

  await redis.zAdd(KEY, {
    score: timestamp,
    value: JSON.stringify({ ...payment, requested_at: timestamp }),
  });
}

export async function getPayments(from?: Date, to?: Date) {
  const start = from ? from.getTime() : 0;
  const end = to ? to.getTime() : Date.now();

  const payments = await redis.zRangeByScore(KEY, start, end);


  return { payments };
}

export async function deletePayments() {
  await redis.del(KEY);
}
