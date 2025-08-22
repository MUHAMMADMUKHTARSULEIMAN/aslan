import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/export')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/export"!</div>
}
