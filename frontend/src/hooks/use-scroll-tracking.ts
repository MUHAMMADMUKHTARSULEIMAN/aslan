import { directionAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { useCallback, useRef } from "react";

const useScrollTracking = () => {
  const directionRef = useRef<"up" | "down" | null>(null);
  const [direction, setDirection] = useAtom(directionAtom);

  const refCallback = useCallback(
    (node: HTMLDivElement | null) => {
      let lastScrollY: number = window.scrollY;

      if (node) {
        const updateDirection = () => {
          const currentScrollY = window.scrollY;

          directionRef.current = lastScrollY < currentScrollY ? "down" : "up";

          if (
            direction !== directionRef.current &&
            Math.abs(currentScrollY - lastScrollY) >= 2
          ) {
            if (directionRef.current !== "down") {
              node.dataset.visible = "true";
            } else {
              node.dataset.visible = "false";
            }
            setDirection(directionRef.current);
          }

          lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        };

        window.addEventListener("scroll", updateDirection);
        return () => window.removeEventListener("scroll", updateDirection);
      }
    },
    [directionRef.current]
  );

  return refCallback;
};

export default useScrollTracking;
