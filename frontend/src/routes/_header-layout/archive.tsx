import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/archive')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/archive"!</div>
}
