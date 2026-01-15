import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const textTrimmer = (
  text: string,
  isTitle: boolean = true,
  limit: number = 50
): string => {
  const textLength = text.length;

  if (isTitle) {
    const parts = text.split(" - ");
    text = parts[0];
  }

  text = text.substring(0, limit);

  if (textLength === text.length) {
    return text;
  } else {
    return text + "...";
  }
};

export const topics = [
  "Business",
  "Career",
  "Education",
  "Entertainment",
  "Food",
  "Gaming",
  "Health & Fitness",
  "Parenting",
  "Personal Finance",
  "Politics",
  "Science",
  "Self Improvement",
  "Sports",
  "Technology",
  "Travel",
];

export const textLowerCasifierAndHyphenator = (text: string): string => {
  const textArray = text.split(" ");
  for (let i = 0; i < textArray.length; i++) {
    textArray[i].toLowerCase();
  }
  text = textArray.join("-");
  return text;
};
