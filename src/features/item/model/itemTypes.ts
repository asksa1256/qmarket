export type ItemSource = "gatcha" | "shop" | "lottery" | "magic";
export type ItemGender = "w" | "m";
export type ItemCategory =
  | "face"
  | "hair"
  | "clothes"
  | "mouth"
  | "eye"
  | "ear"
  | "pet"
  | "acc"
  | "bg"
  | "slime"
  | "qmon"
  | "board"
  | "game";

export interface Item {
  id: string; // 상품 ID
  item_name: string; // 상품명
  price: number; // 가격
  image: string; // 이미지 URL (컬럼명 변경)
  is_for_sale: boolean; // 판매/구매 아이템 구분 (true: 판매 아이템, false: 구매 아이템)
  item_source: ItemSource; // 뽑기/상점/복권/기타 아이템
  nickname: string; // 판매자 닉네임 (디스코드 닉네임)
  discord_id: string; // 판매자 아이디 (디스코드 아이디)
  is_sold: boolean; // 판매중/판매완료
  item_gender: ItemGender; // 아이템 성별
  user_id: string; // 아이템 등록 유저 uuid (디스코드 uuid)
  category: ItemCategory; // 아이템 카테고리
  created_at: string; // 아이템 등록일
}

export interface SearchItemInfo {
  id: string;
  name: string;
  item_gender: string;
  image: string;
  category: string;
}

export interface RankItem {
  id: string;
  item_name: string;
  rank: number;
  price: number;
  image: string;
  item_gender: ItemGender;
  is_sold: boolean; // 판매 완료 여부 (true만 받음)
  updated_at: string; // 판매 완료일
}
