import SaveCard from "@/components/save-card";
import {
  queryOptions,
  useInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import type { Save } from "..";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const fetchPosts = async (
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
  } = useInfiniteQuery({
    queryKey: ["saves"],
    queryFn: ({ pageParam }) =>
      fetchPosts(email, returnTo, "-1", pageParam, "20"),
    initialPageParam: 1,
    getNextPageParam: (currentPage) => currentPage.nextPage,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage && hasNextPage)
          fetchNextPage();
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === "pending")
    return <div className="p-4">Loading initial data...</div>;
  if (status === "error")
    return <div className="p-4 text-red-500">Error loading data</div>;

  const saves: Save[] = [];

  data.pages.forEach((page) => {
    page.data.data?.saves.forEach((save: Save) => saves.push(save));
  });

  console.log("saves:", saves);

  return (
    <section>
      <div className="flex flex-col gap-4 w-full">
        {saves && saves.length === 0 ? (
          <h1 className="text-2xl font-semibold text-center">
            You currently do not have any article saved.
          </h1>
        ) : (
          saves.map((save) => {
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
          })
        )}
      </div>
      <div ref={sentinelRef} className="py-10 flex justify-center items-center">
        {isFetchingNextPage ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : isFetchNextPageError ? (
          <div className="flex flex-col gap-6">
            <p>Unable to load more article. Please try again.</p>
            <Button variant="secondary" onClick={() => fetchNextPage}>
              Try again
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
