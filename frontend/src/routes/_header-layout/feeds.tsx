import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import {
  createFileRoute,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useRef } from "react";

export const Route = createFileRoute("/_header-layout/feeds")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { location } = useRouterState();
  const pathname = location.pathname;
  const category = useRef("");

  if (pathname === "/feeds" || pathname === "/feeds/") {
    category.current = textLowerCasifierAndHyphenator(topics[0]);
    navigate({
      to: "/feeds/$category",
      params: { category: category.current },
    });
  }

  return (
    <Tabs
      defaultValue={textLowerCasifierAndHyphenator(topics[0])}
      className="w-full gap-0"
    >
      <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
        <TabsList className="">
          {topics.map((topic: string) => {
            const nomalizedTopic = textLowerCasifierAndHyphenator(topic);
            return (
              <TabsTrigger
                key={topic}
                value={nomalizedTopic}
                className=""
                onClick={() => {
                  navigate({
                    to: "/feeds/$category",
                    params: {
                      category: nomalizedTopic,
                    },
                  });
                }}
              >
                {topic}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" className="" />
      </ScrollArea>
      {topics.map((topic: string) => {
        const nomalizedTopic = textLowerCasifierAndHyphenator(topic);
        return (
          <TabsContent key={topic} value={nomalizedTopic}>
            <Outlet />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
