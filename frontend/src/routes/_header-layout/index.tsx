import { createFileRoute, Link } from "@tanstack/react-router";
import ArticleCard from "@/components/article-card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import RecentCard from "@/components/recent-card";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

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
  const articles = data?.data.articles;
  console.log("articles:", articles);
  const recents: Array<Recent[]> | null = data?.data.recents;
  console.log("recents:", recents);
  const time = new Date().getHours();

  return (
    <div>
      <section className="mt-4 mb-24">
        <div className="mx-4">
          {user ? (
            <h3 className="font-medium mb-4 text-sm">
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
        <div>
          {!recents ? (
            ""
          ) : (
            <div>
              <div className="mb-1 mx-4 flex justify-between items-baseline">
                <h1 className="font-medium text-base">Recent Saves</h1>
                <div className="relative group">
                  <Link
                    to="/saves"
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "p-0 m-0 font-normal text-sm flex gap-0 hover:no-underline"
                    )}
                  >
                    Go to Saves{" "}
                    <span>
                      <ChevronRight />
                    </span>
                  </Link>
                  <span className="absolute bottom-2.5 left-0 w-[83%] h-[0.5px] bg-primary scale-x-0 transition-transform group-hover:scale-x-100"></span>
                </div>
              </div>
              <div className="mb-4 w-screen flex shrink-0 flex-nowrap overflow-x-auto">
                {recents.map((recent: Recent[]) => {
									const unit = recent[0]
									const {_id, image, siteName, title, url} = unit
									return (
										<div
										  key={url}
										  className="min-w-[84%] first:ml-4 first:mr-2 ml-2 mr-2 last:ml-2 last:mr-4"
										>
										  <RecentCard
											key={_id}
										    _id={_id}
										    image={image}
										    siteName={siteName}
										    title={"Do Scientists Pray? Einstein Answers a Little Girl’s Question."}
										    url={url}
										  />
										</div>
									)
								}
								)}
              </div>
            </div>
          )}
        </div>
        <div className="mx-4">
          <div className="mb-4">
            <h1 className="font-medium text-xl">
              Stories that Belong in Sanctum
            </h1>
            <p className="text-[15px]">Stories to fuel your mind</p>
          </div>
          <div className="flex flex-col gap-6">
            <ArticleCard />
						<RecentCard _id={recents?.[0]?.[0]._id || ""} image={recents?.[1]?.[0].image || "https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"} siteName={recents?.[0]?.[0].siteName || ""} url={recents?.[0]?.[0].url || ""} title={"normAL title form my head"} />
          </div>
        </div>
      </section>
    </div>
  );
}
