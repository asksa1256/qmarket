import DOMPurify from "dompurify";

// 브라우저 전용 sanitize
export function sanitize(html: string): string {
  if (typeof window === "undefined") return html; // SSR 방어
  return DOMPurify.sanitize(html);
}
