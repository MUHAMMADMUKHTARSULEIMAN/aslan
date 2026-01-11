import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { z } from "zod/v4";

const redirectSearchSchema = z.object({
  returnTo: z.string().optional(),
});

export const Route = createFileRoute("/confirm-linking/$email")({
  component: RouteComponent,
  validateSearch: (search) => redirectSearchSchema.parse(search),
});

function RouteComponent() {
  const { email } = Route.useParams();
  const search = useSearch({
    from: "/confirm-linking/$email",
  });

  const returnTo = search.returnTo || "/";

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
        sign-on. Do you want to enable Google sign-on for{" "}
        <span className="font-semibold">{email}</span>?
      </p>
      <Button variant="secondary-full" className=" mb-6 py-5">
        <Link
          to="/link-account/$email"
          search={{ returnTo }}
          params={{ email }}
        >
          Link account
        </Link>
      </Button>
      <Link
        className={cn(buttonVariants({ variant: "link" }))}
        to="/sign-in"
        search={{ returnTo }}
      >
        Return to sign in
      </Link>
    </div>
  );
}
