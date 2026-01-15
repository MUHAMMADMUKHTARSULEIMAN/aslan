import { wrappedItemsAtom } from "@/store/atoms";
import { useSetAtom } from "jotai";
import { useCallback, useRef } from "react";


const useTrackElement = () => {
	const observerRef = useRef<ResizeObserver | null>(null);
	const setWrappedItemsArray = useSetAtom(wrappedItemsAtom);
	const wrappedItemsRef = useRef<Array<number>>([]);
	
  const refCallback = useCallback((node: HTMLDivElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    if (node) {
<<<<<<< HEAD
=======
			console.log("div found; start tracking")
>>>>>>> 26225c1d8a278c8f85ff4e38bb6b8e9d95d237b2
      const updateEdges = () => {
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
<<<<<<< HEAD
=======
        console.log("items:", items.length);
>>>>>>> 26225c1d8a278c8f85ff4e38bb6b8e9d95d237b2
        setWrappedItemsArray(() => {
          return wrappedItemsRef.current;
        });
      };

      observerRef.current = new ResizeObserver(() => {
        requestAnimationFrame(updateEdges);
      });

      observerRef.current.observe(node);
    }
  }, []);

  return refCallback;
};

export default useTrackElement;
