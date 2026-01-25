import { directionAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";

export const useScrollDirectionDetector = (): "up" | "down" | null => {
  const directionRef = useRef<"up" | "down" | null>(null);
  const [direction, setDirection] = useAtom(directionAtom);

  useEffect(() => {
    let lastScrollY: number = window.scrollY;

    const updateDirection = () => {
      const currentScrollY = window.scrollY;

      directionRef.current = lastScrollY < currentScrollY ? "down" : "up";

      if (
        direction !== directionRef.current &&
        Math.abs(currentScrollY - lastScrollY) >= 5
      ) {
        setDirection(directionRef.current);
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener("scroll", updateDirection);
    return () => window.removeEventListener("scroll", updateDirection);
  }, [directionRef.current]);
  return direction;
};
