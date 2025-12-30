import { BestDresserEntry, BestDresserRanked } from "./bestDresserType";

export const applyBestDresserRank = (
  data: BestDresserEntry[]
): BestDresserRanked[] => {
  let currentRank = 0;
  let lastVotes = -1;

  return data.map((d) => {
    if (d.votes !== lastVotes) {
      currentRank++;
    }
    lastVotes = d.votes;
    return { ...d, rank: currentRank };
  });
};
