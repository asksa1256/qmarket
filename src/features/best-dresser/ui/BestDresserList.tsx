import { getBestDressers } from "../model/getBestDressers";
import InstaCard from "@/shared/ui/InstaCard";

export default async function BestDresserList() {
  const data = await getBestDressers();
  return (
    <ol className="flex gap-4">
      {data.map((d, i) => (
        <li key={d.id} className="w-full">
          <InstaCard data={d} idx={i} />
        </li>
      ))}
    </ol>
  );
}
