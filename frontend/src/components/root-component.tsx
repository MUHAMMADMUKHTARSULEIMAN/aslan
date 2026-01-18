import { Outlet } from "@tanstack/react-router";
import AppSidebar from "./app-sidebar";
import { SidebarProvider } from "./ui/sidebar";
import { Toaster } from "sonner";
import { TanstackDevtools } from "@tanstack/react-devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

const RootComponent = () => {
  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <Outlet />
        <Toaster richColors />
        <TanstackDevtools
          config={{
            position: "bottom-left",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </SidebarProvider>
    </>
  );
};

export default RootComponent;
