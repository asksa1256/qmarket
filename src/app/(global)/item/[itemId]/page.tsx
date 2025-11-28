export default function ItemDetailPage({
  params,
}: {
  params: { itemId: string };
}) {
  return (
    <section>
      <h1>Item Detail Page - {params.itemId}</h1>
    </section>
  );
}
