import { createFileRoute } from "@tanstack/react-router";
import { cn, topics } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
// import { useRef } from "react";
import { indexAtom, wrappedItemsAtom } from "@/store/atoms";
import { useAtom, useAtomValue } from "jotai";
// import useFlexWrapDetector from "@/hooks/use-flex-wrap-detector";
import useTrackElement from "@/hooks/use-track-element";

export const Route = createFileRoute("/_header-layout/tags")({
  component: RouteComponent,
});

function RouteComponent() {
  // const containerRef = useRef<HTMLDivElement>(null);
	const trackRef = useTrackElement()
	const wrappedItemsArray = useAtomValue(wrappedItemsAtom)
  const [hoveredIndex, setHoveredIndex] = useAtom(indexAtom);


  // const wrappedItemsArray = useFlexWrapDetector(containerRef).sort(
  //   (a, b) => a - b
  // );

  const getCustomRule = (): string => {
    const item = wrappedItemsArray.find((i) => i >= (hoveredIndex ?? -1));
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
    else if (item === 9) previousClass = "group-hover:data-[number=10]:mr-0";
    else if (item === 10) previousClass = "group-hover:data-[number=11]:mr-0";
    else if (item === 11) previousClass = "group-hover:data-[number=12]:mr-0";
    else if (item === 12) previousClass = "group-hover:data-[number=13]:mr-0";
    else if (item === 13) previousClass = "group-hover:data-[number=14]:mr-0";
    else if (item === 14) previousClass = "group-hover:data-[number=15]:mr-0";
    console.log("previousClass", previousClass);

    return previousClass;
  };

  return (
    <div className="mx-4">
      <div ref={trackRef} className="group flex flex-wrap gap-4">
        {topics.map((topic: string, index) => {
          return (
            <div
              key={topic}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "data-[edge=true]:mr-[12.33px] hover:data-[edge=true]:mr-0 group flex items-center border-b border-foreground/60 hover:text-primary cursor-pointer",
                getCustomRule()
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
