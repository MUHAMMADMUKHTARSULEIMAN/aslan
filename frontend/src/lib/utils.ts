import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { wrappedItemsAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { useRef } from "react";

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
<<<<<<< HEAD
};
=======
};

export const updateEdges = (node: HTMLDivElement): Array<number> => {
  const wrappedItemsRef = useRef<Array<number>>([]);
  const [wrappedItemsArray, setWrappedItemsArray] = useAtom(wrappedItemsAtom);
  const items = Array.from(node.children) as HTMLDivElement[];

  items.forEach((item, i) => {
    item.dataset.number = `${i + 1}`;

    const next = items[i + 1];

    const isEdge = next ? next.offsetTop > item.offsetTop : true;

    if (isEdge) {
      item.dataset.edge = "true";

      if (wrappedItemsRef.current.length === 0) {
        wrappedItemsRef.current.push(i);
      } else if (!wrappedItemsRef.current.includes(i)) {
        wrappedItemsRef.current.push(i);
      }
    } else {
      item.dataset.edge = "false";

      wrappedItemsRef.current = wrappedItemsRef.current.filter(
        (item) => item !== i
      );
    }
  });
  setWrappedItemsArray(() => {
    return wrappedItemsRef.current;
  });

  return wrappedItemsArray;
};
>>>>>>> 26225c1d8a278c8f85ff4e38bb6b8e9d95d237b2
