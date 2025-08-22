import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/discover')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/discover"!</div>
}
