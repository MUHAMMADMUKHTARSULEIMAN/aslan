import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/saves/favourites')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/favourites"!</div>
}
