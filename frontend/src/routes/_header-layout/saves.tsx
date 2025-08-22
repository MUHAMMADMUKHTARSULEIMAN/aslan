import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/saves')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/saves"!</div>
}
