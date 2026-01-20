import { useEffect, useRef } from "react";

export const useScrollDirectionDetector = (): "up" | "down" => {
  const direction = useRef<"up" | "down">("down");

  useEffect(() => {
    let lastScrollY: number = window.scrollY;

    const updateDirection = () => {
      const currentScrollY = window.scrollY;

      const newDirection = lastScrollY < currentScrollY ? "down" : "up";

      if (
        newDirection !== direction.current &&
        Math.abs(currentScrollY - lastScrollY) > 5
      ) {
        direction.current = newDirection;
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    };

    window.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateDirection);
    });
    return () => window.removeEventListener("scroll", updateDirection);
  }, [direction]);

  return direction.current;
};
