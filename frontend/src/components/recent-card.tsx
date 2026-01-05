import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {}

const RecentCard = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className }, ref) => {
    return (
      <div className={className} ref={ref}>
        <Card className="p-0 border-5 border-border/10 dark:border-input/10">
          <div className="grid grid-cols-[4fr_5fr] gap-2">
            <img
              className="rounded-l-lg w-full aspect-square object-cover"
              src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
              alt=""
            />
            <div className="flex flex-col gap-2 justify-between aspect-5/4">
              <h3 className="font-medium text-[13px]">
                Do Scientists Pray? Einstein Answers a Little Girl’s Question
                about Science.
              </h3>
              <h3 className="font-medium text-muted-foreground text-[13px]">
                The Marginalian
              </h3>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

export default RecentCard;
