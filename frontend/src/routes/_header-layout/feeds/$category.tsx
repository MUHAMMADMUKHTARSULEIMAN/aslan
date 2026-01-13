import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/feeds/$category")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
