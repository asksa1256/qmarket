import { Redis } from "@upstash/redis";

const TTL_SECONDS = 60 * 60 * 24; // 24시간
export const DAILY_LIMIT = 12; // 하루 12회
// const TTL_SECONDS = 10; // 테스트용
// const DAILY_LIMIT = 3;

function getRedisClient() {
  if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
    throw new Error("REDIS URL과 TOKEN을 환경변수에서 불러오지 못했습니다.");
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_URL!,
    token: process.env.UPSTASH_REDIS_TOKEN!,
  });
}

// 일일 등록 가능 횟수 조회
export async function getDailyItemCount(userId: string): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  const current = (await redis.get<number>(rateLimitKey)) ?? 0;
  return current;
}

// 횟수 제한 확인 함수
export async function checkAndIncrementDailyItemLimit(
  userId: string
): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  // 현재 카운트 조회
  const currentCount = (await redis.get<number>(rateLimitKey)) ?? 0;

  // 제한 확인 (증가 전에 체크)
  if (currentCount >= DAILY_LIMIT) {
    throw new Error(`일일 등록 가능 횟수(${DAILY_LIMIT})를 초과했습니다.`);
  }

  // 카운트 증가 및 TTL 설정
  const pipeline = redis.pipeline();
  pipeline.incr(rateLimitKey);

  // 첫 등록 시 TTL 설정 (일단 긴 시간으로)
  if (currentCount === 0) {
    pipeline.expire(rateLimitKey, 60 * 60 * 24); // 24시간
  }

  // 마지막 등록 시 TTL 재설정
  if (currentCount === DAILY_LIMIT - 1) {
    pipeline.expire(rateLimitKey, TTL_SECONDS);
  }

  const results = await pipeline.exec();
  const newCount = results[0] as number;

  return newCount;
}

// 등록 횟수 갱신까지 남은 시간 리턴 함수
export async function getRemainingTime(userId: string): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  // TTL 조회 (초 단위)
  const ttl = await redis.ttl(rateLimitKey);
  return ttl > 0 ? ttl : 0;
}

// 아이템 삭제 시 등록 횟수 1회 복구
export async function restoreDailyItemCount(userId: string): Promise<void> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  const currentCount = await redis.get<number>(rateLimitKey);

  // 카운트 음수 방지
  if (currentCount && currentCount > 0) {
    await redis.decr(rateLimitKey);
  }
}
