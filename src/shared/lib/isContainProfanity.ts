import { PROFANITY_LIST } from "../config/constants";

export const isContainProfanity = (text: string): boolean => {
  const normalizedText = text.toLowerCase().replace(/\s/g, "");
  return PROFANITY_LIST.some((word) => normalizedText.includes(word));
};
