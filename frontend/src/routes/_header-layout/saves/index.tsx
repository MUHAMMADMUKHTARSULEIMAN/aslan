import SaveCard from "@/components/save-card";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import type { Save } from "..";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import SaveCardSkeleton from "@/components/save-card-skeleton";
import { dummiesCreator } from "@/lib/utils";
import useInfiniteSentinel from "@/hooks/use-infinite-sentinel";
import InfiniteLoader from "@/components/infinite-loader";
import QueryError from "@/components/query-error";
import useIsFetchNextPageError from "@/hooks/use-is-fetch-next-page-error";

const fetchSaves = async (
  email: string | null,
  returnTo: string,
  sort: "1" | "-1",
  page: number = 1,
  limit: string
) => {
  const response = await fetch(
    `https://localhost:2020/api/saves?email=${email}&returnTo=${returnTo}&sort=${sort}&page=${page.toString()}&limit=${limit}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error("Something went wrong. Try again later.");
  }

  const data = await response.json();
  return {
    data,
    nextPage:
      data?.data?.saves.length === parseInt(limit) ? page + 1 : undefined,
  };
};

const infiniteSavesQueryOptions = (
  email: string,
  returnTo: string,
  sort: "1" | "-1",
  limit: string
) =>
  infiniteQueryOptions({
    queryKey: ["saves"],
    queryFn: ({ pageParam }) =>
      fetchSaves(email, returnTo, sort, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (currentPage) => currentPage.nextPage,
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/saves/")({
  component: RouteComponent,
  beforeLoad: ({ context: { user }, location }) => {
    const email = user?.email;
    const returnTo = location.pathname;

    if (user && email === null)
      throw redirect({
        to: "/sign-in",
        search: { returnTo },
      });
  },
  loader: ({ context: { queryClient, user }, location }) => {
    const email = user?.email;
    const returnTo = location.pathname;

    queryClient.ensureInfiniteQueryData(
      infiniteSavesQueryOptions(email, returnTo, "-1", "20")
    );
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const email = user?.email;
  const { location } = useRouterState();
  const returnTo = location.pathname;

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    status,
    error,
    refetch,
  } = useInfiniteQuery(infiniteSavesQueryOptions(email, returnTo, "-1", "20"));

	const booly = useIsFetchNextPageError(isFetchNextPageError)

  useInfiniteSentinel(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sentinelRef
  );

  const dummies = dummiesCreator(20);

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-4 w-full">
        {dummies.map((dummy) => {
          return <SaveCardSkeleton key={dummy} />;
        })}
      </div>
    );
  }

  if (status === "error") {
    if (error?.name === "AbortError") {
      return (
        <QueryError
          refetch={refetch}
          message="Your request timed out. Check your internet connection and try again."
        />
      );
    } else {
      return (
        <QueryError
          refetch={refetch}
          message="Something went wrong. Check your internet connection and try again."
        />
      );
    }
  }

  const saves: Save[] = [];

  data.pages.forEach((page) => {
    page.data.data?.saves.forEach((save: Save) => saves.push(save));
  });

  return (
    <section>
      {saves && saves.length === 0 ? (
        <div className="w-full">
          <h1 className="text-2xl font-medium text-center mb-6">
            You currently do not have any article saved.
          </h1>
          <Link to="/feeds">
            <Button variant="secondary-full">Discover new articles</Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          {saves.map((save) => {
            const { _id, image, length, siteName, title, url } = save;
            return (
              <SaveCard
                key={title}
                _id={_id}
                image={image}
                length={length}
                siteName={siteName}
                title={title}
                url={url}
              />
            );
          })}
        </div>
      )}
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={booly}
        sentinelRef={sentinelRef}
      />
    </section>
  );
}
