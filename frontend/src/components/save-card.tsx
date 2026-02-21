import { Archive, Ellipsis, Folder, Star, Tag, Trash } from "lucide-react";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
} from "./ui/dropdown-menu";
import React, { useState } from "react";
import { textTrimmer } from "@/lib/utils";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  _id: string;
  image: string;
  length: number;
  siteName: string;
  title: string;
  url: string;
}

const SaveCard = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ _id, image, length, siteName, title, url }, ref) => {
		title = textTrimmer(title, true, 50)
		siteName = textTrimmer(siteName, false, 30)
    const [open, setOpen] = useState(false);
    return (
      <div ref={ref}>
        <Card className="m-0 p-3 border-none">
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-[4fr_5fr] gap-2">
              <img
                className="rounded-[9px] w-full aspect-3/2 object-cover"
                src={image}
                alt=""
              />
              <div className="aspect-15/8">
                <h3 className="font-medium text-sm">
                  {title}
                </h3>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <h3 className="font-medium text-muted-foreground text-sm">
                  {siteName}
                </h3>
                <h3 className="text-muted-foreground text-sm">{Math.round(length/(250 * 10))} min</h3>
              </div>
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Ellipsis
                    data-open={open}
                    className="hover:text-emerald-600 dark:hover:text-emerald-300 cursor-pointer"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mx-4 ">
                  <DropdownMenuItem><Archive />Archive</DropdownMenuItem>
                  <DropdownMenuItem><Star />Add to Favourites</DropdownMenuItem>
                  <DropdownMenuItem><Tag />Add tags</DropdownMenuItem>
                  <DropdownMenuItem><Folder />Add to Collection</DropdownMenuItem>
                  <DropdownMenuItem><Trash />Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>
      </div>
    );
  }
);

export default SaveCard;
