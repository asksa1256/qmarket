import ItemPriceChangesTable from "./ItemPriceChangesTable";

export default async function ItemPriceChangesSection({
  limit,
}: {
  limit?: number;
}) {
  return <ItemPriceChangesTable limit={limit} />;
}
