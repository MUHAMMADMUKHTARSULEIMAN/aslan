import * as React from "react";
import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { fetchHomeFeed } from "../routes/_header-layout/index";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  pathname: string;
}

const Header = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ pathname }, ref) => {
    const { data, isPending } = useQuery({
      queryKey: ["home-feed"],
      queryFn: fetchHomeFeed,
      select: (result) => result.data.user,
			staleTime: Infinity,
    });

    const { toggleSidebar } = useSidebar();
    return (
      <div
        ref={ref}
        className="sticky w-full min-w-screen bg-background top-0 left-0 right-0 z-50"
      >
        <div className="pl-4 pr-2 py-2">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/">
                <img src="/images/logo.svg" alt="" className="h-6 w-6" />
              </Link>
            </div>
            <div className="flex gap-1 items-center">
              {data !== null || isPending ? (
                ""
              ) : (
                <Button variant="secondary" className="px-3">
                  <Link to="/sign-in" search={{ returnTo: pathname }}>
                    Sign in
                  </Link>
                </Button>
              )}
              <Button onClick={toggleSidebar} variant="first-icon" size="icon" className="">
                <Menu onClick={toggleSidebar} className="w-6! h-6! hover:text-emerald-600 dark:hover:text-emerald-200" />
              </Button>
            </div>
          </div>
        </div>
        <hr className="border border-border" />
      </div>
    );
  }
);

export default Header;
