import { atom } from "jotai";

export const indexAtom = atom<number | null>(null)
export const wrappedItemsAtom = atom<Array<number>>([])