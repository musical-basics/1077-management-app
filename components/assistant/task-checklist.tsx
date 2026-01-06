"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  title: string
  completed: boolean
}

const initialTasks: Task[] = [
  { id: "1", title: "Walk Dog & Pick up Groceries", completed: false },
  { id: "2", title: "Clean Unit B Kitchen", completed: false },
  { id: "3", title: "Replace Bathroom Towels", completed: true },
  { id: "4", title: "Check Pool Filter", completed: false },
  { id: "5", title: "Prepare Welcome Basket", completed: false },
]

export function TaskChecklist() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Tasks</h2>
        <span className="text-sm text-muted-foreground">
          {completedCount}/{tasks.length}
        </span>
      </div>

      <div className="space-y-0">
        {tasks.map((task, index) => (
          <button
            key={task.id}
            onClick={() => toggleTask(task.id)}
            className={cn(
              "w-full flex items-center gap-4 py-4 text-left transition-colors",
              index !== tasks.length - 1 && "border-b border-border",
            )}
          >
            {/* Custom Checkbox */}
            <div
              className={cn(
                "w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                task.completed ? "bg-success border-success" : "border-border hover:border-muted-foreground",
              )}
            >
              {task.completed && <Check className="w-4 h-4 text-success-foreground" strokeWidth={3} />}
            </div>

            {/* Task Title */}
            <span
              className={cn(
                "text-base leading-snug transition-all duration-200",
                task.completed ? "text-muted-foreground line-through" : "text-foreground",
              )}
            >
              {task.title}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
