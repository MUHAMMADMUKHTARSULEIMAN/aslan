import { cn, topics } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { indexAtom, wrappedItemsAtom } from "@/store/atoms";
import { useAtom } from "jotai";

export const Route = createFileRoute("/_header-layout/tags")({
  component: RouteComponent,
});

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const wrappedItemsRef = useRef<Array<number>>([]);
  const [wrappedItemsArray, setWrappedItemsArray] = useAtom(wrappedItemsAtom);
  const [hoveredIndex, setHoveredIndex] = useAtom(indexAtom);

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
          if (wrappedItemsRef.current.length === 0) {
            wrappedItemsRef.current.push(i);
          } else if (!wrappedItemsRef.current.includes(i)) {
            wrappedItemsRef.current.push(i);
          }
          item.dataset.edge = "true";
        } else {
          wrappedItemsRef.current = wrappedItemsRef.current.filter(
            (item) => item !== i
          );
          item.dataset.edge = "false";
        }

        setWrappedItemsArray(() => {
          return wrappedItemsRef.current;
        });
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
  }, [containerRef, wrappedItemsRef]);

  console.log("wrappedItemsArray", wrappedItemsArray);

  const getCustomRule = (): string => {
		setWrappedItemsArray(prev => prev.sort((a, b) => a - b))
		const item = wrappedItemsArray.find(i => i >= (hoveredIndex ?? -1))
		// Sad that it has to be this way
		let previousClass = "";
		if (item === 0) previousClass = "group-hover:data-[number=1]:mr-0";
		else if (item === 1) previousClass = "group-hover:data-[number=2]:mr-0";
		else if (item === 2) previousClass = "group-hover:data-[number=3]:mr-0";
		else if (item === 3) previousClass = "group-hover:data-[number=4]:mr-0";
		else if (item === 4) previousClass = "group-hover:data-[number=5]:mr-0";
		else if (item === 5) previousClass = "group-hover:data-[number=6]:mr-0";
		else if (item === 6) previousClass = "group-hover:data-[number=7]:mr-0";
		else if (item === 7) previousClass = "group-hover:data-[number=8]:mr-0";
		else if (item === 8) previousClass = "group-hover:data-[number=9]:mr-0";
		else if (item === 9)
			previousClass = "group-hover:data-[number=10]:mr-0";
		else if (item === 10)
			previousClass = "group-hover:data-[number=11]:mr-0";
		else if (item === 11)
			previousClass = "group-hover:data-[number=12]:mr-0";
		else if (item === 12)
			previousClass = "group-hover:data-[number=13]:mr-0";
		else if (item === 13)
			previousClass = "group-hover:data-[number=14]:mr-0";
		else if (item === 14)
			previousClass = "group-hover:data-[number=15]:mr-0";
		console.log("previousClass", previousClass);
		// setCustomRule(previousClass)

		return previousClass
  };

  return (
    <div className="mx-4">
      <div ref={containerRef} className="group flex flex-wrap gap-4">
        {topics.map((topic: string, index) => {
          return (
            <div
              key={topic}
              onMouseEnter={() => setHoveredIndex(index)}
							onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "data-[edge=true]:mr-[12.33px] hover:data-[edge=true]:mr-0 group flex items-center border-b border-foreground/60 hover:text-primary cursor-pointer", getCustomRule()
              )}
            >
              <span className="peer py-2">{topic}</span>
              <ChevronRight className="peer-hover:-mr-[5.67px] hover:-mr-[5.67px] h-4.5! w-0 max-w-0 peer-hover:w-4.5 hover:w-4.5 peer-hover:max-w-4.5 hover:max-w-4.5 -mb-px text-primary opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-all duration-300 ease-in-out" />
            </div>
          );
        })}
      </div>
    </div>
  );
}


{/* <div id="flex-container" className="w-full flex flex-wrap gap-4">
              {topics.map((topic: string) => {
                return (
                  <div
                    key={topic}
                    className="data-[edge=true]:mr- hover:data-[edge=true]:mr-0 last:mr-5 hover:last:mr-0 group py-2 flex items-center border-b border-foreground/60 hover:text-primary cursor-pointer"
                  >
                    <span>{topic}</span>
                    <ChevronRight className="group-hover:-mr-[5.67px] h-4.5! max-w-0 group-hover:w-4.5 -mb-px text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out" />
                  </div>
                );
              })}
            </div> */}