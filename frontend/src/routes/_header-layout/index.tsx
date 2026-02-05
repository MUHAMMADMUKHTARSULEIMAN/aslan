import { createFileRoute } from "@tanstack/react-router";
import ArticleCard from "@/components/article-card";
import RecentCard from "@/components/recent-card";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import LinkHelper from "@/components/link-helper";
import { cn, topics } from "@/lib/utils";
import { indexAtom, wrappedItemsAtom } from "@/store/atoms";
import { useAtom, useAtomValue } from "jotai";
import useTrackElement from "@/hooks/use-track-element";
import ErrorComponent from "@/components/error-component";

export interface Save {
  _id: string;
  image: string;
  length: number;
  siteName: string;
  title: string;
  url: string;
}
export interface Discovery {
  _id: string;
  excerpt: string;
  image: string;
  siteName: string;
  title: string;
  url: string;
}
interface Feed {
  category: string;
  data: Discovery[];
}

export const fetchHomeFeed = async (email: string | null) => {
  const response = await fetch(
    `https://localhost:2020/api/get-home-feed/${email}`,
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

const homeFeedQueryOptions = (email: string | null) =>
  queryOptions({
    queryKey: ["home-feed", email],
    queryFn: () => fetchHomeFeed(email),
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/")({
  loader: async ({ context: { queryClient, user } }) => {
    const email = user?.email;
    await queryClient.ensureQueryData(homeFeedQueryOptions(email));
  },
  component: App,
  errorComponent: ErrorComponent,
});

function App() {
  const { user } = Route.useRouteContext();

  const email = user?.email || null;
  const { data } = useSuspenseQuery(homeFeedQueryOptions(email));

  const categoriesOrder = [
    "Technology",
    "Science",
    "Self Improvement",
    "Business",
    "Health & Fitness",
    "Travel",
    "Politics",
  ];

  const categoryPriority = Object.fromEntries(
    categoriesOrder.map((role, index) => [role, index])
  );

  const feeds: Feed[] | null = data?.data?.articles
    ? data.data.articles.sort((a: Feed, b: Feed) => {
        const indexA = categoryPriority[a.category];
        const indexB = categoryPriority[b.category];

				return indexA - indexB
      })
    : null;
  const recents: Save[] | null = data?.data?.recents
    ? data.data.recents.sort()
    : null;
  const time = new Date().getHours();

  const trackRef = useTrackElement();
  const wrappedItemsArray = useAtomValue(wrappedItemsAtom).sort(
    (a, b) => a - b
  );

  const [hoveredIndex, setHoveredIndex] = useAtom(indexAtom);

  const getCustomRule = (): string => {
    const item = wrappedItemsArray.find((i) => i >= (hoveredIndex ?? -1));
    // Sad that it has to be this way
    let previousClass = "";
    if (item === 0) previousClass = "group-hover:data-[number=1]:mr-0";
    else if (item === 1) previousClass = "group-hover:data-[number=2]:mr-0";
    else if (item === 2) previousClass = "group-hover:data-[number=3]:mr-0";
    else if (item === 3) previousClass = "group-hover:data-[number=4]:mr-0";
    else if (item === 4) previousClass = "group-hover:data-[number=5]:mr-0";
    else if (item === 5) previousClass = "group-hover:data-[number=6]:mr-0";
    else if (item === 6) previousClass = "group-hover:data-[number=7]:mr-0";
    else if (item === 7) previousClass = "group-hover:data-[number=8]:mr-0";
    else if (item === 8) previousClass = "group-hover:data-[number=9]:mr-0";
    else if (item === 9) previousClass = "group-hover:data-[number=10]:mr-0";
    else if (item === 10) previousClass = "group-hover:data-[number=11]:mr-0";
    else if (item === 11) previousClass = "group-hover:data-[number=12]:mr-0";
    else if (item === 12) previousClass = "group-hover:data-[number=13]:mr-0";
    else if (item === 13) previousClass = "group-hover:data-[number=14]:mr-0";
    else if (item === 14) previousClass = "group-hover:data-[number=15]:mr-0";

    return previousClass;
  };

  return (
    <div>
      <section className="mt-6 mb-24">
        <div className="mx-4">
          <h3 className="mb-4 font-medium text-sm">
            Good{" "}
            {time < 12
              ? "morning"
              : time >= 12 && time < 18
                ? "afternoon"
                : "evening"}
            {user?.name ? `, ${user.name}!` : "!"}
          </h3>
        </div>
        <div className="mb-4">
          {!recents ? (
            ""
          ) : (
            <div>
              <div className="mx-4 flex justify-between items-baseline">
                <h3 className="font-medium text-lg">Recent Saves</h3>
                <LinkHelper
                  label="Go to Saves"
                  to="/saves"
                  bottom="bottom-2.5"
                  icon={
                    <ChevronRight className="h-4.5! max-w-0 group-hover:max-w-4.5 -mb-[3.5px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-100 ease-in-out pointer-events-none group-hover:pointer-events-auto" />
                  }
                />
              </div>
              <div className="mb-4 w-screen flex items-center shrink-0 flex-nowrap overflow-x-auto no-scrollbar">
                {recents.map((recent) => {
                  const { _id, image, siteName, title, url } = recent
                  return (
                    <div
                      key={_id}
                      className="min-w-[84%] first:ml-4 first:mr-2 ml-2 mr-2 last:ml-2 last:mr-4"
                    >
                      <RecentCard
                        _id={_id}
                        image={image}
                        siteName={siteName}
                        title={title}
                        url={url}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="mx-4">
          <div className="mb-12 flex flex-col gap-6">
            {!feeds ? (
              ""
            ) : (
              <div>
                <div className="mb-2">
                  <h2 className="font-medium text-xl">Popular Topics</h2>
                </div>
                {feeds.map((feed: Feed) => {
                  const { category, data } = feed;
                  return (
                    <div key={category} className="mb-6">
                      <div className="w-fit">
                        <LinkHelper
                          className="font-medium text-inherit text-lg hover:text-primary group-hover:text-primary underline hover:no-underline"
                          to="/"
                          label={`${category}`}
                          bottom="bottom-2.25"
                          icon={
                            <ChevronRight className="h-5! max-w-0 group-hover:max-w-5.5! -mb-1 text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto" />
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-4">
                        {data.map(
                          ({ _id, image, excerpt, siteName, title, url }) => {
                            return (
                              <ArticleCard
                                key={_id}
                                _id={_id}
                                image={image}
                                excerpt={excerpt}
                                siteName={siteName}
                                title={title}
                                url={url}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="mb-4">
            <h2 className="font-medium text-xl">All Topics</h2>
          </div>
          <div ref={trackRef} className="group flex flex-wrap gap-4">
            {topics.map((topic: string, index) => {
              return (
                <div
                  key={topic}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    "data-[edge=true]:mr-[12.33px] hover:data-[edge=true]:mr-0 group flex items-center border-b border-foreground/60 hover:text-primary cursor-pointer",
                    getCustomRule()
                  )}
                >
                  <span className="peer py-2">{topic}</span>
                  <ChevronRight className="peer-hover:-mr-[5.67px] hover:-mr-[5.67px] h-4.5! w-0 max-w-0 peer-hover:w-4.5 hover:w-4.5 peer-hover:max-w-4.5 hover:max-w-4.5 -mb-px text-primary opacity-0 peer-hover:opacity-100 hover:opacity-100 transition-all duration-300 ease-in-out" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
