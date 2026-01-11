import { Button, buttonVariants } from "@/components/ui/button";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v4";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import FloatingLabelInput from "@/components/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import ToastSuccess from "@/components/toast-success";
import ToastError from "@/components/toast-error";
import FloatingLabelPassword from "@/components/floating-label-password";
import { FcGoogle } from "react-icons/fc";
import { cn } from "@/lib/utils";

const redirectSearchSchema = z.object({
  returnTo: z.string().optional(),
});

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
  validateSearch: (search) => redirectSearchSchema.parse(search),
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = useSearch({
    from: "/sign-in",
  });

  const returnTo = search.returnTo || "/";

  const passwordConstraints = z.string().min(1, "Field is required.");

  const formSchema = z.object({
    email: z.email("Enter a valid email address.").trim(),
    password: passwordConstraints,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `https://localhost:2020/api/sign-in`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        await navigate({ to: returnTo, replace: true });
      } else {
        if (data?.message) ToastError(data?.message);
      }
    } catch (error) {
      ToastError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="w-full mx-8 my-16 flex flex-col items-center">
      <div className="mb-6">
        <Link to="/">
          <img src="images/logo.svg" alt="" className="h-12 w-12" />
        </Link>
      </div>
      <div className="mb-6 text-center">
        <h1 className="font-medium text-xl">Sign in to Sanctum</h1>
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
      <div className="w-full mb-4">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
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

              <FormField
                control={control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FloatingLabelPassword
                            label="Password"
                            isDisabled={formState.isSubmitting}
                            {...field}
                            disabled={formState.isSubmitting}
                          />
                          <p className="text-[13px] text-center text-destructive">
                            {formState.errors.password?.message}
                          </p>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
            <Button
              variant="secondary-full"
              disabled={formState.isSubmitting}
              className="mt-4 py-5"
            >
              {formState.isSubmitting ? (
                <span className="flex justify-center items-center gap-1">
                  <Spinner />
                  Signing in
                </span>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <div className="">
        <p className="text-sm">
          Don't have an account?{" "}
          <span
            className={cn(
              buttonVariants({ variant: "link" }),
              "text-sm font-normal p-0"
            )}
          >
            <Link to="/register-email" search={{ returnTo }}>
              Sign up
            </Link>
          </span>
        </p>
      </div>
    </div>
  );
}
