export interface BestDresserEntry {
  id: number;
  created_at: string;
  image_url: string;
  user_id: string | null;
  nickname: string | null;
  votes: number;
  description?: string;
}

export type BestDresserInsert = Omit<BestDresserEntry, "id" | "created_at">;
