import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useScrollTracking from "@/hooks/use-scroll-tracking";
import {
  ampersandToAnd,
  andToAmpersand,
  dummiesCreator,
  textCapitalizerAndSpacifier,
  textLowerCasifierAndHyphenator,
  topics,
} from "@/lib/utils";
import { categoryAtom } from "@/store/atoms";
import { queryOptions, useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useAtom } from "jotai";

export const fetchFeedNames = async (category: string) => {
  const response = await fetch(
    `https://localhost:2020/api/discoveries/get-feed-names/${category}`,
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

  return await response.json();
};

export const feedNamesQueryOptions = (category: string) =>
  queryOptions({
    queryKey: ["feed-names", category],
    queryFn: async () => {
      return await fetchFeedNames(category);
    },
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/feeds/$category")({
  component: RouteComponent,
	loader: async ({context: {queryClient}, params}) => {
		const category = params.category
		let searchCategory = andToAmpersand(category)
		if(!topics.includes(textCapitalizerAndSpacifier(searchCategory))) searchCategory ="business"

		 queryClient.ensureQueryData(feedNamesQueryOptions(searchCategory))
	}
});

function RouteComponent() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const tabRef = useScrollTracking();
  const { category } = Route.useParams();

  const [newCategory, setNewCategory] = useAtom(categoryAtom);
  setNewCategory(category);

  const searchCategory = andToAmpersand(category);

  const { data, status, refetch, error } = useQuery(feedNamesQueryOptions(searchCategory));

  if (
    data &&
    location.pathname === (`/feeds/${category}` || `/feeds/${category}/`)
  ) {
		const feeds = data.data.feedNames.sort()
    const feed = ampersandToAnd(
      textLowerCasifierAndHyphenator(feeds[0])
    );
    navigate({
      to: "/feeds/$category/$feed",
      params: {
        category,
        feed,
      },
    });
  }

  const dummies = dummiesCreator(20);

  if (status === "pending") {
    return (
      <div
        ref={tabRef}
        className="fixed top-[53.53px] translate-y-[33.5px] left-0 z-30 transition-transform duration-350 ease-in-out data-[visible=true]:translate-y-[33.5px] data-[visible=false]:-translate-y-[20.03px]"
      >
        <ScrollArea className="w-screen whitespace-nowrap">
          <div className="w-full px-1 h-8 inline-flex gap-2 items-center bg-neutral-600/10 animate-pulse border-b-[1.5px] border-border">
            {dummies.map((dummy) => {
              return (
                <div
                  className="w-30 px-2 h-7 rounded-md bg-neutral-500/10"
                  key={dummy}
                ></div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" className="" />
        </ScrollArea>
      </div>
    );
  }

  if (status === "error") {
    if (error?.name === "AbortError") {
      return (
        <div className="w-full mt-22">
          <h1 className="text-2xl font-medium text-center mb-6">
            Your request timed out. Check your internet connection and try again.
          </h1>
          <div className="w-full flex justify-center items-center">
            <Button onClick={() => refetch()} variant="secondary">
              Try again
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full mt-22">
          <h1 className="text-2xl font-medium text-center mb-6">
            Something went wrong. Try again later.
          </h1>
          <div className="w-full flex justify-center items-center">
            <Button onClick={() => refetch()} variant="secondary">
              Try again
            </Button>
          </div>
        </div>
      );
    }
  }

  const feeds: string[] = data.data.feedNames.sort();

  return (
    <div>
      <Tabs
        key={newCategory}
        defaultValue={ampersandToAnd(textLowerCasifierAndHyphenator(feeds[0]))}
        className="gap-0"
      >
        <div
          ref={tabRef}
          className="fixed translate-y-[33.5px] top-[53.53px] left-0 z-30 transition-transform duration-250 ease-in-out data-[visible=true]:translate-y-[33.5px] data-[visible=false]:-translate-y-[53.53px]"
        >
          <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
            <TabsList key={newCategory}>
              {feeds.map((feed: string) => {
                const normalizedFeed = ampersandToAnd(
                  textLowerCasifierAndHyphenator(feed)
                );
                return (
                  <Link
                    key={feed}
                    to="/feeds/$category/$feed"
                    params={{
                      category: newCategory,
                      feed: normalizedFeed,
                    }}
                  >
                    <TabsTrigger key={normalizedFeed} value={normalizedFeed}>
                      {feed}
                    </TabsTrigger>
                  </Link>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="" />
          </ScrollArea>
        </div>
        {feeds.map((feed: string) => {
          const normalizedFeed = ampersandToAnd(
            textLowerCasifierAndHyphenator(feed)
          );
          return (
            <TabsContent key={normalizedFeed} value={normalizedFeed}>
              <Outlet />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
