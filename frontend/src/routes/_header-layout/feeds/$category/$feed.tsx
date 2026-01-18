import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { feedNamesQueryOptions } from "../$category";
import { Suspense } from "react";

const fetchDiscoveries = async (feed: string) => {
  const response = await fetch(
    `https://localhost:2020/api/get-discoveries/${feed}`,
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

const discoveriesQueryOptions = (feed: string) =>
  queryOptions({
    queryKey: ["discoveries", feed],
    queryFn: () => fetchDiscoveries(feed),
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/feeds/$category/$feed")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
    await queryClient.ensureQueryData(feedNamesQueryOptions(params.category));
    await queryClient.ensureQueryData(discoveriesQueryOptions(params.feed));
  },
});

function RouteComponent() {
  const { category, feed } = Route.useParams();
	const {pathname} = useLocation()
	const activeTab = pathname.split("/").pop()
	console.log("activeTab", activeTab)

  const feedNamesData = useSuspenseQuery(feedNamesQueryOptions(category));
  const discoveriesData = useSuspenseQuery(discoveriesQueryOptions(feed));

  const feedNames = feedNamesData?.data?.data?.feedNames.sort();
  const discoveries = discoveriesData?.data?.data?.discoveries;

  return (
    <div>
      <Tabs defaultValue={category} className="w-full gap-0">
        <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
          <TabsList className="">
            {topics.map((topic: string) => {
              const normalizedTopic = textLowerCasifierAndHyphenator(topic);
              return (
								<Link to="/feeds/$category" params={{category: normalizedTopic}}>
                <TabsTrigger
                  key={topic}
                  value={normalizedTopic}
                  className=""
									>
                  {topic}
                </TabsTrigger>
									</Link>
              );
            })}
          </TabsList>
          <ScrollBar orientation="horizontal" className="" />
        </ScrollArea>
        {topics.map((topic: string) => {
          const normalizedTopic = textLowerCasifierAndHyphenator(topic);
          return (
            <TabsContent key={topic} value={normalizedTopic}>
              <Tabs defaultValue={activeTab} className="gap-0">
                <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
									<Suspense></Suspense>
                  <TabsList className="">
                    {feedNames.map((feed: string) => {
                      const normalizedFeed =
                        textLowerCasifierAndHyphenator(feed);
                      return (
												<Link to="/feeds/$category/$feed" params={{category: normalizedTopic, feed: normalizedFeed}}>
                        <TabsTrigger
                          key={feed}
                          value={normalizedFeed}
                          className=""
                        >
                          {feed}
                        </TabsTrigger>
															</Link>
                      );
                    })}
                  </TabsList>
                  <ScrollBar orientation="horizontal" className="" />
                </ScrollArea>
								{feedNames.map((feed: string) => {
									const normalizedFeed = textLowerCasifierAndHyphenator(feed)
									return (
										<TabsContent key={feed} value={normalizedFeed}>
											{feed}
										</TabsContent>
									)
								})}
              </Tabs>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
