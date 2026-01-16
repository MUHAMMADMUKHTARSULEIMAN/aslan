import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/feeds/$category")({
  component: RouteComponent,
});

function RouteComponent() {
return (
    <Tabs defaultValue={topics[0]} className="w-full gap-0">
      <ScrollArea className="w-screen whitespace-nowrap border-b-[1.5px] border-border">
        <TabsList className="">
          {topics.map((topic: string) => {
            const nomalizedTopic = textLowerCasifierAndHyphenator(topic);
            return (
              <TabsTrigger
                key={topic}
                value={nomalizedTopic}
                className=""
              >
                {topic}
              </TabsTrigger>
            );
          })}
        </TabsList>
        <ScrollBar orientation="horizontal" className=""/>
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
