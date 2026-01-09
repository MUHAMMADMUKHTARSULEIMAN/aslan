import { createFileRoute, Link } from "@tanstack/react-router";
import ArticleCard from "@/components/article-card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
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
                <LinkHelper label="Go to Saves" to="/saves" width="w-[83%]" textSize="text-sm" icon={<ChevronRight className="w-4.5! h-4.5!" />}/>
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
										    title={title}
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
              Popular Topics
            </h1>
          </div>
          <div className="flex flex-col gap-6">
            {/* <ArticleCard /> */}
          </div>
        </div>
      </section>
    </div>
  );
}
