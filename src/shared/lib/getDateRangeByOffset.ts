// 주간 날짜 범위 계산
export function getDateRangeByOffset(offset: number) {
  const base = new Date();

  base.setDate(base.getDate() + offset * 7);

  const day = base.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(base);
  start.setDate(base.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}
