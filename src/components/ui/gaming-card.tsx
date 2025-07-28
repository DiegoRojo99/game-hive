import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GamingCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export function GamingCard({ children, className, hover = true, glow = false }: GamingCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-gaming-card border border-gaming-border p-6 transition-all duration-300",
        hover && "hover:border-gaming-primary hover:shadow-gaming cursor-pointer",
        glow && "shadow-glow",
        className
      )}
    >
      {children}
    </div>
  )
}