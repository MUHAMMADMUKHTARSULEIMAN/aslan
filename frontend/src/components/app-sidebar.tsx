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
  SaveAll,
  Radar,
  GalleryVerticalEnd,
  Archive,
  Star,
  Highlighter,
  Tags,
  ArrowDownLeftFromSquare,
  X,
} from "lucide-react";

import { Link } from "@tanstack/react-router";

export const AppSidebar = () => {
  const { toggleSidebar } = useSidebar();

  const items = [
    {
      title: "Home",
      url: "/home",
      icon: House,
    },
    {
      title: "Saves",
      url: "/saves",
      icon: SaveAll,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: Radar,
    },
    {
      title: "Collections",
      url: "/collections",
      icon: GalleryVerticalEnd,
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
    {
      title: "Tags",
      url: "/tags",
      icon: Tags,
    },
    {
      title: "Export",
      url: "/export",
      icon: ArrowDownLeftFromSquare,
    },
  ];

  return (
    <Sidebar side="right">
      <SidebarHeader className="my-3.5 p-0 mx-4">
        <div className="flex justify-end">
          <X
            className="w-6 h-6 stroke-[2.6px] hover:text-accent"
            onClick={toggleSidebar}
          />
        </div>
      </SidebarHeader>
      <SidebarSeparator className="mx-0 border-1 border-input" />
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
                        className: "bg-sidebar-primary text-sidebar-primary-foreground",
                      }}
                    >
                      <SidebarMenuButton
                        onClick={toggleSidebar}
                        className="px-3 py-2 cursor-pointer hover:bg-sidebar-primary/80 hover:text-sidebar-primary-foreground rounded-none ring-transparent"
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
