import SavesCard from "@/components/saves-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/saves")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="mx-3 mt-8 mb-24">
      <SavesCard />
    </section>
  );
}
