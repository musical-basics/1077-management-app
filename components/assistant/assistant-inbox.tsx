"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  sender: "hq" | "me"
  text: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "hq",
    text: "Good morning! Unit B turnover is priority today. Guests arriving at 4 PM.",
    timestamp: "8:00 AM",
  },
  {
    id: "2",
    sender: "me",
    text: "Got it. Starting with the master suite now.",
    timestamp: "8:15 AM",
  },
  {
    id: "3",
    sender: "hq",
    text: "Perfect. Also, the pool filter needs attention - guest mentioned it looked cloudy yesterday.",
    timestamp: "8:20 AM",
  },
  {
    id: "4",
    sender: "me",
    text: "I'll check the chemical levels and clean the filter after the suite.",
    timestamp: "8:22 AM",
  },
  {
    id: "5",
    sender: "hq",
    text: "Great. Let me know when you finish the turnover so I can confirm with the guest.",
    timestamp: "8:25 AM",
  },
]

export function AssistantInbox() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (!newMessage.trim()) return

    const now = new Date()
    const timestamp = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: "me",
        text: newMessage.trim(),
        timestamp,
      },
    ])
    setNewMessage("")
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Messages from HQ</h2>
      </div>

      {/* Chat Area */}
      <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.sender === "me" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2.5",
                    message.sender === "me"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md",
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={cn(
                      "text-[10px] mt-1",
                      message.sender === "me" ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Send Message to Host..."
              className="flex-1 bg-muted border-0 focus-visible:ring-1 focus-visible:ring-border"
            />
            <Button size="icon" onClick={handleSend} disabled={!newMessage.trim()} className="shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
