import { Redis } from "@upstash/redis";

const TTL_SECONDS = 60 * 60 * 24; // 24시간
const DAILY_LIMIT = 12; // 하루 12회

function getRedisClient() {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    throw new Error("REDIS URL과 TOKEN을 환경변수에서 불러오지 못했습니다.");
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  });
}

// 카운트 조회 함수
export async function getDailyItemCount(userId: string): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  const current = (await redis.get<number>(rateLimitKey)) ?? 0;
  return current;
}

// 카운트 증가 + 제한 확인 함수
export async function checkAndIncrementDailyItemLimit(
  userId: string
): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  const pipeline = redis.pipeline();
  pipeline.incr(rateLimitKey);
  pipeline.expire(rateLimitKey, TTL_SECONDS);
  const results = await pipeline.exec();
  const currentCount = results[0] as number;

  if (currentCount > DAILY_LIMIT) {
    throw new Error(`하루 등록 가능 횟수(${DAILY_LIMIT})를 초과했습니다.`);
  }

  return currentCount;
}

// 등록 횟수 갱신까지 남은 시간 표시 함수
export async function getRemainingTime(userId: string): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  // TTL 조회 (초 단위)
  const ttl = await redis.ttl(rateLimitKey);
  return ttl > 0 ? ttl : 0;
}

export { DAILY_LIMIT };
