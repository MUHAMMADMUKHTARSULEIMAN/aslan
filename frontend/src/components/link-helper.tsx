import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { Link, RegisteredRouter } from "@tanstack/react-router";
import { forwardRef } from "react";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  label: string;
  bottom: string;
  to: keyof RegisteredRouter["routesByPath"];
  params?: {};
  search?: {};
  icon?: React.ReactNode;
}

const LinkHelper = forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className, icon: Icon, label, to, params, search, bottom }, ref) => {
    return (
      <div ref={ref}>
        <Link
          // @ts-expect-error
          to={to}
					params={params}
          search={search}
          className={cn(
            buttonVariants({ variant: "link" }),
            `group relative p-0 m-0 w-full ${className}`
          )}
        >
          <div className="w-full">
            <div className="w-fit p-0 m-0 flex gap-0 items-baseline relative">
                  <span>{label}</span>
                  <span
                    className={`absolute ${bottom} left-0 w-[calc(100%-4.9px)] h-[0.5px] bg-primary scale-x-0 transition-transform group-hover:scale-x-100`}
                  ></span>
                <span>{Icon}</span>
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export default LinkHelper;
