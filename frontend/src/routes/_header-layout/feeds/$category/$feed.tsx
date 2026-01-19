import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link,  useRouteContext } from "@tanstack/react-router";
import type { Discovery } from "../..";
import ArticleCard from "@/components/article-card";

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
    await queryClient.ensureQueryData(discoveriesQueryOptions(params.feed));
  },
});

function RouteComponent() {
  const { category, feed } = Route.useParams();
	const {feeds} = useRouteContext({from: "/_header-layout/feeds/$category"})

  const discoveriesData = useSuspenseQuery(discoveriesQueryOptions(feed));
  const discoveries: Discovery[] = discoveriesData?.data?.data?.discoveries;


  return (
    <div>
      <Tabs key={category} defaultValue={category} className="w-full gap-0">
        <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
          <TabsList className="fixed top-[53.333px] z-40">
            {topics.map((topic: string) => {
              const normalizedTopic = textLowerCasifierAndHyphenator(topic);
              return (
								<Link to="/feeds/$category" params={{category: normalizedTopic}} reloadDocument={false}>
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
              <Tabs key={feed} defaultValue={feed} className="gap-0">
                <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
                  <TabsList className="fixed top-[85.3333px]">
                    {feeds.map((feed: string) => {
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
								{feeds.map((feed: string) => {
									const normalizedFeed = textLowerCasifierAndHyphenator(feed)
									return (
										<TabsContent key={feed} value={normalizedFeed}>
											<div className="mt-6 mx-4 flex flex-col gap-4">
											{discoveries.map(discovery => {
												const {_id, image, siteName, title, url, excerpt} = discovery
												return <ArticleCard _id={_id} excerpt={excerpt} image={image} siteName={siteName} title={title} url={url} />
											})}
											</div>
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
