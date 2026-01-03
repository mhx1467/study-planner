import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
    size?: "default" | "sm" | "lg" | "icon"
  }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-500 transition-colors shadow-sm",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
    outline: "border border-slate-300 text-primary hover:bg-orange-400 hover:text-white hover:orange-amber-400 hover:border-orange-400 transition-colors",
    secondary: "bg-secondary text-black hover:bg-yellow-600 active:bg-yellow-700 transition-colors shadow-sm",
    ghost: "hover:bg-accent/10 text-accent hover:text-accent transition-colors",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }

