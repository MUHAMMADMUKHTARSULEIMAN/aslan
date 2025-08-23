import { Ellipsis } from "lucide-react";
import { Card } from "./ui/card";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuItem,
  ContextMenuContent,
} from "./ui/context-menu";

export const SavesCard = () => {
  return (
    <Card className="p-2 border-5 border-border/10 dark:border-input/10">
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-[4fr_5fr] gap-2">
          <img
            className="rounded-sm w-full aspect-3/2 object-cover"
            src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
            alt=""
          />
          <div className="aspect-15/8">
            <h3 className="font-semibold text-sm">
              Do Scientists Pray? Einstein Answers a Little Girl’s Question
              about Science vs. Religion
            </h3>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h3 className="font-semibold text-muted-foreground text-sm">
              The Marginalian
            </h3>
            <h3 className="text-muted-foreground text-sm">4 min</h3>
          </div>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Ellipsis className="hover:text-accent active:text-secondary" />
            </ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem>Archive</ContextMenuItem>
							<ContextMenuItem>Favourite</ContextMenuItem>
							<ContextMenuItem>Add Tags</ContextMenuItem>
							<ContextMenuItem>Add to Collection</ContextMenuItem>
							<ContextMenuItem>Delete</ContextMenuItem>
						</ContextMenuContent>
          </ContextMenu>
        </div>
      </div>
    </Card>
  );
};
