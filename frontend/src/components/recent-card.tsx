import React from "react";
import { Card } from "./ui/card";
import { cn, textTrimmer } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  _id: string;
  image: string;
  siteName: string;
  title: string;
  url: string;
}

const RecentCard = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ _id, image, siteName, title, url, className }, ref) => {
    const trimmedTitle = textTrimmer(title);
    return (
      <div ref={ref}>
        <Card
          className={cn(
            "p-0 border-none shadow",
            className
          )}
        >
          <div className="grid grid-cols-[4fr_5fr] gap-2">
            <img
              className="rounded-l-lg w-full aspect-8/7 object-cover"
              src={image}
              alt=""
            />
            <div className="flex flex-col justify-between aspect-10/7 mr-2">
						<Tooltip>
							<TooltipTrigger asChild>
              <h3 className="font-medium text-[13px] text-pretty wrap-anywhere">
                {trimmedTitle}
              </h3>
							</TooltipTrigger>
							<TooltipContent className="">
								{title}
							</TooltipContent>
						</Tooltip>
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
