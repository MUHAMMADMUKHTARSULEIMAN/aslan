import { ModeToggle } from "./mode-toggle";
import { Menu } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { Link } from "@tanstack/react-router";

export const Header = () => {
  const { toggleSidebar } = useSidebar();
  // const logged = true;
  return (
    <div className="sticky w-full min-w-screen bg-background top-0 left-0 right-0 z-50">
      <div className="py-2 px-3">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/">
              <img src="images/logo.svg" alt="" className="h-6 w-6" />
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <ModeToggle />
            <Menu onClick={toggleSidebar} className="hover:text-accent" />
          </div>
        </div>
      </div>
      <hr className="border-1 border-input" />
    </div>
  );
};
