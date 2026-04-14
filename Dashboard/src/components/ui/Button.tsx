import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-700",
        danger: "bg-rose-600 text-white hover:bg-rose-700 shadow-sm",
        default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm font-semibold", // fallback
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10 justify-center",
        default: "h-10 px-4 py-2", // fallback
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
