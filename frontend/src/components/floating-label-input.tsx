import * as React from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, className, ...props }, ref) => {

    const value = props.value || "";
    const hasValue = value.toString().length > 0;

    return (
      <div className="relative group">
        <FormLabel
          className={`
            absolute text-md left-[14.5px] top-10/21 cursor-text transition-all duration-300 ease-out transform -translate-y-9/23 text-border dark:text-muted-foreground/50 bg-background pointer-events-none group-has-hover:bg-card/50 group-has-focus:bg-card/50 dark:group-has-hover:bg-card dark:group-has-focus:bg-card

            ${
              hasValue
                ? 'text-sm -translate-y-7 left-3 bg-background px-px text-border group-has-hover:bg-background group-has-focus:bg-background dark:group-has-hover:bg-background dark:group-has-focus:bg-background group-has-disabled:z-100'
                : ""
            }
          `}
        >
          {label}
        </FormLabel>
        <Input
				ref={ref}
          className={`rounded-xl border-2 border-border/40 dark:border-muted-foreground/30 bg-background dark:bg-background hover:bg-card/50 dark:hover:bg-card focus:bg-card/50 dark:focus:bg-card shadow-none pt-5 pb-4 ${className}`}
          {...props}
        />
      </div>
    );
  }
);

export default FloatingLabelInput;