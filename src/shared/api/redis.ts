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

/* 일일 등록 가능 횟수 조회 */
export async function getDailyItemCount(userId: string): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  const current = (await redis.get<number>(rateLimitKey)) ?? 0;
  return current;
}

/* 횟수 제한 확인 함수 */
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

/* 등록 횟수 갱신까지 남은 시간 리턴 함수 */
export async function getRemainingTime(userId: string): Promise<number> {
  const redis = getRedisClient();
  const today = new Date().toISOString().slice(0, 10);
  const rateLimitKey = `rate:insert:items:${userId}:${today}`;

  // TTL 조회 (초 단위)
  const ttl = await redis.ttl(rateLimitKey);
  return ttl > 0 ? ttl : 0;
}

/* 아이템 삭제 시 등록 횟수 1회 복구 */
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

/* 검색어 점수 증가 */
const BASE_SEARCH_KEY = "search:rank";

/* 특정 시간별 redis 키 생성 */
const getHourlyKey = (date: Date) => {
  const dateStr = date.toISOString().replace(/[-T:]/g, "").slice(0, 10);
  return `${BASE_SEARCH_KEY}:${dateStr}`;
};

export async function logSearchKeyword(keyword: string, itemGender: string) {
  if (!keyword || !itemGender) return;

  const redis = getRedisClient();

  // 현재 시간 기준 키 생성
  const hourlyKey = getHourlyKey(new Date());

  try {
    await redis.zincrby(hourlyKey, 1, `${keyword}(${itemGender})`);
    // 키의 유효기간을 25시간으로 설정 (조회 로직이 작동하는 동안 해당 시간대의 키가 살아있음을 보장하기 위해 유효기간을 1시간 추가)
    await redis.expire(hourlyKey, 25 * 60 * 60);
  } catch (error) {
    console.error("Redis 기록 에러:", error);
  }
}

/* 인기 검색어 top N 집계 */
export async function getPopularSearches() {
  const redis = getRedisClient();

  const now = new Date();
  // 최근 24시간 키 생성
  const keys = Array.from({ length: 24 }, (_, i) =>
    getHourlyKey(new Date(now.getTime() - i * 60 * 60 * 1000))
  );

  // 임시 키 이름 생성 (고유값, 키 충돌 방지)
  const tempUnionKey = `${BASE_SEARCH_KEY}:24h_union_temp`;

  try {
    // 1. 최근 24개 키 합산
    await redis.zunionstore(tempUnionKey, keys.length, keys);
    // 2. 임시 키는 1분 뒤 삭제
    await redis.expire(tempUnionKey, 60);

    // 3. Top N 가져오기
    const rank = await redis.zrange(tempUnionKey, 0, 9, {
      rev: true,
      withScores: true,
    });

    const formatted = [];
    for (let i = 0; i < rank.length; i += 2) {
      formatted.push({
        keyword: rank[i] as string,
        score: rank[i + 1] as number,
      });
    }

    return formatted;
  } catch (error) {
    console.error("인기 검색어 조회 에러:", error);
    return [];
  }
}

/* 베스트 드레서 참가 횟수 카운트 */
const MAX_ENTRIES_PER_USER = 3;
const REDIS_KEY_PREFIX = "best_dresser:entries:";

// 유저별 잔여 횟수, 최대 등록 횟수 지정
export async function checkUserEntryLimit(userId: string): Promise<{
  canEnter: boolean;
  currentCount: number;
  remainingCount: number;
}> {
  const redis = getRedisClient();
  const key = `${REDIS_KEY_PREFIX}${userId}`;
  const count = (await redis.get<number>(key)) || 0;

  return {
    canEnter: count < MAX_ENTRIES_PER_USER,
    currentCount: count,
    remainingCount: Math.max(0, MAX_ENTRIES_PER_USER - count),
  };
}

// 참가 등록 후 잔여 횟수 카운트
export async function incrementUserEntryCount(userId: string): Promise<void> {
  const redis = getRedisClient();
  const key = `${REDIS_KEY_PREFIX}${userId}`;
  await redis.incr(key);
}

// 유저별 잔여 횟수 불러오기
export async function getUserEntryCount(userId: string): Promise<number> {
  const redis = getRedisClient();
  const key = `${REDIS_KEY_PREFIX}${userId}`;
  return (await redis.get<number>(key)) || 0;
}

// 게시글 삭제 시 잔여 횟수 복원
export async function restoreEntryCount(userId: string) {
  const redis = getRedisClient();
  const key = `${REDIS_KEY_PREFIX}${userId}`;

  try {
    const currentCount = await redis.get<number>(key);

    // 기록이 없거나 이미 0이라면 복원하지 않음
    if (currentCount === null || currentCount <= 0) {
      return { success: true, remainingCount: MAX_ENTRIES_PER_USER };
    }

    // 사용 횟수 1 감소 (잔여 횟수 1 복원)
    const updatedCount = await redis.decr(key);

    // 사용 횟수 음수 방지
    if (updatedCount < 0) {
      await redis.set(key, 0);
      return { success: true, remainingCount: MAX_ENTRIES_PER_USER };
    }

    return {
      success: true,
      remainingCount: Math.max(0, MAX_ENTRIES_PER_USER - updatedCount),
    };
  } catch (error) {
    console.error("Redis 복원 에러:", error);
    return { success: false, error: "횟수 복원에 실패했습니다." };
  }
}
