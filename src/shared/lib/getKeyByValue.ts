export const getKeyByValue = <T extends Record<string, string>>(
  map: T,
  value: string
): keyof T => {
  const entry = Object.entries(map).find(([_, v]) => v === value);
  return entry?.[0] as keyof T;
};
