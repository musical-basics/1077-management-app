"use client"

import { useState } from "react"
import { Send, Bot } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "ai" | "manual" | "employee"
  text: string
  timestamp: string
}

interface Employee {
  id: string
  name: string
  initials: string
  online: boolean
  messages: Message[]
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah M.",
    initials: "SM",
    online: true,
    messages: [
      { id: "1", type: "ai", text: "Reminder: Unit B turnover scheduled for 2 PM today.", timestamp: "10:00 AM" },
      { id: "2", type: "employee", text: "Acknowledged. Will be there early.", timestamp: "10:05 AM" },
      { id: "3", type: "manual", text: "Great, thanks! Let me know when you're done.", timestamp: "10:07 AM" },
      {
        id: "4",
        type: "employee",
        text: "Just finished the master suite. Moving to bathrooms now.",
        timestamp: "11:30 AM",
      },
    ],
  },
  {
    id: "2",
    name: "Mike R.",
    initials: "MR",
    online: false,
    messages: [
      { id: "1", type: "ai", text: "Are you available for a shift on Tuesday?", timestamp: "10:02 AM" },
      { id: "2", type: "employee", text: "Yes, I can do that.", timestamp: "10:05 AM" },
      { id: "3", type: "ai", text: "Perfect. You're confirmed for Tuesday 9 AM - 5 PM.", timestamp: "10:06 AM" },
    ],
  },
  {
    id: "3",
    name: "Jordan K.",
    initials: "JK",
    online: true,
    messages: [
      { id: "1", type: "ai", text: "Pool maintenance reminder for this afternoon.", timestamp: "9:00 AM" },
      { id: "2", type: "employee", text: "Got it. Chemicals are low, should I pick some up?", timestamp: "9:15 AM" },
      { id: "3", type: "manual", text: "Yes please. I'll reimburse you. Get the usual brand.", timestamp: "9:20 AM" },
    ],
  },
]

export function CommunicationHub() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee>(employees[0])
  const [aiPaused, setAiPaused] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [employeeMessages, setEmployeeMessages] = useState<Record<string, Message[]>>(
    employees.reduce((acc, emp) => ({ ...acc, [emp.id]: emp.messages }), {}),
  )

  const handleSend = () => {
    if (!newMessage.trim()) return

    const now = new Date()
    const timestamp = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    setEmployeeMessages((prev) => ({
      ...prev,
      [selectedEmployee.id]: [
        ...prev[selectedEmployee.id],
        {
          id: Date.now().toString(),
          type: "manual",
          text: newMessage.trim(),
          timestamp,
        },
      ],
    }))
    setNewMessage("")
  }

  const currentMessages = employeeMessages[selectedEmployee.id] || []

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Communication Hub</h2>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="flex h-[480px]">
          {/* Employee List */}
          <div className="w-56 border-r border-border flex flex-col">
            <div className="p-3 border-b border-border">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Team</p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => setSelectedEmployee(employee)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                      selectedEmployee.id === employee.id ? "bg-muted" : "hover:bg-muted/50",
                    )}
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8 border border-border">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                          {employee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card",
                          employee.online ? "bg-success" : "bg-muted-foreground",
                        )}
                      />
                    </div>
                    <span className="text-sm font-medium text-foreground">{employee.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header with Takeover Toggle */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{selectedEmployee.name}</span>
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    selectedEmployee.online ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  {selectedEmployee.online ? "Online" : "Offline"}
                </span>
              </div>
              {/* Takeover Toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Pause AI 24h</span>
                <Switch checked={aiPaused} onCheckedChange={setAiPaused} className="data-[state=checked]:bg-warning" />
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {currentMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex", message.type === "employee" ? "justify-start" : "justify-end")}
                  >
                    <div
                      className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5 flex gap-2",
                        // Gray for AI, Blue for manual, White/light for employee
                        message.type === "ai" && "bg-muted text-muted-foreground rounded-br-md",
                        message.type === "manual" && "bg-primary text-primary-foreground rounded-br-md",
                        message.type === "employee" && "bg-card border border-border text-foreground rounded-bl-md",
                      )}
                    >
                      {message.type === "ai" && <Bot className="w-4 h-4 shrink-0 mt-0.5" />}
                      <div>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            message.type === "manual" ? "text-primary-foreground/70" : "text-muted-foreground",
                          )}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={`Message ${selectedEmployee.name}...`}
                  className="flex-1 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-border"
                />
                <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()} className="shrink-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted" />
          <span>AI Automated</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span>Your Messages</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-border bg-card" />
          <span>Employee</span>
        </div>
      </div>
    </section>
  )
}
