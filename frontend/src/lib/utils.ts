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
    textArray[i] = textArray[i].toLowerCase();
  }
  text = textArray.join("-");
  return text;
};

export const textCapitalizerAndSpacifier = (text: string): string => {
  const textArray = text.split("-");
  const capitalizedTextArray = [];
  for (let i = 0; i < textArray.length; i++) {
    const capitalizedText = `${textArray[i].charAt(0).toUpperCase()}${textArray[i].substring(1)}`;
    capitalizedTextArray.push(capitalizedText);
  }
  text = capitalizedTextArray.join(" ");
  return text;
};

export const ampersandToAnd = (text: string) => {
  const textArray = text.split("-");
  for (let i = 0; i < textArray.length; i++) {
    if (textArray[i] === "&") textArray[i] = "and";
  }
  text = textArray.join("-");
  return text;
};

export const andToAmpersand = (text: string) => {
  const textArray = text.split("-");
  for (let i = 0; i < textArray.length; i++) {
    if (textArray[i] === "and") textArray[i] = "&";
  }
  text = textArray.join("-");
  return text;
};

export const dummiesCreator = (amount: number): number[] => {
  const dummies: number[] = [];

  for (let i = 0; i < amount; i++) {
    dummies.push(i + 1);
  }

  return dummies;
};

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
