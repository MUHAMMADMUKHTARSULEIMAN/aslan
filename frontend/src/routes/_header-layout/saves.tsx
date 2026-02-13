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
import { Archive, ChevronDown, Files, Star } from "lucide-react";
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
      <div ref={trackingRef} className="w-full bg-background fixed top-0 translate-y-[53.53px] left-0 z-40 transition-transform duration-250 ease-in-out data-[visible=true]:translate-y-[53.53px] data-[visible=false]:translate-y-0">
        <div className="flex items-center gap-1 my-2 mx-4">
          <h2 className="font-medium text-xl">{currentRoute}</h2>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <ChevronDown
                data-open={open}
                className="cursor-pointer data-[open=true]:rotate-180 rounded-sm hover:text-emerald-600  dark:hover:text-emerald-300 transition-transform duration-100 ease-linear"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-[7px] rounded-t-none border-t-0">
              <Link to="/saves">
                <DropdownMenuItem>
									<Files />
                  Saves
                </DropdownMenuItem>
              </Link>
              <Link to="/saves/favourites">
                <DropdownMenuItem>
									<Star />
                  Favourites
                </DropdownMenuItem>
              </Link>
              <Link to="/saves/archives">
                <DropdownMenuItem>
									<Archive />
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
