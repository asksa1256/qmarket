export const ITEMS_TABLE_NAME = "items";
export const ITEMS_INFO_TABLE_NAME = "items_info";
export const USER_PROFILES_TABLE_NAME = "user_profiles";

export const ITEMS_PAGE_SIZE = 10;

export const ITEM_SOURCES_MAP = {
  gatcha: "뽑기",
  shop: "상점",
  lottery: "복권",
  magic: "요술상자",
};

export const ITEM_GENDER_MAP = {
  m: "남",
  w: "여",
};

export const ITEM_CATEGORY_MAP = {
  hair: "머리",
  clothes: "옷",
  eye: "눈",
  ear: "귀",
  mouth: "턱",
  bg: "배경",
  pet: "펫",
  acc: "소품",
  face: "가면",
  slime: "슬라임",
  board: "정답판",
  game: "게임아이템",
};

export const FILTER_CATEGORIES_MAP = {
  hair: "머리",
  clothes: "옷",
  eye: "눈",
  ear: "귀",
  mouth: "턱",
  bg: "배경",
  pet: "펫",
  acc: "소품",
};

export const ITEM_CATEGORY_NAV = Object.entries(ITEM_CATEGORY_MAP).map(
  ([key, value]: [string, string]) => ({
    key,
    value,
    link: `/categories/${key}`,
    image: `/images/${key}.jpg`,
  })
);

export const ITEM_IS_SOLD_MAP = {
  true: "판매완료",
  false: "판매중",
};

export const SELECT_ITEM_COLUMNS =
  "id, item_name, category, price, image, is_for_sale, item_source, nickname, is_sold, user_id, item_gender, discord_id, created_at, message, transaction_image";

export const INQUIRY_CATEGORY = ["문의", "건의", "아이템 정보 수정", "기타"];

export const REPORT_CATEGORY = ["유저 신고", "사기 거래", "시세 조작", "기타"];

export const PROFANITY_LIST = [
  "씨발",
  "개새",
  "개새끼",
  "개새꺄",
  "지랄",
  "병신",
  "좆",
  "니미",
  "시발",
  "ㅅㅂ",
  "ㄱㅅㄲ",
  "ㅂㅅ",
];
