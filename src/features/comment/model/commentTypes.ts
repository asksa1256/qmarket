export interface Comment {
  id: string;
  item_id: number;
  user_id: string;
  nickname: string;
  content: string;
  created_at: string;
  parent_id: string | null;
}

export interface OrganizedComment extends Comment {
  replies: Comment[];
}
