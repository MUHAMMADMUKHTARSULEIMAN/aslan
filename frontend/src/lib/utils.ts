import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const textTrimmer = (text: string, isTitle: boolean = true, limit: number = 50) => {
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

	export const topics = ["Business", "Career", "Education", "Entertainment", "Food", "Gaming", "Health", "Life Hacks", "Parenting", "Personal Finance", "Politics", "Science", "Sports", "Technology", "Travel"]