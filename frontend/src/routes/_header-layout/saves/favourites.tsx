import SaveCard from "@/components/save-card";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import type { Save } from "..";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const fetchFavourites = async (
  email: string | null,
  returnTo: string,
  sort: "1" | "-1",
  page: number = 1,
  limit: string
) => {
  const response = await fetch(
    `https://localhost:2020/api/saves/favourites?email=${email}&returnTo=${returnTo}&sort=${sort}&page=${page.toString()}&limit=${limit}`,
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
      data?.data?.favourites.length === parseInt(limit) ? page + 1 : undefined,
  };
};

export const Route = createFileRoute("/_header-layout/saves/favourites")({
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
    queryKey: ["favourites"],
    queryFn: ({ pageParam }) =>
      fetchFavourites(email, returnTo, "-1", pageParam, "20"),
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

  const favourites: Save[] = [];

  data.pages.forEach((page) => {
    page.data.data?.favourites.forEach((favourite: Save) => favourites.push(favourite));
  });

  return (
    <section>
      <div className="flex flex-col gap-4 w-full">
        {favourites && favourites.length === 0 ? (
          <div>
            <h1 className="text-2xl font-semibold text-center mb-6">
              You currently do not have any article favourited.
            </h1>
            <Link to="/saves">
              <Button variant="secondary-full">Go back to saves</Button>
            </Link>
          </div>
        ) : (
          favourites.map((favourite) => {
            const { _id, image, length, siteName, title, url } = favourite;
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
      <div ref={sentinelRef} className="flex justify-center items-center">
        {isFetchingNextPage ? (
					<div className="py-6">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
					</div>
        ) : isFetchNextPageError ? (
          <div className="flex flex-col gap-6 py-6">
            <p>Unable to load more articles. Please try again.</p>
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
