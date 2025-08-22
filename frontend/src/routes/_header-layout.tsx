import { Header } from '@/components/header'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
	<div>
		<Header />
		<Outlet />
	</div>
	)
}
