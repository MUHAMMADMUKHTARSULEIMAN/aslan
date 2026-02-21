import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  createFileRoute,
  Link,
  redirect,
  useSearch,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import FloatingLabelInput from "@/components/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import ToastSuccess from "@/components/toast-success";
import ToastError from "@/components/toast-error";
import { ChevronRight } from "lucide-react";
import LinkHelper from "@/components/link-helper";
import { redirectSearchSchema } from "./sign-in";

export const Route = createFileRoute("/register-email")({
  component: RouteComponent,
		validateSearch: (search) => redirectSearchSchema.parse(search),
		beforeLoad: ({context: {user}, search}) => {
			if(user?.email) throw redirect({to: search.returnTo || "/",})
		},
});

function RouteComponent() {
  const search = useSearch({
    from: "/register-email",
  });

  const returnTo = search.returnTo || "/";

  const formSchema = z.object({
    email: z
      .email({ message: "Enter a valid email address" })
      .trim()
      .toLowerCase(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `https://localhost:2020/api/register-email?returnTo=${returnTo}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        if (data?.message) ToastSuccess(data?.message);
      } else {
        if (data.message) ToastError(data?.message);
      }
    } catch (error) {
      ToastError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="w-full mx-8 mt-16 flex flex-col items-center">
      <div className="mb-6">
        <Link to="/">
          <img src="images/logo.svg" alt="" className="h-12 w-12" />
        </Link>
      </div>
      <div className="mb-6">
        <h1 className="font-medium text-center text-xl">Register on Sanctum</h1>
      </div>
      <div className="w-full">
        <a
          href={`https://localhost:2020/api/login/federated/google?returnTo=${returnTo}`}
          className="w-full hover:bg-card/50 dark:hover:bg-card text-inherit border-2 border-border/40 dark:border-muted-foreground/30 flex items-center justify-center gap-2 py-2 rounded-lg cursor-pointer shadow-none text-sm"
        >
          <FcGoogle size={20} />
          Continue with Google
        </a>
      </div>
      <div className="my-2 flex items-center w-full">
        <hr className="border border-border/40 grow" />
        <span className="px-2">OR</span>
        <hr className="border border-border/40 grow" />
      </div>
      <div className="mb-1 w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem className="mb-4">
                    <FormControl>
                      <div>
                        <FloatingLabelInput
                          label="Email"
                          {...field}
                          disabled={formState.isSubmitting}
                        />
                        <p className="text-[13px] text-center text-destructive">
                          {formState.errors.email?.message}
                        </p>
                      </div>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
            <Button
              variant="secondary-full"
              disabled={formState.isSubmitting}
              className="py-5"
            >
              {formState.isSubmitting ? (
                <span className="flex justify-center items-center gap-1">
                  <Spinner />
                  Registering
                </span>
              ) : (
                "Register"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="mb-4">
        <p className="text-xs text-center text-muted-foreground/75">
          By continuing, you agree to our{" "}
          <Link
            to="/"
            className="text-xs text-primary hover:underline underline-offset-2 cursor-pointer"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/"
            className="text-xs text-primary hover:underline underline-offset-2 cursor-pointer"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
      <div className="">
        <p className="text-sm">
          Already have an account?{" "}
          <span
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-sm font-normal p-0"
            )}
          >
            <LinkHelper
              label="Sign in"
              to="/sign-in"
              search={{ returnTo }}
              bottom="bottom-0.5"
              icon={
                <ChevronRight className="h-4.5! max-w-0 group-hover:max-w-4.5 -mb-[3.5px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto" />
              }
            />
          </span>
        </p>
      </div>
    </div>
  );
}
