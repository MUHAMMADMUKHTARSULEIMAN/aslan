import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_header-layout/')({
  component: App,
})

function App() {
  return (
    <div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-accent-foreground'>
						<h1 className='font-semibold text-3xl'>Accent foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-accent'>
						<h1 className='font-semibold text-3xl'>Accent</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-background'>
						<h1 className='font-semibold text-3xl'>Background</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-foreground'>
						<h1 className='font-semibold text-3xl'>Foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-primary'>
						<h1 className='font-semibold text-3xl'>Primary</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-primary-foreground'>
						<h1 className='font-semibold text-3xl'>Primary Foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-secondary'>
						<h1 className='font-semibold text-3xl'>Secondary</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-secondary-foreground'>
						<h1 className='font-semibold text-3xl'>Secondary Foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-muted'>
						<h1 className='font-semibold text-3xl'>Muted</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-muted-foreground'>
						<h1 className='font-semibold text-3xl'>Muted foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar'>
						<h1 className='font-semibold text-3xl'>Sidebar</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-accent'>
						<h1 className='font-semibold text-3xl'>Sidebar Accent</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-accent-foreground'>
						<h1 className='font-semibold text-3xl'>Sidebar Accent Foregound</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-border'>
						<h1 className='font-semibold text-3xl'>Sidebar Border</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-foreground'>
						<h1 className='font-semibold text-3xl'>Sidebar Foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-primary'>
						<h1 className='font-semibold text-3xl'>Sidebar Primary</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-primary-foreground'>
						<h1 className='font-semibold text-3xl'>Siebar Primary Foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-sidebar-ring'>
						<h1 className='font-semibold text-3xl'>Sidebar Ring</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-destructive'>
						<h1 className='font-semibold text-3xl'>Destructive</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-destructive-foreground'>
						<h1 className='font-semibold text-3xl'>Destructive Foreground</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-border'>
						<h1 className='font-semibold text-3xl'>Border</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-input'>
						<h1 className='font-semibold text-3xl'>Input</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-ring'>
						<h1 className='font-semibold text-3xl'>Ring</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-article-background'>
						<h1 className='font-semibold text-3xl'>Article Background</h1>
					</div>
					<div className='w-full min-h-20 text-slate-800 flex items-center justify-center bg-article-foreground'>
						<h1 className='font-semibold text-3xl'>Article Foreground</h1>
					</div>
    </div>
  )
}
