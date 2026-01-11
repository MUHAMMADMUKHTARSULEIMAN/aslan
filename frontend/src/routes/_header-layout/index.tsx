import { createFileRoute } from "@tanstack/react-router";
import ArticleCard from "@/components/article-card";
import RecentCard from "@/components/recent-card";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import LinkHelper from "@/components/link-helper";

export const Route = createFileRoute("/_header-layout/")({
  component: App,
});

interface Recent {
  _id: string;
  image: string;
  length: number;
  siteName: string;
  title: string;
  url: string;
}
interface Article {
  _id: string;
  excerpt: string;
  image: string;
  siteName: string;
  title: string;
  url: string;
}
interface Feed {
  category: string;
  data: Article[];
}

export const fetchHomeFeed = async () => {
  const response = await fetch("https://localhost:2020/api/get-home-feed", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("Something went wrong. Try again later.");
  }

  return await response.json();
};

function App() {
  const { data } = useQuery({
    queryKey: ["home-feed"],
    queryFn: fetchHomeFeed,
    staleTime: Infinity,
  });

  console.log("data:", data);
  const user = data?.data.user;
  const feeds: Feed[] | null = data?.data.articles;
  console.log("articles:", feeds);
  const recents: Array<Recent[]> | null = data?.data.recents;
  console.log("recents:", recents);
  const time = new Date().getHours();

  return (
    <div>
      <section className="mt-6 mb-24">
        <div className="mx-4">
          {user ? (
            <h3 className="mb-4 font-medium text-sm">
              Good{" "}
              {time < 12
                ? "morning"
                : time >= 12 && time < 18
                  ? "afternoon"
                  : "evening"}
              , {user}!
            </h3>
          ) : (
            ""
          )}
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
                  textSize="text-sm"
                  icon={
                    <ChevronRight className="h-4.5! max-w-0 group-hover:max-w-4.5 -mb-[3.5px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto" />
                  }
                />
              </div>
              <div className="mb-4 pt-1 pb-3 w-screen flex items-center shrink-0 flex-nowrap overflow-x-auto">
                {recents.map((recent: Recent[]) => {
                  const unit = recent[0];
                  const { _id, image, siteName, title, url } = unit;
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
          <div className="mb-2">
            <h2 className="font-medium text-xl">Popular Topics</h2>
          </div>
          <div className="flex flex-col gap-6">
            {!feeds
              ? ""
              : feeds.map((feed: Feed) => {
                  const { category, data } = feed;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-lg">{category}</h3>
                        <LinkHelper
                          to="/"
                          label={`Go to ${category}`}
                          textSize="text-sm"
                          icon={
                            <ChevronRight className="h-4.5! max-w-0 group-hover:max-w-4.5 -mb-[3.5px] text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out pointer-events-none group-hover:pointer-events-auto" />
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
        </div>
      </section>
    </div>
  );
}
