import { textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/feeds")({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/feeds" || location.pathname === "/feeds/") {
      throw redirect({
        to: "/feeds/$category",
        params: { category: textLowerCasifierAndHyphenator(topics[0]) },
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  return (
	<div className="absolute top-[117.333px]">
		<Outlet />
	</div>
	)
}
