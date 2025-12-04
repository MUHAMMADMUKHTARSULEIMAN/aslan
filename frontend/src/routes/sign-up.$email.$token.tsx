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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import FloatingLabelPassword from "@/components/floating-label-password";

export const Route = createFileRoute("/sign-up/$email/$token")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { email, token } = Route.useParams();

  const hasUppercase = new RegExp(".*[A-Z].*");
  const hasLowercase = new RegExp(".*[a-z].*");
  const hasNumber = new RegExp(".*[0-9].*");
  const hasSpecialCharacter = new RegExp(".*[^A-Za-z0-9].*");

  const passwordConstraints = z
    .string()
    .min(8, " ")
    .max(32, " ")
    .regex(hasUppercase, " ")
    .regex(hasLowercase, " ")
    .regex(hasNumber, " ")
    .regex(hasSpecialCharacter, " ")
    .trim();

  const formSchema = z
    .object({
      firstName: z.string().min(1, "Field is required.").trim(),
      lastName: z.string().min(1, "Field is required.").trim(),
      password: passwordConstraints,
      confirmPassword: z.string().min(1, "Re-enter your password."),
      isUpToEight: z.boolean(),
      isUppercase: z.boolean(),
      isLowercase: z.boolean(),
      isNumber: z.boolean(),
      isSpecialCharacter: z.boolean(),
      isNotMoreThan32: z.boolean(),
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
      isUpToEight: false,
      isUppercase: false,
      isLowercase: false,
      isNumber: false,
      isSpecialCharacter: false,
      isNotMoreThan32: true,
    },
  });

  const { handleSubmit, control, formState, watch, setValue } = form;

  const passwordValue = watch("password");
  const [disableSubmitForPassword, setDisableSubmitForPassword] =
    useState(true);

  useEffect(() => {
    const upToEightCheck = passwordValue.length >= 8;
    const uppercaseCheck = (passwordValue.match(hasUppercase)?.length || 0) > 0;
    const lowercaseCheck = (passwordValue.match(hasLowercase)?.length || 0) > 0;
    const numberCheck = (passwordValue.match(hasNumber)?.length || 0) > 0;
    const specialCharacterCheck =
      (passwordValue.match(hasSpecialCharacter)?.length || 0) > 0;
    const notMoreThan32Check = passwordValue.length <= 32;

    setDisableSubmitForPassword(() => {
      if (
        upToEightCheck &&
        uppercaseCheck &&
        lowercaseCheck &&
        numberCheck &&
        specialCharacterCheck &&
        notMoreThan32Check
      ) {
        return false;
      } else {
        return true;
      }
    });

    setValue("isUpToEight", upToEightCheck);
    setValue("isUppercase", uppercaseCheck);
    setValue("isLowercase", lowercaseCheck);
    setValue("isNumber", numberCheck);
    setValue("isSpecialCharacter", specialCharacterCheck);
    setValue("isNotMoreThan32", notMoreThan32Check);
  }, [passwordValue, setValue, disableSubmitForPassword]);

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
      await navigate({ to: "/", replace: true });
    } catch (error) {
      ToastError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="w-full mx-8 my-16 flex flex-col items-center">
      <div className="mb-6">
        <Link to="/">
          <img src="/images/logo.svg" alt="" className="h-12 w-12" />
        </Link>
      </div>
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

              {!disableSubmitForPassword ? (
                ""
              ) : (
                <div className="flex flex-col gap-1">
                  <div className="mb-1">
                    <p className="text-sm">
                      Your password must meet the following requirements:
                    </p>
                  </div>

                  <FormField
                    control={control}
                    name="isUpToEight"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="group flex gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled
                                className="bg-background hover:bg-card/50 dark:hover:bg-card border-2 border-border/40 dark:border-muted-foreground/30 data-[state=checked]:border-primary dark:data-[state=checked]:border-primary disabled:opacity-100 cursor-pointer"
                              />
                              <Label className="group-has-disabled:opacity-100!">
                                Has at least eight characters
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={control}
                    name="isUppercase"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="group flex gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={true}
                                className="bg-background hover:bg-card/50 dark:hover:bg-card border-2 border-border/40 dark:border-muted-foreground/30 data-[state=checked]:border-primary dark:data-[state=checked]:border-primary disabled:opacity-100 cursor-pointer"
                              />
                              <Label className="group-has-disabled:opacity-100!">
                                Has an upper-case letter
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={control}
                    name="isLowercase"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="group flex gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={true}
                                className="bg-background hover:bg-card/50 dark:hover:bg-card border-2 border-border/40 dark:border-muted-foreground/30 data-[state=checked]:border-primary dark:data-[state=checked]:border-primary disabled:opacity-100 cursor-pointer"
                              />
                              <Label className="group-has-disabled:opacity-100!">
                                Has a lower-case character
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={control}
                    name="isNumber"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="group flex gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={true}
                                className="bg-background hover:bg-card/50 dark:hover:bg-card border-2 border-border/40 dark:border-muted-foreground/30 data-[state=checked]:border-primary dark:data-[state=checked]:border-primary disabled:opacity-100 cursor-pointer"
                              />
                              <Label className="group-has-disabled:opacity-100!">
                                Has a number
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={control}
                    name="isSpecialCharacter"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="group flex gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={true}
                                className="bg-background hover:bg-card/50 dark:hover:bg-card border-2 border-border/40 dark:border-muted-foreground/30 data-[state=checked]:border-primary dark:data-[state=checked]:border-primary disabled:opacity-100 cursor-pointer"
                              />
                              <Label className="group-has-disabled:opacity-100!">
                                Has a special character
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={control}
                    name="isNotMoreThan32"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="group flex gap-2">
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={true}
                                className="bg-background hover:bg-card/50 dark:hover:bg-card border-2 border-border/40 dark:border-muted-foreground/30 data-[state=checked]:border-primary dark:data-[state=checked]:border-primary disabled:opacity-100 cursor-pointer"
                              />
                              <Label className="group-has-disabled:opacity-100!">
                                Has not more than 32 characters
                              </Label>
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
              )}

              <FormField
                control={control}
                name="confirmPassword"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <div>
                          <FloatingLabelPassword
                            label="Confirm password"
                            isDisabled={formState.isSubmitting}
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
            <Button
              variant="secondary"
              disabled={formState.isSubmitting || disableSubmitForPassword}
              className="w-full mt-4 py-5 shadow-none"
            >
              {formState.isSubmitting ? (
                <span className="flex justify-center items-center gap-1">
                  <Spinner />
                  Creating account
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
