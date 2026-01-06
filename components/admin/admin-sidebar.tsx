"use client"

import { LayoutDashboard, Calendar, Users, DollarSign, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminSidebarProps {
  activeNav: string
  onNavChange: (nav: string) => void
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "library", label: "Library", icon: FolderOpen },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "staff", label: "Staff", icon: Users },
  { id: "finances", label: "Finances", icon: DollarSign },
]

export function AdminSidebar({ activeNav, onNavChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      {/* Wordmark */}
      <div className="px-6 py-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-sidebar-foreground">1077</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeNav === item.id

          return (
            <button
              key={item.id}
              onClick={() => onNavChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                isActive
                  ? "text-sidebar-foreground bg-sidebar-accent"
                  : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50",
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-foreground rounded-r-full" />
              )}
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
