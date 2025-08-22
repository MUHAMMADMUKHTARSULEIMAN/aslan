import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArticleCard } from "@/components/article-card";

export const Route = createFileRoute("/home")({
  component: RouteComponent,
});

function RouteComponent() {
  const name = "Muhammad Mukhtar";
  return (
    <div>
      <Header />
      <section className="mx-3 mt-8 mb-24">
        <h3 className="font-semibold">Good morning, {name}!</h3>
        <div className="my-3">
          <h1 className="font-bold text-3xl">Recent Saves</h1>
          <Button
            variant="link"
            className="p-0 underline-offset-0.5 font-semibold"
          >
            <Link to="/home">Go to Saves</Link>
          </Button>
          <Card className="p-2 border-5 border-border/10 dark:border-input/10">
            <div className="grid grid-cols-[4fr_5fr] gap-2">
                <img
                  className="rounded-md w-full aspect-3/2 object-cover"
                  src="https://i0.wp.com/www.themarginalian.org/wp-content/uploads/2013/05/einstein1.jpg?w=680&ssl=1"
                  alt=""
                />
              <div className="flex justify-between aspect-15/8 gap-2 flex-col">
                <h3 className="font-semibold text-sm">
                  Do Scientists Pray? Einstein Answers a Little Girl’s Question
                  about Science vs. Religion
                </h3>
                <h3 className="font-semibold text-muted-foreground text-sm">
                  The Marginalian
                </h3>
              </div>
            </div>
          </Card>
        </div>
				<div className="py-8">
					<h1 className="font-bold text-3xl">
						Trousers-Worthy Reads
					</h1>
					<p className="pb-4">
						Stories to fuel your mind
					</p>
					<ArticleCard />
				</div>
      </section>
    </div>
  );
}
