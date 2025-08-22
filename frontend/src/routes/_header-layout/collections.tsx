import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/collections')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/collections"!</div>
}
