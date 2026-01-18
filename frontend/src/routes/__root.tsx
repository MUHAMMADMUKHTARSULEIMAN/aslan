import { createRootRouteWithContext } from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";
import RootComponent from "@/components/root-component";
import ErrorComponent from "@/components/error-component";

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
	errorComponent: ErrorComponent
});
