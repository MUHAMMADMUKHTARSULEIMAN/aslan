import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  const logged = false;
  return (
    <div className="sticky w-full min-w-screen bg-background top-0 left-0 right-0 z-50">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="images/logo.svg"
                alt=""
                className="h-[1.5rem] w-[1.5rem]"
              />
            </Link>
          </div>
          <div className="flex gap-2 items-center">
						{
							logged ? 
							"" :
            <Button variant="secondary" className="shadow-none">
              <Link to="/register-email">Sign up</Link>
            </Button>
						}
            <Button onClick={toggleSidebar} variant="first-icon" size="icon">
              <Menu
                className="!w-[1.5rem] !h-[1.5rem] hover:text-emerald-600 dark:hover:text-emerald-200"
              />
            </Button>
          </div>
        </div>
      </div>
      <hr className="border-2 border-input/30 dark:border-input/10" />
    </div>
  );
};
