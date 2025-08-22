import { Card } from "./ui/card";

export const ArticleCard = () => {
  return (
    <Card className="p-0 border-5 border-border/10 dark:border-input/10">
      <img
        src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
        alt=""
        className="rounded-xl rounded-bl-none rounded-br-none w-full aspect-3/2 object-cover"
      />
      <div className="pb-6">
        <h3 className="font-semibold pb-2 px-4">
          Do Scientists Pray? Einstein Answers a Little Girl’s Question about
          Science vs. Religion
        </h3>
        <p className="pb-2 px-4">
          Whether in their inadvertently brilliant reflections on gender
          politics or in their seemingly simple but profound questions about how
          the world works, kids have a singular way of stripping the most
          complex of cultural phenomena down to their bare essence, forcing us
          to reexamine our layers of assumptions.
        </p>
        <span className="text-muted-foreground px-4">The Marginalian</span>
      </div>
    </Card>
  );
};
