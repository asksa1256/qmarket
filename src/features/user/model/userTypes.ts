export interface UserDetail {
  id: string;
  username: string; // discord id
  nickname: string; // discord nickname
  bio?: string;
  discord_profile_image: string | null;
  created_at: string;
}
