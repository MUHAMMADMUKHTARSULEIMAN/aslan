import React from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
		_id: string;
		image: string,
		siteName: string,
		title: string,
		url: string,
	}

const RecentCard = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ _id, image, siteName, title, url, className }, ref) => {
    return (
      <div className={cn(className)} ref={ref}>
        <Card className="p-0 border-5 border-input/20 dark:border-muted/10">
          <div className="grid grid-cols-[4fr_5fr] gap-2">
            <img
              className="rounded-l-lg w-full aspect-8/7 object-cover"
              src={image}
              alt=""
            />
            <div className="flex flex-col justify-between aspect-10/7">
              <h3 className="font-medium text-[13px]">
                {title}
              </h3>
              <h3 className="font-medium text-muted-foreground text-[13px]">
                {siteName}
              </h3>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

export default RecentCard;
