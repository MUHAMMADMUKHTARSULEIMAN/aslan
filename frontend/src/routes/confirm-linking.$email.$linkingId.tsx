
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/confirm-linking/$email/$linkingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { linkingId, email } = Route.useParams();
	
  return (
    <div className="w-full mx-8 my-16 flex flex-col items-center">
      <Link className="mb-6" to="/">
        <img src="/images/logo.svg" alt="" className="h-12 w-12" />
      </Link>
      <h1 className="font-medium text-xl mb-6 text-center">
        Add new sign-in method
      </h1>
      <p className="mb-6 text-sm text-center wrap-anywhere">
        <span className="font-semibold">{email}</span> already uses email
        sign-in. Do you want to enable Google sign-in for{" "}
        <span className="font-semibold">{email}</span>?
      </p>
      <Button variant="secondary-full" className=" mb-6">
        <Link to="/link-account/$linkingId" params={{ linkingId }}>
          Link account
        </Link>
      </Button>
      <Link
        className={cn(buttonVariants({ variant: "first-link" }))}
        to="/sign-in"
      >
        Return to sign in
      </Link>
    </div>
  );
}
