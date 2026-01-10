import { Card } from "./ui/card";
import { Button } from "./ui/button";
import React from "react";
import { cn, textTrimmer } from "@/lib/utils";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  _id: string;
  excerpt?: string;
  image: string;
  siteName: string;
  title: string;
  url: string;
}

const ArticleCard = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className, _id, excerpt, image, siteName, title, url }, ref) => {
    title = textTrimmer(title);
    excerpt = textTrimmer(excerpt || "", false, 120);
    return (
      <div ref={ref}>
        <Card
          className={cn(
            "p-0 gap-4 border-5 border-input/25 dark:border-input/20",
            className
          )}
        >
          <img
            src={image}
            alt=""
            className="rounded-t-lg w-full aspect-3/2 object-cover"
          />
          <div className="h-52 max-h-52 mx-4 flex flex-col justify-between">
            <div className="h-35 max-h-35">
              <h3 className="font-medium mb-2">{title}</h3>
              <p className="mb-4 text-sm">{excerpt}</p>
            </div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                {siteName}
              </span>
              <Button variant="card-save" className="font-medium text-base">
                Save
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

export default ArticleCard;
