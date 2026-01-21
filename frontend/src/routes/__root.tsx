import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import ErrorComponent from "@/components/error-component";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { TanstackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Interface } from "node:readline";

export interface User {
	name: string | null;
	email: string | null;
}

interface RouterContext {
  queryClient: QueryClient;
	CSRFToken: string | null
	user: User | null
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
	errorComponent: ErrorComponent
});

function RootComponent() {
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
	)
}