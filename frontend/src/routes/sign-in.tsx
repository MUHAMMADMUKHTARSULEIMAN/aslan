import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <Link to="/">
        <img src="images/logo.svg" alt="" className="h-12 w-12" />
      </Link>
    </div>
  );
}
