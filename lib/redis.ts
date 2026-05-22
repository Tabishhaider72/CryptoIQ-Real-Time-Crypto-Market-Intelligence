// lib/redis.ts

import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | null | undefined;
}

const isRedisEnabled =
  process.env.REDIS_URL &&
  process.env.REDIS_URL !== "redis://localhost:6379";

const redis =
  global.redis ??
  (isRedisEnabled
    ? new Redis(process.env.REDIS_URL!, {
        maxRetriesPerRequest: 1,
        retryStrategy: () => null,
        reconnectOnError: () => false,
      })
    : null);

if (redis) {
  redis.on("error", () => {
    console.log("Redis unavailable");
  });
}

if (process.env.NODE_ENV !== "production") {
  global.redis = redis;
}

export default redis;