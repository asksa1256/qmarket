/**
 * Map의 value로 key를 찾는 유틸 함수
 * DB에 한글로 저장된 값을 폼 스키마의 영어 key로 변환할 때 사용
 */
export const getKeyByValue = <T extends Record<string, string>>(
  map: T,
  value: string
): keyof T => {
  const entry = Object.entries(map).find(([, v]) => v === value);
  return entry?.[0] as keyof T;
};
