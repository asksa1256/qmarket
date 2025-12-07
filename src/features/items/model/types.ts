export interface FilterParams {
  minPrice?: number;
  maxPrice?: number;
  sortBy: "created_at" | "price";
  sortOrder: "asc" | "desc";
}
