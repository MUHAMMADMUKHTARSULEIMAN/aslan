import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useScrollTracking from "@/hooks/use-scroll-tracking";
import {
  ampersandToAnd,
  textLowerCasifierAndHyphenator,
  topics,
} from "@/lib/utils";
import { categoryAtom } from "@/store/atoms";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_header-layout/feeds")({
  component: RouteComponent,
  beforeLoad: ({ location }) => {
    if (location.pathname === "/feeds" || location.pathname === "/feeds/") {
      throw redirect({
        to: "/feeds/$category",
        params: {
          category: ampersandToAnd(textLowerCasifierAndHyphenator(topics[0])),
        },
        replace: true,
      });
    }
  },
});

function RouteComponent() {
  const [newCategory, setNewCategory] = useAtom(categoryAtom);
  const tabRef = useScrollTracking();

  const [scopy, setScopy] = useState(0);
  useEffect(() => {
    setScopy(1);
  }, []);

  return (
    <div>
      <Tabs key={scopy} defaultValue={newCategory} className="w-full gap-0">
        <div
          ref={tabRef}
          className="fixed top-0 translate-y-[53.53px] left-0 z-40 transition-transform duration-250 ease-in-out data-[visible=true]:translate-y-[53.53px] data-[visible=false]:-translate-y-[86.53px]"
        >
          <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
            <TabsList ref={tabRef}>
              {topics.map((topic: string) => {
                const normalizedTopic = ampersandToAnd(textLowerCasifierAndHyphenator(topic))
                return (
                  <Link
                    key={normalizedTopic}
                    to="/feeds/$category"
                    params={{ category: normalizedTopic }}
                  >
                    <TabsTrigger
                      key={normalizedTopic}
                      value={normalizedTopic}
                      onClick={() => setNewCategory(normalizedTopic)}
                    >
                      {topic}
                    </TabsTrigger>
                  </Link>
                );
              })}
            </TabsList>
            <ScrollBar orientation="horizontal" className="" />
          </ScrollArea>
        </div>
        {topics.map((topic: string) => {
          const normalizedTopic = ampersandToAnd(textLowerCasifierAndHyphenator(topic));
          return (
            <TabsContent key={normalizedTopic} value={normalizedTopic}>
              <Outlet />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
