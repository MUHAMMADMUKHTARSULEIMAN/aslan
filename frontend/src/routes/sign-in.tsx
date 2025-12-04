import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import FloatingLabelInput from "@/components/floating-label-input";
import { Spinner } from "@/components/ui/spinner";
import ToastSuccess from "@/components/toast-success";
import ToastError from "@/components/toast-error";
import FloatingLabelPassword from "@/components/floating-label-password";

export const Route = createFileRoute("/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();

	const passwordConstraints = z
		.string()
		.min(8, "Field is required.")

	const formSchema = z
		.object({
			email: z.email("Enter a valid email address.").trim(),
			password: passwordConstraints
		})

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
				"http://127.0.0.1:2020/api/sign-in",
				{
					method: "POST",
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
				ToastSuccess(data?.message);
			} else {
				ToastError(data?.message);
			}
			await navigate({ to: "/", replace: true });
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
			<div className="mb-8 text-center">
				<h1 className="font-bold text-4xl">Sign In</h1>
			</div>
			<div className="w-full">
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
							variant="secondary"
							disabled={formState.isSubmitting}
							className="w-full mt-4 py-5 shadow-none"
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
		</div>
	);
}
