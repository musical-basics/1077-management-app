"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface SubTask {
  id: string
  title: string
  completed: boolean
}

interface Project {
  id: string
  title: string
  subtasks: SubTask[]
}

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Master Suite Turnover",
    subtasks: [
      { id: "1-1", title: "Strip Bed & Collect Linens", completed: true },
      { id: "1-2", title: "Vacuum All Floors", completed: true },
      { id: "1-3", title: "Dust Surfaces & Furniture", completed: false },
      { id: "1-4", title: "Clean Bathroom", completed: false },
      { id: "1-5", title: "Restock Toiletries", completed: false },
      { id: "1-6", title: "Make Bed with Fresh Linens", completed: false },
      { id: "1-7", title: "Check & Replace Towels", completed: false },
      { id: "1-8", title: "Empty Trash Bins", completed: false },
      { id: "1-9", title: "Wipe Down Mirrors", completed: false },
      { id: "1-10", title: "Check Minibar Inventory", completed: false },
      { id: "1-11", title: "Test All Electronics", completed: false },
      { id: "1-12", title: "Final Walkthrough", completed: false },
    ],
  },
  {
    id: "2",
    title: "Pool Area Maintenance",
    subtasks: [
      { id: "2-1", title: "Skim Pool Surface", completed: true },
      { id: "2-2", title: "Check Chemical Levels", completed: true },
      { id: "2-3", title: "Clean Pool Filter", completed: true },
      { id: "2-4", title: "Wipe Down Loungers", completed: false },
      { id: "2-5", title: "Refill Towel Station", completed: false },
    ],
  },
  {
    id: "3",
    title: "Guest Welcome Prep",
    subtasks: [
      { id: "3-1", title: "Prepare Welcome Basket", completed: false },
      { id: "3-2", title: "Print Arrival Info Sheet", completed: false },
      { id: "3-3", title: "Set Thermostat to 72°F", completed: false },
    ],
  },
]

export function ActiveProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)

  const toggleSubtask = (projectId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              subtasks: project.subtasks.map((st) => (st.id === subtaskId ? { ...st, completed: !st.completed } : st)),
            }
          : project,
      ),
    )
  }

  const getProgress = (project: Project) => {
    const completed = project.subtasks.filter((st) => st.completed).length
    return { completed, total: project.subtasks.length }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Active Projects</h2>

      <Accordion type="single" collapsible className="space-y-3">
        {projects.map((project) => {
          const { completed, total } = getProgress(project)
          const isComplete = completed === total

          return (
            <AccordionItem
              key={project.id}
              value={project.id}
              className="border border-border rounded-xl bg-card overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="text-left">
                    <p
                      className={cn(
                        "text-base font-medium",
                        isComplete ? "text-muted-foreground line-through" : "text-foreground",
                      )}
                    >
                      {project.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {completed}/{total} Completed
                    </p>
                  </div>
                  {/* Progress Ring */}
                  <div className="relative w-10 h-10 mr-2">
                    <svg className="w-10 h-10 -rotate-90">
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-border"
                      />
                      <circle
                        cx="20"
                        cy="20"
                        r="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${(completed / total) * 100.53} 100.53`}
                        className={isComplete ? "text-success" : "text-foreground"}
                        strokeLinecap="round"
                      />
                    </svg>
                    {isComplete && <Check className="absolute inset-0 m-auto w-4 h-4 text-success" strokeWidth={3} />}
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="border-t border-border pt-3 space-y-0">
                  {project.subtasks.map((subtask, index) => (
                    <button
                      key={subtask.id}
                      onClick={() => toggleSubtask(project.id, subtask.id)}
                      className={cn(
                        "w-full flex items-center gap-3 py-3 text-left transition-colors",
                        index !== project.subtasks.length - 1 && "border-b border-border/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                          subtask.completed
                            ? "bg-success border-success"
                            : "border-border hover:border-muted-foreground",
                        )}
                      >
                        {subtask.completed && <Check className="w-3.5 h-3.5 text-success-foreground" strokeWidth={3} />}
                      </div>
                      <span
                        className={cn(
                          "text-sm leading-snug transition-all duration-200",
                          subtask.completed ? "text-muted-foreground line-through" : "text-foreground",
                        )}
                      >
                        {subtask.title}
                      </span>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </section>
  )
}
