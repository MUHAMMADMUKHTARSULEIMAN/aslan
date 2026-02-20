import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { queryOptions, type QueryClient } from "@tanstack/react-query";
import ErrorComponent from "@/components/error-component";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { Toaster } from "sonner";
import { TanstackDevtools } from "@tanstack/react-devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

export interface User {
  name: string | null;
  email: string | null;
}

interface RouterContext {
  queryClient: QueryClient;
  CSRFToken?: string;
  user?: User;
}

const fetchCSRFToken = async () => {
  const response = await fetch(`https://localhost:2020/api/get-csrf-token`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Something went wrong. Try again later.");
  }

  return response.json();
};

const fetchUser = async () => {
  const response = await fetch(`https://localhost:2020/api/get-user`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Something went wrong. Try again later.");
  }

  return response.json();
};

const CSRFTokenQueryOptions = () => queryOptions({
	queryKey: ["CSRF-token"],
	queryFn: fetchCSRFToken,
	staleTime: 0
})
const userQueryOptions = () => queryOptions({
	queryKey: ["user"],
	queryFn: fetchUser,
	staleTime: 0
})

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
  errorComponent: ErrorComponent,
  beforeLoad: async ({context: {queryClient}}) => {
    try {
      const CSRFTokenData = await queryClient.fetchQuery(CSRFTokenQueryOptions());
      const userData = await queryClient.fetchQuery(userQueryOptions());

      const CSRFToken = CSRFTokenData?.data?.token
      const user = userData?.data?.user;

      return {
        CSRFToken,
        user,
      };
    } catch (error) {
      console.error("Failed to prime global context:", error);
    }
  },
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
  );
}
