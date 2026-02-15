import { forwardRef } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  refetch: () => {};
	message: string;
  marginTop?: string;
}

const QueryError = forwardRef<HTMLDivElement, DefaultComponentProps>(
  ({ refetch, message, marginTop }, ref) => {
        return (
          <div ref={ref} className={cn("w-full", marginTop)}>
						<div className="mx-4">
            <h1 className="text-lg font-normal text-center mb-6">
              {message}
            </h1>
            <div className="w-full flex justify-center items-center">
              <Button onClick={() => refetch()} variant="secondary">
                Try again
              </Button>
            </div>
						</div>
          </div>
        );
  }
);

export default QueryError;
