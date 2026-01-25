import * as React from "react";
import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import useScrollTracking from "@/hooks/use-scroll-tracking";
import type { User } from "@/routes/__root";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  pathname: string;
	user: User | null
}

const Header = React.forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ pathname, user }, ref) => {
    ref = useScrollTracking();
    const { toggleSidebar } = useSidebar();

    return (
      <div
        ref={ref}
        className={cn(
          "sticky top-0 left-0 z-50 w-full min-w-screen bg-background transition-transform duration-300 ease-in-out data-[visible=true]:translate-y-0 data-[visible=false]:-translate-y-full"
        )}
      >
        <div className="pl-4 pr-2 py-2">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/">
                <img
                  src="/images/logo.svg"
                  alt=""
                  className={cn(
                    `h-6 w-6"}`
                  )}
                />
              </Link>
            </div>
            <div className="flex gap-1 items-center">
              {user?.email ? (
                ""
              ) : (
                <Button variant="secondary" className="px-3">
                  <Link to="/sign-in" search={{ returnTo: pathname }}>
                    Sign in
                  </Link>
                </Button>
              )}
              <Button
                onClick={toggleSidebar}
                variant="first-icon"
                size="icon"
                className=""
              >
                <Menu
                  onClick={toggleSidebar}
                  className="w-6! h-6! hover:text-emerald-600 dark:hover:text-emerald-200"
                />
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
