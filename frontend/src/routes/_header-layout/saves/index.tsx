import SaveCard from "@/components/save-card";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  redirect,
  useRouterState,
} from "@tanstack/react-router";
import type { Save } from "..";

const fetchPosts = async (email: string | null, returnTo: string) => {
  const response = await fetch(
    `https://localhost:2020/api/saves?email=${email}&returnTo=${returnTo}`,
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

const postsQueryOptions = (email: string | null, returnTo: string) =>
  queryOptions({
    queryKey: ["posts", email],
    queryFn: () => fetchPosts(email, returnTo),
    staleTime: Infinity,
  });

export const Route = createFileRoute("/_header-layout/saves/")({
  component: RouteComponent,
  beforeLoad: ({ context: { user }, location }) => {
    const email = user?.email;
    const returnTo = location.pathname;

    if (user && email === null)
      throw redirect({
        to: "/sign-in",
        search: { returnTo },
      });
  },
  loader: async ({ context: { queryClient, user }, location }) => {
    const email = user?.email;
    const returnTo = location.pathname;
    await queryClient.ensureQueryData(postsQueryOptions(email, returnTo));
  },
});

function RouteComponent() {
  const { user } = Route.useRouteContext();
  const email = user?.email;
  const { location } = useRouterState();
  const returnTo = location.pathname;

  const { data } = useSuspenseQuery(postsQueryOptions(email, returnTo));
  // const saves: Save[][] = data?.data?.saves;
  console.log("data:", data);

  return (
    <section>
      <div className="flex flex-col gap-4 w-full">
				<h1>Welcome</h1>
        {/* {saves && saves.length === 0
          ? ""
          : saves.map((save) => {
              const { _id, image, length, siteName, title, url } = save[0];
              return (
                <SaveCard
                  key={title}
                  _id={_id}
                  image={image}
                  length={length}
                  siteName={siteName}
                  title={title}
                  url={url}
                />
              );
            })} */}
      </div>
    </section>
  );
}
