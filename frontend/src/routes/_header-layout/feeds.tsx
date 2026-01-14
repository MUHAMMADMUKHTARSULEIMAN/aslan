import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { textLowerCasifierAndHyphenator, topics } from "@/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/feeds")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Tabs>
        <div className="w-full overflow-x-auto">
          <ScrollArea className="w-full">
            <TabsList className="w-full overflow-x-auto">
              {topics.map((topic: string) => {
                const nomalizedTopic = textLowerCasifierAndHyphenator(topic);
                return (
                  <TabsTrigger key={topic} value={nomalizedTopic}>
                    {topic}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </ScrollArea>
        </div>
        {topics.map((topic: string) => {
          const nomalizedTopic = textLowerCasifierAndHyphenator(topic);
          return (
            <TabsContent key={topic} value={nomalizedTopic}>
              <Outlet />
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
