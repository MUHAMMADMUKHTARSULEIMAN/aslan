import { createFileRoute } from "@tanstack/react-router";
import ArticleCard from "@/components/article-card";
import RecentCard from "@/components/recent-card";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import LinkHelper from "@/components/link-helper";
import { checkFlexWrap, topics } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  //  const  [classString, setClassString] = useState<Array<number>>([])

	// let activeObserver: ResizeObserver | null = null

  // const initObserver = (): () => void => {
  //   const flexContainer =
  //     document.querySelector<HTMLDivElement>("#flex-container");

  //   if (!flexContainer) {
  //     requestAnimationFrame(initObserver);
  //     return () => {};
  //   }

	// 	if(!activeObserver) {
	// 		activeObserver = new ResizeObserver(() => {
	// 			setClassString(checkFlexWrap(flexContainer));
	// 		})
	// 	}
	// 	activeObserver.observe(flexContainer);

	// 	return () => {
	// 		if(activeObserver) {
	// 			activeObserver.disconnect()
	// 		}
	// 	}
  // };

  // useEffect(() => {
  //   if (document.readyState === "loading") {
  //     document.addEventListener("DOMContentLoaded", initObserver);
  //   } else {
  //     initObserver();
  //   }
  // }, [classString]);

	// console.log(classString)

  const { data, isPending, isError } = useQuery({
    queryKey: ["home-feed"],
    queryFn: fetchHomeFeed,
    staleTime: Infinity,
  });

  const user = data?.data.user;
  const feeds: Feed[] | null = data?.data.articles;
  const recents: Array<Recent[]> | null = data?.data.recents;

  const time = new Date().getHours();
  if (isError) {
    return (
      <div className="mt-16 mx-4 flex justify-center ">
        <div>
          <p>Something went wrong. Try again</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isPending ? (
        ""
      ) : (
        <section className="mt-6 mb-24">
          <div className="mx-4">
            <h3 className="mb-4 font-medium text-sm">
              Good{" "}
              {time < 12
                ? "morning"
                : time >= 12 && time < 18
                  ? "afternoon"
                  : "evening"}
              {user ? `, ${user}!` : "!"}
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
                        <div className="">
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
            <div id="flex-container" className="w-full flex flex-wrap gap-4">
              {topics.map((topic: string) => {
                return (
                  <div
                    key={topic}
                    className="data-[edge=true]:mr- hover:data-[edge=true]:mr-0 last:mr-5 hover:last:mr-0 group py-2 flex items-center border-b border-foreground/60 hover:text-primary cursor-pointer"
                  >
                    <span>{topic}</span>
                    <ChevronRight className="group-hover:-mr-[5.67px] h-4.5! max-w-0 group-hover:w-4.5 -mb-px text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
