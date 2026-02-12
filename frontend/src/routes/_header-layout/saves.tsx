import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useScrollTracking from "@/hooks/use-scroll-tracking";
import { savesDropdownAtom, savesPathAtom } from "@/store/atoms";
import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { useAtom } from "jotai";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/_header-layout/saves")({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();
  const [currentRoute, setCurrentRoute] = useAtom(savesPathAtom);
  const [open, setOpen] = useAtom(savesDropdownAtom);
  const trackingRef = useScrollTracking();

  useEffect(() => {
    if (pathname.includes("favourites")) setCurrentRoute("Favourites");
    else if (pathname.includes("archives")) setCurrentRoute("Archives");
    else setCurrentRoute("Saves");
  }, [pathname]);

  return (
    <div className="mb-12">
      <div ref={trackingRef} className="w-full bg-background fixed top-0 translate-y-[57.53px] left-0 z-40 transition-transform duration-350 ease-in-out data-[visible=true]:translate-y-[57.53px] data-[visible=false]:translate-y-0">
        <div className="flex items-center gap-1 my-2 mx-4">
          <h2 className="font-medium text-xl">{currentRoute}</h2>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <ChevronDown
                data-open={open}
                className="cursor-pointer data-[open=true]:rotate-180 rounded-sm hover:bg-foreground/10 transition-transform duration-100 ease-linear"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-[7.5px] rounded-t-none border-[1.5px] border-t-0">
              <Link to="/saves">
                <DropdownMenuItem className="focus:bg-primary cursor-pointer">
                  Saves
                </DropdownMenuItem>
              </Link>
              <Link to="/saves/favourites">
                <DropdownMenuItem className="focus:bg-primary cursor-pointer">
                  Favourites
                </DropdownMenuItem>
              </Link>
              <Link to="/saves/archives">
                <DropdownMenuItem className="focus:bg-primary cursor-pointer">
                  Archives
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <hr className="border" />
      </div>
      <div className="mt-16 mx-4">
        <Outlet />
      </div>
    </div>
  );
}
