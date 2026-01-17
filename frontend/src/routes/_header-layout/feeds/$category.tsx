import { textCapitalizerAndSpacifier, textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/feeds/$category")({
  component: RouteComponent,
  beforeLoad: async ({ location, matches }) => {
    const params  = matches[matches.length - 1].params
		// @ts-expect-error
		const category = params.category
		let redirectCategory = ""
		if(topics.includes(textCapitalizerAndSpacifier(category))) {
			redirectCategory = category
			console.log("redirectCategory:", redirectCategory)
		} else {
			redirectCategory = "business"
		}

    const fetchFeedNames = async () => {
      const response = await fetch(
        `https://localhost:2020/api/get-feed-names/${redirectCategory}`,
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

		const data = await fetchFeedNames()
		const feed = data?.data?.feedNames.sort()

    if (
      location.pathname === `/feeds/${category}` ||
      location.pathname === `/feeds/${category}/`
    ) {
      throw redirect({
        to: "/feeds/$category/$feed",
        params: { category: redirectCategory, feed: textLowerCasifierAndHyphenator(feed[0]) },
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
