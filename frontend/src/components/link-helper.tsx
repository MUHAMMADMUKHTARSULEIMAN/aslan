import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link, RegisteredRouter } from "@tanstack/react-router";
import React from "react";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  label: string;
  to: keyof RegisteredRouter["routesByPath"];
  width: string;
  icon?: React.ReactNode;
	textSize: string;
}

const LinkHelper = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className, width, icon: Icon, label, to, textSize }, ref) => {
    return (
      <div className={cn("relative group", className)} ref={ref}>
        <Link
          to={to}
          className={cn(
            buttonVariants({ variant: "link" }),
            `p-0 m-0 flex gap-0 ${textSize}`
          )}
        >
          {label}
          {Icon ? (
            <span>
              {Icon}
            </span>
          ) : (
            ""
          )}
        </Link>
        <span
          className={`absolute bottom-2.5 left-0 ${width} h-[0.5px] bg-primary scale-x-0 transition-transform group-hover:scale-x-100`}
        ></span>
      </div>
    );
  }
);

export default LinkHelper;
