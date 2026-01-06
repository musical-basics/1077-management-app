import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogEntry {
  id: string
  timestamp: string
  sender: "ai" | "user"
  name: string
  message: string
}

const logEntries: LogEntry[] = [
  {
    id: "1",
    timestamp: "10:02 AM",
    sender: "ai",
    name: "AI Agent",
    message: "Texted Mike regarding Tuesday availability.",
  },
  {
    id: "2",
    timestamp: "10:05 AM",
    sender: "user",
    name: "Mike",
    message: "Replied 'Yes, I can do that.'",
  },
  {
    id: "3",
    timestamp: "10:06 AM",
    sender: "ai",
    name: "AI Agent",
    message: "Locked in Mike for Tuesday. Shift Confirmed.",
  },
  {
    id: "4",
    timestamp: "10:15 AM",
    sender: "ai",
    name: "AI Agent",
    message: "Sent reminder to Sarah about Unit B turnover at 2 PM.",
  },
  {
    id: "5",
    timestamp: "10:18 AM",
    sender: "user",
    name: "Sarah",
    message: "Acknowledged. Will be there early.",
  },
]

export function AiAssistantLog() {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">AI Scheduling Assistant</h2>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="max-h-[320px] overflow-y-auto">
          <div className="p-4 space-y-4">
            {logEntries.map((entry) => (
              <div key={entry.id} className="flex gap-3">
                <Avatar className={cn("w-8 h-8 flex-shrink-0", entry.sender === "ai" ? "bg-chart-3/10" : "bg-muted")}>
                  <AvatarFallback className="bg-transparent">
                    {entry.sender === "ai" ? (
                      <Bot className="w-4 h-4 text-chart-3" />
                    ) : (
                      <User className="w-4 h-4 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn("text-sm font-medium", entry.sender === "ai" ? "text-chart-3" : "text-foreground")}
                    >
                      {entry.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                  </div>
                  <p className="text-sm text-foreground/90 mt-0.5 leading-relaxed">{entry.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
