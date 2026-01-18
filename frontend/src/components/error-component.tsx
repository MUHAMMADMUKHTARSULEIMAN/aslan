import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "./ui/button";

// @ts-expect-error
const ErrorComponent = ({ error, reset }) => {
  const router = useRouter();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();

  useEffect(() => {
    queryErrorResetBoundary.reset();
  }, [queryErrorResetBoundary]);

  return (
    <div className="mx-4 flex justify-center items-center">
      <div>
        {error.message
          ? error.message
          : "Unable to fetch articles. Make sure you're connected to the Internet and try again."}
        <Button
          variant="secondary-full"
          className="py-5"
          onClick={() => {
            router.invalidate();
          }}
        >
          Retry
        </Button>
      </div>
    </div>
  );
};

export default ErrorComponent;
