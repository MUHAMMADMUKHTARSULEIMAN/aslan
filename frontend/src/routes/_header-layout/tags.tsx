import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/tags")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-4 mt-6">
      <h1>Welcome to tags</h1>
    </div>
  );
}
