import { clsx, type ClassValue } from "clsx";
import { useEffect, useRef } from "react";
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

export const useFlexWrapDetector = (
  containerRef: React.RefObject<HTMLDivElement | null>
): Array<number> => {
  const observerRef = useRef<ResizeObserver | null>(null);
  let wrappedItemsRef = useRef<Array<number>>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateEdges = () => {
      const items = Array.from(container.children) as HTMLDivElement[];

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

          // for (let j = i - 1; j >= 0; j--) {
          //   const previous = items[j];

          //   const isBehind = previous
          //     ? previous.offsetTop === item.offsetTop
          //     : false;
          //   if (isBehind) {

          //   }
          // }
        } else {
          item.dataset.edge = "false";
          wrappedItemsRef.current = wrappedItemsRef.current.filter(
            (item) => item !== i
          );
        }
      });

      console.log(wrappedItemsRef);
    };

    observerRef.current = new ResizeObserver(() => {
      requestAnimationFrame(updateEdges);
    });

    observerRef.current.observe(container);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      const items = Array.from(container.children) as HTMLDivElement[];
      items.forEach((item) => delete item.dataset.edge);
    };
  }, [containerRef, wrappedItemsRef]);

  return wrappedItemsRef.current;
};

// const classArray: string[] = [];
// wrappedItemsRef.forEach((item: number) => {
//   const nonHoverClassString = `nth-${item + 1 }:pr-9`;
//   const paddingClassString = `nth-${item + 1}:bg-fuchsia-600!`;
//   const hoverClassString = `hover:nth-${item + 1}:pr-0`;
//   classArray.push(nonHoverClassString, hoverClassString, paddingClassString);
// });
// const lastClassString = `last:pr-9`;
// const paddingClassString = `last:bg-fuchsia-600!`;
// const lastHoverClassString = `hover:last:pr-0`;
// classArray.push(lastClassString, lastHoverClassString, paddingClassString);
// // const classString = classArray.join(" ");

// for(let i = 0; i < items.length; i++) {
// 	classArray.forEach((item) => {
// 		items[i].classList.add(item)
// 	})
// }

// return classArray
