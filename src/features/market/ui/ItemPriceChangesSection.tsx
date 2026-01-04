import { getItemPriceChanges } from "../model/getItemPriceChanges";

export default async function ItemPriceChangesSection() {
  const priceChanges = await getItemPriceChanges();
  console.log("최근 7일 시세 변동 내역:", priceChanges);

  return <div>시세 변동 내역: {priceChanges.length}건</div>;
}
