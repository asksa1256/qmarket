export interface FetchError {
  message: string;
  status?: number; // HTTP 에러일 때만 존재
}
