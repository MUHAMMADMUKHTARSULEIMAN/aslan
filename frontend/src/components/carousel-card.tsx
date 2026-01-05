import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowUpRightFromSquare } from "lucide-react";

const CarouselCard = () => {
  return (
    <Card className="p-0 pb-4 border-5 w-[80%] border-border/10 dark:border-input/10">
      <img
        src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
        alt=""
        className="rounded-lg rounded-bl-none rounded-br-none w-full aspect-3/2 object-cover"
      />
      <div className="flex flex-col justify-between w-full aspect-square">
        <div className="mx-4 flex flex-col gap-2">
          <h3 className="font-semibold">
            Do Scientists Pray? Einstein Answers a Little Girl’s Question about
            Science vs. Religion
            <ArrowUpRightFromSquare className="inline h-4 w-4 stroke-2" />
          </h3>
          <p className="text-sm">
            However, we must concede that our actual knowledge of these forces
            is imperfect, so that in the end the belief in the existence of a
            final, ultimate spirit rests on a kind of faith.
          </p>
        </div>
        <div className="flex items-center justify-between mx-4 gap-4">
          <span className="text-muted-foreground">The Marginalian</span>
          <Button className="font-medium text-base" variant="card-save">
            Save
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CarouselCard;
