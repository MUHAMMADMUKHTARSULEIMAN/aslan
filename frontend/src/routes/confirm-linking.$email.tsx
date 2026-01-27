import LinkHelper from "@/components/link-helper";
import { Button } from "@/components/ui/button";
import { createFileRoute, Link, redirect, useSearch } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { redirectSearchSchema } from "./sign-in";

export const Route = createFileRoute("/confirm-linking/$email")({
  component: RouteComponent,
  validateSearch: (search) => redirectSearchSchema.parse(search),
		beforeLoad: ({context: {user}, search}) => {
			if(user?.email) throw redirect({to: search.returnTo || "/",})
		},
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
      <LinkHelper
        label="Return to sign in"
        to="/sign-in"
        search={{ returnTo }}
        bottom="bottom-2.5"
        icon={
          <ChevronRight className="h-4.5! max-w-0 group-hover:max-w-4.5 -mb-[3.5px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto" />
        }
      />
    </div>
  );
}
