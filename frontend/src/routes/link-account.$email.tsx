import FloatingLabelPassword from "@/components/floating-label-password";
import ToastError from "@/components/toast-error";
import ToastSuccess from "@/components/toast-success";
import { Button, buttonVariants } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFileRoute,
  Link,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import z from "zod/v4";

const redirectSearchSchema = z.object({
  returnTo: z.string().optional(),
});

export const Route = createFileRoute("/link-account/$email")({
  component: RouteComponent,
  validateSearch: (search) => redirectSearchSchema.parse(search),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { email } = Route.useParams();
  const search = useSearch({
    from: "/link-account/$email",
  });

  const returnTo = search.returnTo || "/";

  const formSchema = z.object({
    password: z.string().min(1, "Field is required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `https://localhost:2020/api/link-account/${email}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: values.password,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        if (data?.message) ToastSuccess(data?.message);
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
      <Link className="mb-6" to="/">
        <img src="/images/logo.svg" alt="" className="h-12 w-12" />
      </Link>
      <h3 className="font-medium text-xl mb-6 text-center">Verify password</h3>
      <p className="mb-6 text-sm text-balance text-center wrap-anywhere">
        Enter password to continue.
      </p>
      <div className="w-full mb-6">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
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
                  Verifying
                </span>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
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
