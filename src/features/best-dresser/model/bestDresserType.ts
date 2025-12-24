export interface BestDresserEntry {
  id: number;
  created_at: string;
  image_url: string;
  user_id: string | null;
  nickname: string | null;
  votes: number;
  description?: string;
  comments_count: { count: number }[];
}

export type BestDresserInsert = Omit<BestDresserEntry, "id" | "created_at">;

export interface EntryFormValues {
  imageFile: File | null;
  description?: string;
}
