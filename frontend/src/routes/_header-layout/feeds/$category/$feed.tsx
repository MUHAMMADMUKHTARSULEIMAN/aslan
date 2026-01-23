import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ampersandToAnd,
  andToAmpersand,
  textLowerCasifierAndHyphenator,
  topics,
} from "@/lib/utils";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouteContext } from "@tanstack/react-router";
import type { Discovery } from "../..";
import ArticleCard from "@/components/article-card";
import useScrollTracking from "@/hooks/use-scroll-tracking";

const fetchDiscoveries = async (category: string, feed: string) => {
  const response = await fetch(
    `https://localhost:2020/api/get-discoveries/${category}/${feed}`,
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

const discoveriesQueryOptions = (category: string, feed: string) =>
  queryOptions({
    queryKey: ["discoveries", feed],
    queryFn: () => fetchDiscoveries(category, feed),
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/feeds/$category/$feed")({
  component: RouteComponent,
  loader: async ({ context: { queryClient }, params }) => {
		const category = andToAmpersand(params.category)
    await queryClient.ensureQueryData(discoveriesQueryOptions(category, params.feed));
  },
});

function RouteComponent() {
  const { category, feed } = Route.useParams();
	const newCategory = andToAmpersand(category)
  const { feeds } = useRouteContext({
    from: "/_header-layout/feeds/$category",
  });
	const tabRef = useScrollTracking()

  const discoveriesData = useSuspenseQuery(discoveriesQueryOptions(newCategory, feed));
  const discoveries: Discovery[] = discoveriesData?.data?.data?.discoveries;

  return (
    <div>
      <Tabs key={newCategory} defaultValue={newCategory} className="w-full gap-0">
        <ScrollArea className={`w-screen whitespace-nowrap border-b-[1.5px] border-border`}>
          <TabsList ref={tabRef} className={``}>
            {topics.map((topic: string) => {
              const normalizedTopic = textLowerCasifierAndHyphenator(topic);
              const redirectTopic = ampersandToAnd(normalizedTopic);
              return (
                <Link
                  key={topic}
                  to="/feeds/$category"
                  params={{ category: redirectTopic }}
                  preloadDelay={750}
                >
                  <TabsTrigger key={topic} value={normalizedTopic} className="">
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
                  <TabsList className="">
                    {feeds.map((feed: string) => {
                      const normalizedFeed =
                        textLowerCasifierAndHyphenator(feed);
                      const redirectTopic = ampersandToAnd(normalizedTopic);
                      return (
                        <Link
                          key={feed}
                          to="/feeds/$category/$feed"
                          params={{
                            category: redirectTopic,
                            feed: normalizedFeed,
                          }}
                          preloadDelay={750}
                        >
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
                  const normalizedFeed = textLowerCasifierAndHyphenator(feed);
                  return (
                    <TabsContent key={feed} value={normalizedFeed}>
                      <div className="mt-6 mx-4 flex flex-col gap-4 mb-12">
                        {discoveries.map((discovery) => {
                          const { _id, image, siteName, title, url, excerpt } =
                            discovery;
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
                    </TabsContent>
                  );
                })}
              </Tabs>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
