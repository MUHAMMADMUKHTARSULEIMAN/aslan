import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem, FormLabel, } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/register-email")({
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

	const {handleSubmit, control, formState} = form

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("http://127.0.0.1:2020/register-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });

      const data = await response.json();
    } catch (error) {}
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
            className={cn(buttonVariants({ variant: "link" }), "text-base p-0")}
          >
            <Link to="/sign-in">Sign in</Link>
          </span>
        </p>
      </div>
      <div className="mt-4 w-full">
        <div className="w-full bg-card/50 hover:bg-card/90 dark:hover:bg-card/20 text-inherit border-2 border-input/50 dark:border-input/20 flex items-center justify-center gap-2 py-2 rounded-xl shadow-xs cursor-pointer text-sm">
          <FcGoogle size={20} />
          Continue with Google
        </div>
      </div>
      <div className="my-2 flex items-center w-full">
        <hr className="border border-input grow" />
        <span className="px-2">OR</span>
        <hr className="border border-input grow" />
      </div>
			<div className="w-full">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)}></form>
					<FormField
						control={control}
						name="email"
						render={({field}) => {
							return(
								<FormItem>
									<FormControl>
										<div className="">
											<Input placeholder="Enter your email" className="bg-card/50 hover:bg-card/90 dark:hover:bg-card/20 text-inherit border-2 border-input/50 dark:border-input/20 flex items-center justify-center gap-2 py-2 rounded-xl shadow-xs" {...field}/>
										</div>
									</FormControl>
								</FormItem>
							)
						}}
						/>
				</Form>
			</div>
      {/* <div>
				<p>By continuing, you agree to our Terms of Service and Privacy Policy. Need help? </p>
			</div> */}
    </div>
  );
}
