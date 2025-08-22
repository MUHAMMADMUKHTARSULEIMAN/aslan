import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/highlights')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/highlights"!</div>
}
