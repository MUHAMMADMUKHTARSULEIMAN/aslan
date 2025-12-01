import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
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
  const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://127.0.0.1:2020/api/register-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
      if (data.status === "OK") {
        ToastSuccess(data?.message);
      } else {
        ToastError(data?.message);
      }
    } catch (error) {
      ToastError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="w-full mx-8 mt-16 flex flex-col items-center">
			<div className="">
        <Link to="/">
          <img src="images/logo.svg" alt="" className="h-12 w-12" />
        </Link>
      </div>
      <div className="mb-8 text-center">
        <h1 className="font-bold text-4xl">Create Sanctum Account</h1>
      </div>
      <div className="w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Button
              variant="secondary"
              disabled={formState.isSubmitting}
              className="w-full mt-4 py-[20px] shadow-none"
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
