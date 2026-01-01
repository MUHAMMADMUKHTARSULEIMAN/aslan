import Header from '@/components/header'
import { createFileRoute, Outlet, useRouterState } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout')({
  component: RouteComponent,
})

function RouteComponent() {
	const {location} = useRouterState()
	const pathname = location.pathname
  return (
	<div>
		<Header pathname={pathname}/>
		<Outlet />
	</div>
	)
}
