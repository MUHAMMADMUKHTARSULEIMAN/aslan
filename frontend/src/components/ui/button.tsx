import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border dark:border-input shadow-xs bg-background dark:bg-input/20 hover:bg-accent dark:hover:bg-background hover:text-accent-foreground dark:hover:text-accent",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-2 hover:underline text-base cursor-pointer",
				first: "bg-emerald-200 dark:bg-emerald-950/75 text-emerald-950 dark:text-emerald-200 hover:bg-emerald-200/60 dark:hover:bg-emerald-950/50 shadow-xs cursor-pointer",
				"first-icon": "h-auto w-auto p-0 bg-inherit text-inherit hover:text-emerald-600 dark:hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer",
				"sign-on": "bg-card/50 hover:bg-card/90 dark:hover:bg-card/20 text-inherit border-2 border-input/50 dark:border-input/20 rounded-xl shadow-xs cursor-pointer",
				"nav-icon": "hover:text-emerald-800 dark:hover:text-emerald-200 bg-background text-foreground",
				"card-save-ghost": "bg-inherit text-inherit hover:bg-secondary/80 dark:hover:bg-secondary hover:text-secondary-foreground border-2 border-border/20 dark:border-input/20 hover:border-none",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
				full: "w-full py-2 h-max"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
