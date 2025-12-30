import { getBestDressers } from "../model/getBestDressers";
import BestDresserCarousel from "./BestDresserCarousel";

export default async function BestDresserSection() {
  const data = await getBestDressers();

  return (
    <ol className="mb-16">
      <BestDresserCarousel data={data} />
    </ol>
  );
}
