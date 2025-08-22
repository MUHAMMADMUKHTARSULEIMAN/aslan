import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export const ArticleCard = () => {
  return (
    <Card className="p-0 pb-4 border-5 border-border/10 dark:border-input/10">
      <img
        src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
        alt=""
        className="rounded-lg rounded-bl-none rounded-br-none w-full aspect-3/2 object-cover"
      />
      <div className="mx-4">
        <h3 className="font-semibold mb-2">
          Do Scientists Pray? Einstein Answers a Little Girl’s Question about
          Science vs. Religion
        </h3>
        <p className="mb-2">
          However, we must concede that our actual knowledge of these forces is
          imperfect, so that in the end the belief in the existence of a final,
          ultimate spirit rests on a kind of faith.
        </p>
        <span className="text-muted-foreground">The Marginalian</span>
      </div>
			<div className="flex items-center justify-between mx-4">
				<div className="flex gap-4">
					<ThumbsUp className="hover:text-accent"/>
					<ThumbsDown className="hover:text-accent"/>
				</div>
				<Button className="font-medium text-base" variant="card-save-ghost">
					Save
				</Button>
			</div>
    </Card>
  );
};
