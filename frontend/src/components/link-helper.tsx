import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link, RegisteredRouter } from "@tanstack/react-router";
import React from "react";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  label: string;
  to: keyof RegisteredRouter["routesByPath"];
  icon?: React.ReactNode;
	textSize: string;
}

const LinkHelper = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className, icon: Icon, label, to, textSize }, ref) => {
    return (
      <div className={cn("group p-0 m-0 flex gap-0 items-baseline", className)} ref={ref}>
        <Link
          to={to}
          className={cn(
            buttonVariants({ variant: "link" }),
            `relative p-0 m-0 ${textSize}`
          )}
        >
          {label}
          {Icon ? (
						<span
						className={`absolute bottom-2.5 left-0 w-full h-[0.5px] bg-primary scale-x-0 transition-transform group-hover:scale-x-100`}
						></span>
          ) : (
            ""
          )}
        </Link>
            <span className="text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto">
              {Icon}
            </span>
      </div>
    );
  }
);

export default LinkHelper;
