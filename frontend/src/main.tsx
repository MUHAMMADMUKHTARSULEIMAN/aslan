import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { ThemeProvider } from "@/components/theme-provider.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "jotai";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";
// Create a new router instance

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

	return response.json()
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

	return response.json()
};

const CSRFData = await fetchCSRFToken()
const userData = await fetchUser()

const CSRFToken = CSRFData?.data?.token
const user = userData?.data?.user

const queryClient = new QueryClient();

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
		CSRFToken: CSRFToken || null,
		user: user || null
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider>
          <ReactQueryDevtools initialIsOpen={false} />
          <ThemeProvider>
            <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
              <RouterProvider router={router} />
            </TanStackQueryProvider.Provider>
          </ThemeProvider>
        </Provider>
      </QueryClientProvider>
    </StrictMode>
  );
}
