import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import FloatingLabelInput from "@/components/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import ToastSuccess from "@/components/toast-success";
import ToastError from "@/components/toast-error";

export const Route = createFileRoute("/sign-up/$email/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const { email, token } = Route.useParams();

  const hasUppercase = new RegExp(".*[A-Z].*");
  const hasLowercase = new RegExp(".*[a-z].*");
  const hasNumber = new RegExp(".*[0-9].*");
  const hasSpecialCharacter = new RegExp(".*[^A-Za-z0-9].*");

  const passwordConstraints = z
    .string()
    .min(8, "Password must be at least eight characters long.")
    .max(32, "Password must be at most 32 character long.")
    .regex(
      hasUppercase,
      "Password must include at least one upper-case letter."
    )
    .regex(
      hasLowercase,
      "Password must include at least one lower-case letter."
    )
    .regex(hasNumber, "Password must include at least one number.")
    .regex(
      hasSpecialCharacter,
      "Password must include at least one special character"
    )
    .trim();

  const formSchema = z
    .object({
      firstName: z.string().min(1, "Field is required.").trim(),
      lastName: z.string().min(1, "Field is required.").trim(),
      password: passwordConstraints,
      confirmPassword: z.string().min(1, "Confirm your password."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:2020/api/sign-up/${email}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password,
          }),
        }
      );

      const data = await response.json();
      if (data.status === "OK") {
        ToastSuccess(data?.message);
      } else {
        ToastError(data?.message);
      }
    } catch (error) {}
  };

  return (
    <div className="w-full mx-8 mt-16 flex flex-col items-center">
      {/* <div className="">
        <Link to="/">
          <img src="images/logo.svg" alt="" className="h-12 w-12" />
        </Link>
      </div> */}
      <div className="mb-8 text-center">
        <h1 className="font-bold text-4xl">Create Sanctum Account</h1>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FloatingLabelInput
                            label="First name"
                            {...field}
                            disabled={formState.isSubmitting}
                          />
                          <p className="text-[13px] text-center text-destructive">
                            {formState.errors.firstName?.message}
                          </p>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={control}
                name="lastName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FloatingLabelInput
                            label="Last name"
                            {...field}
                            disabled={formState.isSubmitting}
                          />
                          <p className="text-[13px] text-center text-destructive">
                            {formState.errors.lastName?.message}
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
                          <FloatingLabelInput
                            label="Password"
                            type="password"
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

              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FloatingLabelInput
                            label="Confirm Password"
                            type="password"
                            {...field}
                            disabled={formState.isSubmitting}
                          />
                          <p className="text-[13px] text-center text-destructive">
                            {formState.errors.confirmPassword?.message}
                          </p>
                        </div>
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
            </div>
						{/* <div>
							<p className="text-sm">Password must be at least eight characters long and contain at least an upper-case letter, a lower-case letter, a number, and a special character. Password cannot be more than 32 characters long.</p>
						</div> */}
            <Button
              variant="secondary"
              disabled={formState.isSubmitting}
              className="w-full mt-4 py-5 shadow-none"
            >
              {formState.isSubmitting ? (
                <span className="flex justify-center items-center gap-1">
                  <Spinner />
                  Submitting
                </span>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
