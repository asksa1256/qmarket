import { BestDresserEntry } from "../model/bestDresserType";
import InstaCard from "@/shared/ui/InstaCard";

export default async function BestDresserList({
  data,
}: {
  data: BestDresserEntry[];
}) {
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
