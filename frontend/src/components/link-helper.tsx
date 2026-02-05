import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link, RegisteredRouter } from "@tanstack/react-router";
import React from "react";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  label: string;
  to: keyof RegisteredRouter["routesByPath"];
  icon?: React.ReactNode;
  bottom: string;
  search?: {};
}

const LinkHelper = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className, icon: Icon, label, to, search, bottom }, ref) => {
    return (
      <div
        className={cn("group p-0 m-0 flex gap-0 items-baseline")}
        ref={ref}
      >
        <Link
				// @ts-expect-error
          to={to}
          search={search}
          className={cn(
            buttonVariants({ variant: "link" }),
            `relative p-0 m-0 ${className}`
          )}
        >
          {label}
          <span
            className={`absolute ${bottom} left-0 w-full h-[0.5px] bg-primary scale-x-0 transition-transform group-hover:scale-x-100`}
          ></span>
        </Link>
        <span>{Icon}</span>
      </div>
    );
  }
);

export default LinkHelper;
