import { wrappedItemsAtom } from "@/store/atoms";
import { useAtom } from "jotai";
import { useRef, useEffect } from "react";

const useFlexWrapDetector = (
  containerRef: React.RefObject<HTMLDivElement | null>
): Array<number> => {
  const observerRef = useRef<ResizeObserver | null>(null);
  const wrappedItemsRef = useRef<Array<number>>([]);
  const [wrappedItemsArray, setWrappedItemsArray] = useAtom(wrappedItemsAtom);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
			return
		}

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
  }, [containerRef.current]);

  return wrappedItemsArray;
};

export default useFlexWrapDetector;