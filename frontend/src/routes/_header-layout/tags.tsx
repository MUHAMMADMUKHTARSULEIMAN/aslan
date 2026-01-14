import { checkFlexWrap, cn, topics } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_header-layout/tags")({
  component: RouteComponent,
});

function RouteComponent() {
  const  [classString, setClassString] = useState<Array<number>>([])

  const initObserver = (): () => void => {
    const flexContainer =
      document.querySelector<HTMLDivElement>("#flex-container");

    if (!flexContainer) {
      requestAnimationFrame(initObserver);
      return () => {};
    }

			const observer = new ResizeObserver(() => {
				setClassString(checkFlexWrap(flexContainer));
			})
		observer.observe(flexContainer);

		return () => {
				observer.disconnect()
			}
  };

  useEffect(() => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initObserver);
    } else {
      initObserver();
    }
  }, [classString]);

	console.log(classString)
  return (
    <div className="mx-4">
      <div id="flex-container" className="w-full flex flex-wrap gap-4">
        {topics.map((topic: string) => {
          return (
            <div
              key={topic}
              className={cn("data-[edge=true]:mr-[12.33px] hover:data-[edge=true]:mr-0 last:mr-[12.33px] hover:last:mr-0 group py-2 flex items-center border-b border-foreground/60 hover:text-primary cursor-pointer")}
            >
              <span>{topic}</span>
              <ChevronRight className="group-hover:-mr-[5.67px] h-4.5! w-0 max-w-0 group-hover:w-4.5 group-hover:max-w-4.5 -mb-px text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
