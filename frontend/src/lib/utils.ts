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

export const checkFlexWrap = (container: HTMLDivElement): Array<number> => {
  const items = Array.from(container.children) as HTMLDivElement[];
	let wrappedItemsArray: number[] = [];
	
  for (let i = 0; i < items.length; i++) {
    if (i === 0 || i === items.length - 1) continue;
    const currentItem = items[i];
    const nextItem = items[i + 1];

    const hasWrapped = nextItem.offsetTop > currentItem.offsetTop;

    if (hasWrapped) {
      wrappedItemsArray.push(i);
			currentItem.dataset.edge = "true"
		}else {
				wrappedItemsArray = wrappedItemsArray.filter((item) => item !== i);
				currentItem.dataset.edge = "false"

			}
		}
		return wrappedItemsArray
	};
  // const classArray: string[] = [];
  // wrappedItemsArray.forEach((item: number) => {
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
