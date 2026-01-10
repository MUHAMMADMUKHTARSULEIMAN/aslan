import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/feeds')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/feeds"!</div>
}
