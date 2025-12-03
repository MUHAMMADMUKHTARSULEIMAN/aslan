import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem, } from "@/components/ui/form";
import FloatingLabelInput from "@/components/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import ToastSuccess from "@/components/toast-success";
import ToastError from "@/components/toast-error";

export const Route = createFileRoute("/register-email")({
  component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate()
  const formSchema = z.object({
    email: z.email({ message: "Please enter a valid email address" }).trim().toLowerCase()
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

	const {handleSubmit, control, formState} = form

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
			if(data.status === "OK") {
				ToastSuccess(data?.message)
			} else {
				ToastError(data?.message)
			}
			await navigate({to: "/", replace: true})
    } catch (error) {
			ToastError("Something went wrong. Try again later.")
		}
  };

  return (
    <div className="w-full mx-8 mt-16 flex flex-col items-center">
      <div className="">
        <Link to="/">
          <img src="images/logo.svg" alt="" className="h-12 w-12" />
        </Link>
      </div>
      <div className="mt-2">
        <p>
          Already have an account?{" "}
          <span
            className={cn(buttonVariants({ variant: "link" }), "text-base font-normal p-0")}
          >
            <Link to="/sign-in">Sign in</Link>
          </span>
        </p>
      </div>
      <div className="mt-2 w-full">
        <div className="w-full hover:bg-card/50 dark:hover:bg-card text-inherit border-2 border-border/40 dark:border-muted-foreground/30 flex items-center justify-center gap-2 py-2 rounded-xl cursor-pointer shadow-none text-sm">
          <FcGoogle size={20} />
          Continue with Google
        </div>
      </div>
      <div className="my-2 flex items-center w-full">
        <hr className="border border-border/40 grow" />
        <span className="px-2">OR</span>
        <hr className="border border-border/40 grow" />
      </div>
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}>
					<FormField
						control={control}
						name="email"
						render={({field}) => {
							return(
								<FormItem>
									<FormControl>
										<div>
										<FloatingLabelInput label="Email" {...field} disabled={formState.isSubmitting} />
										<p className="text-[13px] text-center text-destructive">{formState.errors.email?.message}</p>
										</div>
									</FormControl>
								</FormItem>
							)
						}}
						/>
						<Button variant="secondary" disabled={formState.isSubmitting} className="w-full mt-4 py-5 shadow-none">
							{
								formState.isSubmitting
								? <span className="flex justify-center items-center gap-1"><Spinner />Submitting</span>
								: "Register"
							}
						</Button>
						</form>
				</Form>
						{/* <Button variant="secondary" onClick={() => {
							navigate({to: "/"})
						}} className="w-full mt-4 py-5 shadow-none">
							{
								formState.isSubmitting
								? <span className="flex justify-center items-center gap-1"><Spinner />Submitting</span>
								: "Register"
							}
						</Button> */}
			</div>
      <div className="mt-1">
				<p className="text-[13px] text-center text-muted-foreground/75">By continuing, you agree to our <Link to="/" className="text-[13px] text-primary hover:underline underline-offset-2 cursor-pointer">Terms of Service</Link> and <Link to="/" className="text-[13px] text-primary hover:underline underline-offset-2 cursor-pointer">Privacy Policy</Link>.</p>
			</div>
    </div>
  );
}
