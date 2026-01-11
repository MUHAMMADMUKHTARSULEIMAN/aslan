import {useState, forwardRef, useEffect} from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
	isDisabled: boolean;
}

const FloatingLabelPassword = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, isDisabled, className, ...props }, ref) => {

    const value = props.value || "";
    const hasValue = value.toString().length > 0;

		const [visible, setVisible] = useState(false)
		const [visibleBeforeDisAbled, setVisibleBeforeDisAbled] = useState(false)

		useEffect(() => {
			if(isDisabled) {
				setVisible(() => false)
				if(visible) {
					setVisibleBeforeDisAbled(() => true)
				} else {
					setVisibleBeforeDisAbled(() => false)
				}
			} else {
				if(visibleBeforeDisAbled) {
					setVisible(() => true)
				} else {
					setVisible(() => false)
				}
			}
		}, [isDisabled])
		
    return (
			<div className="relative">
				<Input
				ref={ref}
				type={visible ? "text" : "password"}
					className={`peer rounded-lg border-2 pr-9.5 border-border/40 dark:border-muted-foreground/30 bg-background dark:bg-background shadow-none pt-5 pb-4 ${className}`}
					{...props}
				/>
        <FormLabel
          className={`
            absolute text-md left-[14.5px] top-10/21 cursor-text transition-all duration-300 ease-out transform -translate-y-9/23 text-border dark:text-muted-foreground/50 bg-background pointer-events-none

            ${
              hasValue
                ? 'text-sm -translate-y-7 left-3 bg-background px-px peer-disabled:opacity-100'
                : ""
            }
          `}
        >
          {label}
        </FormLabel>
				<Button disabled={isDisabled} size="icon" type="button" onClick={() => setVisible((prev) => !prev)} className="absolute right-0.5 top-0.5 bg-background hover:bg-input dark:hover:bg-muted/40 text-border dark:text-muted-foreground-fifty p-[5px] rounded-r-md rounded-l-none cursor-pointer shadow-none">
				{
					visible
					? <EyeOff className="h-[1.2rem]! w-[1.2rem]!" />
					: <Eye className="h-[1.2rem]! w-[1.2rem]!" />
				}
          <span className="sr-only">Show password</span>
        </Button>
      </div>
    );
  }
);

export default FloatingLabelPassword;