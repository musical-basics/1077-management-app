"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TimeLogger } from "@/components/assistant/time-logger"
import { ActiveProjects } from "@/components/assistant/active-projects"
import { AssistantInbox } from "@/components/assistant/assistant-inbox"
import { ListChecks, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AssistantPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeTab, setActiveTab] = useState<"tasks" | "inbox">("tasks")

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formattedDate = currentTime.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-background max-w-[375px] mx-auto pb-20">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="w-10" />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">1077</h1>
          <div className="relative">
            <Avatar className="w-9 h-9 border border-border">
              <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">SM</AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-background" />
          </div>
        </div>
      </header>

      <main className="px-5 py-6 space-y-6">
        {activeTab === "tasks" ? (
          <>
            {/* Hero Section - Time Clock */}
            <div className="space-y-2">
              <div className="text-center pb-2">
                <p className="text-muted-foreground text-sm uppercase tracking-wider mb-1">Today</p>
                <p className="text-xl font-semibold text-foreground">{formattedDate}</p>
              </div>
              <TimeLogger />
            </div>

            {/* Shift Briefing Card */}
            <Card className="border border-border bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                  Today's Objective
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground leading-relaxed">
                  Focus on turnover for Unit B. Guests arriving at 4 PM.
                </p>
              </CardContent>
            </Card>

            {/* Active Projects (replaces flat task list) */}
            <ActiveProjects />
          </>
        ) : (
          <AssistantInbox />
        )}
      </main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[375px] bg-background/80 backdrop-blur-xl border-t border-border">
        <div className="flex">
          <button
            onClick={() => setActiveTab("tasks")}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 transition-colors",
              activeTab === "tasks" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <ListChecks className="w-5 h-5" />
            <span className="text-xs font-medium">Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={cn(
              "flex-1 flex flex-col items-center gap-1 py-3 transition-colors",
              activeTab === "inbox" ? "text-foreground" : "text-muted-foreground",
            )}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Inbox</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
