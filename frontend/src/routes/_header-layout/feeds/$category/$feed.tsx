import { andToAmpersand, dummiesCreator } from "@/lib/utils";
import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import type { Discovery } from "../..";
import ArticleCard from "@/components/article-card";
import ArticleCardSkeleton from "@/components/article-card-skeleton";
import QueryError from "@/components/query-error";
import { useRef } from "react";
import useInfiniteSentinel from "@/hooks/use-infinite-sentinel";
import useIsFetchNextPageError from "@/hooks/use-is-fetch-next-page-error";
import InfiniteLoader from "@/components/infinite-loader";

const fetchDiscoveries = async (
  category: string,
  feed: string,
  sort: "1" | "-1",
  page: number = 1,
  limit: string
) => {
  const response = await fetch(
    `https://localhost:2020/api/discoveries/get-discoveries/${category}/${feed}?sort=${sort}&page=${page.toString()}&limit=${limit}`,
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
      data?.data?.discoveries.length === parseInt(limit) ? page + 1 : undefined,
  };
};

const infiniteDiscoveriesQueryOptions = (
  category: string,
  feed: string,
  sort: "1" | "-1",
  limit: string
) =>
  infiniteQueryOptions({
    queryKey: ["discoveries", feed],
    queryFn: ({ pageParam }) =>
      fetchDiscoveries(category, feed, sort, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (currentPage) => currentPage.nextPage,
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/feeds/$category/$feed")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    const category = andToAmpersand(params.category);
    const feed = andToAmpersand(params.feed);
    queryClient.ensureInfiniteQueryData(
      infiniteDiscoveriesQueryOptions(category, feed, "-1", "20")
    );
  },
});

function RouteComponent() {
  let { category, feed } = Route.useParams();
  category = andToAmpersand(category);
  feed = andToAmpersand(feed);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetchNextPageError,
    status,
    refetch,
    error,
  } = useInfiniteQuery(
    infiniteDiscoveriesQueryOptions(category, feed, "-1", "20")
  );

  const booly = useIsFetchNextPageError(isFetchNextPageError);

  useInfiniteSentinel(
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    sentinelRef
  );

  const dummies = dummiesCreator(20);

  if (status === "pending") {
    return (
      <div className="flex flex-col gap-4 mx-4 mt-22">
        {dummies.map((dummy: number) => {
          return <ArticleCardSkeleton key={dummy} />;
        })}
      </div>
    );
  }

  if (status === "error") {
    if (error?.name === "AbortError") {
      return (
        <QueryError
          refetch={refetch}
          message="Your request timed out. Check your internet connection and try
            again."
          marginTop="mt-22"
        />
      );
    } else {
      return (
        <QueryError
          refetch={refetch}
          message="Something went wrong. Check your internet connection and try again."
          marginTop="mt-22"
        />
      );
    }
  }

  const discoveries: Discovery[] = [];

  data.pages.forEach((page) => {
    page.data.data?.discoveries.forEach((discovery: Discovery) =>
      discoveries.push(discovery)
    );
  });

  return (
    <section>
      <div className="mt-22 mx-4 flex flex-col gap-4 mb-12">
        {discoveries.map((discovery) => {
          const { _id, image, siteName, title, url, excerpt } = discovery;
          return (
            <ArticleCard
              key={_id}
              _id={_id}
              excerpt={excerpt}
              image={image}
              siteName={siteName}
              title={title}
              url={url}
            />
          );
        })}
      </div>
      <InfiniteLoader
        fetchNextPage={fetchNextPage}
        isFetchingNextPage={isFetchingNextPage}
        isFetchNextPageError={booly}
        sentinelRef={sentinelRef}
      />
    </section>
  );
}
