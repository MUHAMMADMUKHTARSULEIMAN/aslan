import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  House,
  Box,
  Compass,
  GalleryVerticalEnd,
  Archive,
  Star,
  Highlighter,
  Tags,
  ChevronLeft,
  Settings2,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";

const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: House,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: Compass,
    },
    {
      title: "Saves",
      url: "/saves",
      icon: Box,
      children: [
        {
          title: "All Saves",
          url: "/all",
          icon: "",
        },
        {
          title: "Archive",
          url: "/archive",
          icon: Archive,
        },
        {
          title: "Favourites",
          url: "/favourites",
          icon: Star,
        },
        {
          title: "Highlights",
          url: "/highlights",
          icon: Highlighter,
        },
      ],
    },
    {
      title: "Collections",
      url: "/collections",
      icon: GalleryVerticalEnd,
    },
    {
      title: "Tags",
      url: "/tags",
      icon: Tags,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ];

  return (
    <Sidebar side="right">
      <SidebarHeader className="px-2 py-2">
        <div className="flex items-center justify-between">
          <ModeToggle />
          <Button onClick={toggleSidebar} variant="first-icon" size="icon">
            <ChevronLeft className="w-6! h-6!" />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="mx-0 border-2 border-input dark:border-background" />
      <SidebarContent className="gap-0">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <Link
                    to={item.url}
                    className="flex gap-2 items-center"
                    activeProps={{
                      className:
                        "bg-emerald-200 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200",
                    }}
                  >
                    <SidebarMenuButton
                      onClick={toggleSidebar}
                      className="px-3 py-2 cursor-pointer hover:bg-emerald-600/90 dark:hover:bg-emerald-600/75 hover:text-sidebar-primary-foreground rounded-none ring-transparent"
                    >
                      <item.icon className="h-5 w-5 stroke-2.5" />
                      <span className="font-semibold text-lg">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
