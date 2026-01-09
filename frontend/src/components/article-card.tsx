import { Card } from "./ui/card";
import { Button } from "./ui/button";
import React from "react";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
		image?: string,
		title?: string,
		excerpt?: string,
		siteName?: string,
	}

const ArticleCard = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ className }, ref) => {
    return (
      <div className={className} ref={ref}>
        <Card className="p-0 gap-4 border-5 border-input/25 dark:border-input/20">
          <img
            src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
            alt=""
            className="rounded-t-lg w-full aspect-3/2 object-cover"
          />
          <div className="mx-4">
            <h3 className="font-medium mb-2">
              Do Scientists Pray? Einstein Answers a Little Girl’s Question
              about Science vs. Religion
            </h3>
            <p className="mb-4 text-sm">
              However, we must concede that our actual knowledge of these forces
              is imperfect, so that in the end the belief in the existence of a
              final, ultimate spirit rests on a kind of faith.
            </p>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                The Marginalian
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
