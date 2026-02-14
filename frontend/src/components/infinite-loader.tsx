import { forwardRef, type RefObject } from "react";
import { Button } from "./ui/button";

interface DefaultComponentProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  fetchNextPage: () => {};
  isFetchingNextPage: boolean;
  isFetchNextPageError: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

const InfiniteLoader = forwardRef<HTMLDivElement, DefaultComponentProps>(
  (
    { fetchNextPage, isFetchingNextPage, isFetchNextPageError, sentinelRef },
    ref
  ) => {
    return (
      <div ref={ref}>
        <div
          ref={sentinelRef}
          className="flex justify-center items-center mx-4"
        >
          {isFetchingNextPage ? (
            <div className="my-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : isFetchNextPageError ? (
            <div className="flex flex-col items-center gap-6 my-6">
              <p className="text-center">
                Unable to load more articles. Please try again.
              </p>
              <Button variant="secondary" onClick={() => fetchNextPage()}>
                Try again
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
);

export default InfiniteLoader;
