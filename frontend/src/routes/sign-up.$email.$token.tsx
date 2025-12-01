import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up/$email/$token')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_sign-on-layout/sign-up"!</div>
}
