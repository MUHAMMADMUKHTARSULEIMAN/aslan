import {useState, forwardRef} from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";

interface FloatingLabelInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelPassword = forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, className, ...props }, ref) => {

    const value = props.value || "";
    const hasValue = value.toString().length > 0;

		const [visible, setVisible] = useState(false)
		
    return (
			<div className="relative">
				<Input
				ref={ref}
				type={visible ? "text" : "password"}
					className={`peer rounded-xl border-2 border-border/40 dark:border-muted-foreground/30 bg-background dark:bg-background hover:bg-card/50 dark:hover:bg-card focus:bg-card/50 dark:focus:bg-card shadow-none pt-5 pb-4 ${className}`}
					{...props}
				/>
        <FormLabel
          className={`
            absolute text-md left-[14.5px] top-10/21 cursor-text transition-all duration-300 ease-out transform -translate-y-9/23 text-border dark:text-muted-foreground/50 bg-background pointer-events-none peer-hover:bg-card/50 peer-focus:bg-card/50 dark:peer-hover:bg-card dark:peer-focus:bg-card

            ${
              hasValue
                ? 'text-sm -translate-y-7 left-3 bg-background px-px text-border peer-hover:bg-background peer-focus:bg-background dark:peer-hover:bg-background dark:peer-focus:bg-background peer-disabled:z-100'
                : ""
            }
          `}
        >
          {label}
        </FormLabel>
				<div onClick={() => setVisible((prev) => !prev)} className="absolute right-[3.5px] top-[3.5px] bg-background text-foreground peer-hover:bg-card/50 dark:peer-hover:bg-card peer-focus:bg-card/50 dark:peer-focus:bg-card p-[7px] rounded-[11px] cursor-pointer">
				{
					visible
					? <EyeOff className="h-[1.2rem]! w-[1.2rem]!" />
					: <Eye className="h-[1.2rem]! w-[1.2rem]!" />

				}
          {/* <EyeOff className="absolute h-[1.2rem]! w-[1.2rem]! scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" /> */}
          <span className="sr-only">Show password</span>
        </div>
      </div>
    );
  }
);

export default FloatingLabelPassword;