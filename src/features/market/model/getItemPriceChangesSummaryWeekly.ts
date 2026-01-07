import { ItemPriceChange } from "./itemPriceChangeTypes";

export const getItemPriceChangesSummaryWeekly = ({
  items,
}: {
  items: ItemPriceChange[];
}) => {
  if (!items.length) return null;

  const up = items.filter((i) => i.change_rate > 0);
  const down = items.filter((i) => i.change_rate < 0);

  const maxUp =
    up.length > 0
      ? up.reduce((prev, curr) =>
          curr.change_rate > prev.change_rate ? curr : prev
        )
      : null;

  const maxDown =
    down.length > 0
      ? down.reduce((prev, curr) =>
          curr.change_rate < prev.change_rate ? curr : prev
        )
      : null;

  return {
    total: items.length,
    upCount: up.length,
    downCount: down.length,
    maxUp,
    maxDown,
  };
};
