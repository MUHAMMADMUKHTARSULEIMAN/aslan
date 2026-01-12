import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/feeds/$topic/$feed')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_header-layout/feeds/$topic/$feed"!</div>
}
