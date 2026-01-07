import { createFileRoute, Link } from "@tanstack/react-router";
import ArticleCard from "@/components/article-card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import RecentCard from "@/components/recent-card";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_header-layout/")({
  component: App,
});

function App() {
	const fetchHomeFeed = async () => {
		const response = await fetch("https://localhost:2020/api/get-feed-articles", {
			method: "GET",
			credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
		});
		if(!response.ok) {
			throw new Error("Something went wrong. Try again later.")
		}

		return await response.json()
	}

	const result = useQuery({queryKey: ["home-feed"], queryFn: fetchHomeFeed})
	const data = result.data
	console.log(data)

  return (
    <div>
      <section className="mx-4 mt-4 mb-24">
        <h3 className="font-medium mb-4 text-sm">Good morning!</h3>
        <div className="mb-1 flex justify-between items-baseline">
          <h1 className="font-medium text-base">Last Save</h1>
          <Link
            to="/saves"
            className={cn(
              buttonVariants({ variant: "link" }),
              "p-0 m-0 font-normal text-sm"
            )}
          >
            Go to Saves
          </Link>
        </div>
        <RecentCard className="mb-4"/>
        <div className="mb-4">
          <h1 className="font-medium text-xl">Stories that Belong in Sanctum</h1>
          <p className="text-[15px]">Stories to fuel your mind</p>
        </div>
          <div className="flex flex-col gap-6">
            <ArticleCard />
          </div>
      </section>
    </div>
  );
}
