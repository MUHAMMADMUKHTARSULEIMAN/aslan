import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/saves")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-4 mt-8 mb-24">
      <DropdownMenu>
        <DropdownMenuTrigger asChild></DropdownMenuTrigger>
      </DropdownMenu>
			<Outlet />
    </div>
  );
}
