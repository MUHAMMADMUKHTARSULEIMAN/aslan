import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_header-layout/home")({
  component: RouteComponent,
});

function RouteComponent() {
		return (
		<div className='p-4 space-y-2'>
			{/* <div className='w-full min-h-20 text-white flex items-center justify-center bg-slate-500'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-white flex items-center justify-center bg-teal-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-black flex items-center justify-center bg-slate-500'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-black flex items-center justify-center bg-teal-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-white flex items-center justify-center bg-fuchsia-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-white flex items-center justify-center bg-emerald-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-black flex items-center justify-center bg-fuchsia-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-black flex items-center justify-center bg-emerald-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div> */}
			<h1 className='text-3xl font-bold mb-4 text-foreground'>Core Theme Colors</h1>
			{/* Core Theme Colors */}
			{/* <div className='w-full min-h-20 text-slate-950 flex items-center justify-center bg-slate-500'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-gray-200 flex items-center justify-center bg-gray-500'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-zinc-200 flex items-center justify-center bg-zinc-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-neutral-200 flex items-center justify-center bg-neutral-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-stone-200 flex items-center justify-center bg-stone-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-red-200 flex items-center justify-center bg-red-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-rose-200 flex items-center justify-center bg-rose-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-pink-200 flex items-center justify-center bg-pink-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-fuchsia-200 flex items-center justify-center bg-fuchsia-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-purple-200 flex items-center justify-center bg-purple-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-violet-200 flex items-center justify-center bg-violet-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-indigo-200 flex items-center justify-center bg-indigo-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-blue-200 flex items-center justify-center bg-blue-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-sky-200- flex items-center justify-center bg-sky-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-cyan-950 flex items-center justify-center bg-cyan-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-teal-950 flex items-center justify-center bg-teal-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-green-200 flex items-center justify-center bg-green-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-lime-200 flex items-center justify-center bg-lime-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-yellow-200 flex items-center justify-center bg-yellow-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-amber-200 flex items-center justify-center bg-amber-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-orange-200 flex items-center justify-center bg-orange-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div> */}
			<div className='w-full min-h-20 text-foreground flex items-center justify-center bg-background'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-background flex items-center justify-center bg-foreground'>
				<h1 className='font-semibold text-3xl'>Foreground (Text: Background)</h1>
			</div>
			<div className='w-full min-h-20 text-card-foreground flex items-center justify-center bg-card'>
				<h1 className='font-semibold text-3xl'>Card (Text: Card-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-popover-foreground flex items-center justify-center bg-popover'>
				<h1 className='font-semibold text-3xl'>Popover (Text: Popover-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-primary-foreground flex items-center justify-center bg-primary'>
				<h1 className='font-semibold text-3xl'>Primary (Text: Primary-Foreground)</h1>
			</div>
			{/* <div className='w-full min-h-20 text-secondary-foreground flex items-center justify-center bg-teal-600'>
				<h1 className='font-semibold text-3xl'>Background (Text: Foreground)</h1>
			</div> */}
			<div className='w-full min-h-20 text-primary flex items-center justify-center bg-primary-foreground'>
				<h1 className='font-semibold text-3xl'>Primary Foreground (Text: Primary)</h1>
			</div>
			<div className='w-full min-h-20 text-secondary-foreground flex items-center justify-center bg-secondary'>
				<h1 className='font-semibold text-3xl'>Secondary (Text: Secondary-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-secondary flex items-center justify-center bg-secondary-foreground'>
				<h1 className='font-semibold text-3xl'>Secondary Foreground (Text: Secondary)</h1>
			</div>
			<div className='w-full min-h-20 text-accent-foreground flex items-center justify-center bg-accent'>
				<h1 className='font-semibold text-3xl'>Accent (Text: Accent-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-accent flex items-center justify-center bg-accent-foreground'>
				<h1 className='font-semibold text-3xl'>Accent Foreground (Text: Accent)</h1>
			</div>
			<div className='w-full min-h-20 text-destructive-foreground flex items-center justify-center bg-destructive'>
				<h1 className='font-semibold text-3xl'>Destructive (Text: Destructive-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-destructive flex items-center justify-center bg-destructive-foreground'>
				<h1 className='font-semibold text-3xl'>Destructive Foreground (Text: Destructive)</h1>
			</div>
			<div className='w-full min-h-20 text-muted-foreground flex items-center justify-center bg-muted'>
				<h1 className='font-semibold text-3xl'>Muted (Text: Muted-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-muted flex items-center justify-center bg-muted-foreground'>
				<h1 className='font-semibold text-3xl'>Muted Foreground (Text: Muted)</h1>
			</div>
			
			<div className='w-full min-h-20 text-foreground flex items-center justify-center bg-border'>
				<h1 className='font-semibold text-3xl'>Border</h1>
			</div>
			<div className='w-full min-h-20 text-foreground flex items-center justify-center bg-input'>
				<h1 className='font-semibold text-3xl'>Input</h1>
			</div>
			<div className='w-full min-h-20 text-background flex items-center justify-center bg-ring'>
				<h1 className='font-semibold text-3xl'>Ring (Text: Background)</h1>
			</div>

			<h1 className='text-3xl font-bold my-4 text-foreground'>Article Colors</h1>
			{/* Article Colors */}
			<div className='w-full min-h-20 text-article-foreground flex items-center justify-center bg-article-background'>
				<h1 className='font-semibold text-3xl'>Article Background (Text: Article-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-article-background flex items-center justify-center bg-article-foreground'>
				<h1 className='font-semibold text-3xl'>Article Foreground (Text: Article-Background)</h1>
			</div>

			<h1 className='text-3xl font-bold my-4 text-foreground'>Sidebar Colors</h1>
			{/* Sidebar Colors */}
			<div className='w-full min-h-20 text-sidebar-foreground flex items-center justify-center bg-sidebar'>
				<h1 className='font-semibold text-3xl'>Sidebar (Text: Sidebar-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar flex items-center justify-center bg-sidebar-foreground'>
				<h1 className='font-semibold text-3xl'>Sidebar Foreground (Text: Sidebar)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar-primary-foreground flex items-center justify-center bg-sidebar-primary'>
				<h1 className='font-semibold text-3xl'>Sidebar Primary (Text: Sidebar-Primary-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar-primary flex items-center justify-center bg-sidebar-primary-foreground'>
				<h1 className='font-semibold text-3xl'>Sidebar Primary Foreground (Text: Sidebar-Primary)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar-accent-foreground flex items-center justify-center bg-sidebar-accent'>
				<h1 className='font-semibold text-3xl'>Sidebar Accent (Text: Sidebar-Accent-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar-accent flex items-center justify-center bg-sidebar-accent-foreground'>
				<h1 className='font-semibold text-3xl'>Sidebar Accent Foreground (Text: Sidebar-Accent)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar-foreground flex items-center justify-center bg-sidebar-border'>
				<h1 className='font-semibold text-3xl'>Sidebar Border (Text: Sidebar-Foreground)</h1>
			</div>
			<div className='w-full min-h-20 text-sidebar-foreground flex items-center justify-center bg-sidebar-ring'>
				<h1 className='font-semibold text-3xl'>Sidebar Ring (Text: Sidebar-Foreground)</h1>
			</div>

			<h1 className='text-3xl font-bold my-4 text-foreground'>Chart Colors</h1>
			{/* Chart Colors */}
			<div className='w-full min-h-20 text-primary-foreground flex items-center justify-center bg-chart-1'>
				<h1 className='font-semibold text-3xl'>Chart 1 (Primary)</h1>
			</div>
			<div className='w-full min-h-20 text-secondary-foreground flex items-center justify-center bg-chart-2'>
				<h1 className='font-semibold text-3xl'>Chart 2 (Secondary)</h1>
			</div>
			<div className='w-full min-h-20 text-accent-foreground flex items-center justify-center bg-chart-3'>
				<h1 className='font-semibold text-3xl'>Chart 3</h1>
			</div>
			<div className='w-full min-h-20 text-destructive-foreground flex items-center justify-center bg-chart-4'>
				<h1 className='font-semibold text-3xl'>Chart 4</h1>
			</div>
			<div className='w-full min-h-20 text-white flex items-center justify-center bg-chart-5'> {/* Assuming white for contrast */}
				<h1 className='font-semibold text-3xl'>Chart 5</h1>
			</div>


			<h1 className='text-3xl font-bold my-4 text-foreground'>Generated Color Pairs (RGB/CMY)</h1>
			{/* Generated Color Pairs */}
			<div className='w-full min-h-20 text-red-light flex items-center justify-center bg-red-dark'>
				<h1 className='font-semibold text-3xl'>Red Dark (Text: Red Light)</h1>
			</div>
			<div className='w-full min-h-20 text-red-dark flex items-center justify-center bg-red-light'>
				<h1 className='font-semibold text-3xl'>Red Light (Text: Red Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-green-light flex items-center justify-center bg-green-dark'>
				<h1 className='font-semibold text-3xl'>Green Dark (Text: Green Light)</h1>
			</div>
			<div className='w-full min-h-20 text-green-dark flex items-center justify-center bg-green-light'>
				<h1 className='font-semibold text-3xl'>Green Light (Text: Green Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-blue-light flex items-center justify-center bg-blue-dark'>
				<h1 className='font-semibold text-3xl'>Blue Dark (Text: Blue Light)</h1>
			</div>
			<div className='w-full min-h-20 text-blue-dark flex items-center justify-center bg-blue-light'>
				<h1 className='font-semibold text-3xl'>Blue Light (Text: Blue Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-cyan-light flex items-center justify-center bg-cyan-dark'>
				<h1 className='font-semibold text-3xl'>Cyan Dark (Text: Cyan Light)</h1>
			</div>
			<div className='w-full min-h-20 text-cyan-dark flex items-center justify-center bg-cyan-light'>
				<h1 className='font-semibold text-3xl'>Cyan Light (Text: Cyan Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-magenta-light flex items-center justify-center bg-magenta-dark'>
				<h1 className='font-semibold text-3xl'>Magenta Dark (Text: Magenta Light)</h1>
			</div>
			<div className='w-full min-h-20 text-magenta-dark flex items-center justify-center bg-magenta-light'>
				<h1 className='font-semibold text-3xl'>Magenta Light (Text: Magenta Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-yellow-light flex items-center justify-center bg-yellow-dark'>
				<h1 className='font-semibold text-3xl'>Yellow Dark (Text: Yellow Light)</h1>
			</div>
			<div className='w-full min-h-20 text-yellow-dark flex items-center justify-center bg-yellow-light'>
				<h1 className='font-semibold text-3xl'>Yellow Light (Text: Yellow Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-orange-light flex items-center justify-center bg-orange-dark'>
				<h1 className='font-semibold text-3xl'>Orange Dark (Text: Orange Light)</h1>
			</div>
			<div className='w-full min-h-20 text-orange-dark flex items-center justify-center bg-orange-light'>
				<h1 className='font-semibold text-3xl'>Orange Light (Text: Orange Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-violet-light flex items-center justify-center bg-violet-dark'>
				<h1 className='font-semibold text-3xl'>Violet Dark (Text: Violet Light)</h1>
			</div>
			<div className='w-full min-h-20 text-violet-dark flex items-center justify-center bg-violet-light'>
				<h1 className='font-semibold text-3xl'>Violet Light (Text: Violet Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-teal-light flex items-center justify-center bg-teal-dark'>
				<h1 className='font-semibold text-3xl'>Teal Dark (Text: Teal Light)</h1>
			</div>
			<div className='w-full min-h-20 text-teal-dark flex items-center justify-center bg-teal-light'>
				<h1 className='font-semibold text-3xl'>Teal Light (Text: Teal Dark)</h1>
			</div>

			<div className='w-full min-h-20 text-gold-light flex items-center justify-center bg-gold-dark'>
				<h1 className='font-semibold text-3xl'>Gold Dark (Text: Gold Light)</h1>
			</div>
			<div className='w-full min-h-20 text-gold-dark flex items-center justify-center bg-gold-light'>
				<h1 className='font-semibold text-3xl'>Gold Light (Text: Gold Dark)</h1>
			</div>
		</div>
	)
}
