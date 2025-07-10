"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface DashboardSidebarItemProps {
  href: string
  icon: LucideIcon
  title: string
  description?: string
  isCollapsed?: boolean
}

/**
 * Single navigation entry for the dashboard sidebar.
 * Highlights itself when the current pathname matches `href`.
 */
export function DashboardSidebarItem({
  href,
  icon: Icon,
  title,
  description,
  isCollapsed = false,
}: DashboardSidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  const item = (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "h-9 w-full justify-start text-left",
        isCollapsed ? "px-2" : "px-3",
        isActive && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
      )}
    >
      <Icon className={cn("h-4 w-4 flex-shrink-0", !isCollapsed && "mr-2")} />
      {!isCollapsed && (
        <div className="flex flex-col items-start truncate">
          <span className="text-sm font-medium truncate">{title}</span>
          {description && !isActive && (
            <span className="text-xs text-muted-foreground hidden md:inline truncate">{description}</span>
          )}
        </div>
      )}
    </Button>
  )

  return (
    <Link href={href} className="block w-full">
      {isCollapsed ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent side="right" align="center" className="font-medium">
              {title}
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        item
      )}
    </Link>
  )
}
