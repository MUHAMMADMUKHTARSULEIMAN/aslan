import { atom } from "jotai";

export const indexAtom = atom<number | null>(null);
export const wrappedItemsAtom = atom<Array<number>>([]);
export const directionAtom = atom<"up" | "down" | null>(null);
export const savesPathAtom = atom<"Saves" | "Favourites" | "Archives">("Saves")
export const savesDropdownAtom = atom<boolean>(false)
export const savesCardDropdownAtom = atom<boolean>(false)
