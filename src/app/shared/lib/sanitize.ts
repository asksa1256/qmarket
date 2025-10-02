import DOMPurify from "isomorphic-dompurify";

export const sanitize = (value: string) => DOMPurify.sanitize(value.trim());
