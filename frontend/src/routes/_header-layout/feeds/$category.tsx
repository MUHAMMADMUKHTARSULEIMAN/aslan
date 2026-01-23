import { andToAmpersand, textCapitalizerAndSpacifier, textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { queryOptions } from "@tanstack/react-query";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const fetchFeedNames = async (category: string) => {
	const response = await fetch(
		`https://localhost:2020/api/get-feed-names/${category}`,
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

export const feedNamesQueryOptions = (category: string) => queryOptions({
	queryKey: ["feed-names", category],
	queryFn: () => fetchFeedNames(category),
	staleTime: 60 * 1000
})

export const Route = createFileRoute("/_header-layout/feeds/$category")({
	component: RouteComponent,
  beforeLoad: async ({ location, matches, context: {queryClient} }) => {
		console.log("pathname:", location.pathname)
		const params  = matches[matches.length - 1].params
		// @ts-expect-error
		const category = params.category
		let redirectCategory = ""
		let searchCategory = andToAmpersand(category)
		if(topics.includes(textCapitalizerAndSpacifier(searchCategory))) {
			redirectCategory = category
		} else {
			redirectCategory = "business"
			searchCategory = "business"
		}
		console.log("redirect category:", redirectCategory)
		console.log("search category:", searchCategory)
		
		const data = await queryClient.ensureQueryData(feedNamesQueryOptions(searchCategory))
		const feeds: Array<string> = data?.data?.feedNames.sort()

    if (
      (location.pathname === `/feeds/${category}` ||
      location.pathname === `/feeds/${category}/`) && feeds.length > 0
    ) {
      throw redirect({
        to: "/feeds/$category/$feed",
        params: { category: redirectCategory, feed: textLowerCasifierAndHyphenator(feeds[0]) },
        replace: true,
      });
    }

		return {
			feeds
		}
  },
});

function RouteComponent() {
  return (
    <div className="">
      <Outlet />
    </div>
  );
}
