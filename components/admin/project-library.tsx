"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

interface Step {
  id: string
  title: string
  duration?: string
}

interface Template {
  id: string
  name: string
  description: string
  steps: Step[]
}

const templates: Template[] = [
  {
    id: "1",
    name: "Standard Clean",
    description: "Regular turnover cleaning protocol",
    steps: [
      { id: "1-1", title: "Strip all beds and collect linens", duration: "10 min" },
      { id: "1-2", title: "Vacuum all floors and carpets", duration: "15 min" },
      { id: "1-3", title: "Dust all surfaces and furniture", duration: "10 min" },
      { id: "1-4", title: "Clean and sanitize bathrooms", duration: "20 min" },
      { id: "1-5", title: "Wipe down kitchen surfaces", duration: "10 min" },
      { id: "1-6", title: "Make beds with fresh linens", duration: "15 min" },
      { id: "1-7", title: "Empty all trash bins", duration: "5 min" },
      { id: "1-8", title: "Final walkthrough inspection", duration: "5 min" },
    ],
  },
  {
    id: "2",
    name: "Deep Clean",
    description: "Thorough cleaning for extended stays or quarterly maintenance",
    steps: [
      { id: "2-1", title: "All Standard Clean steps", duration: "90 min" },
      { id: "2-2", title: "Clean inside all appliances", duration: "30 min" },
      { id: "2-3", title: "Wash windows inside and out", duration: "20 min" },
      { id: "2-4", title: "Steam clean carpets", duration: "45 min" },
      { id: "2-5", title: "Clean behind and under furniture", duration: "25 min" },
      { id: "2-6", title: "Sanitize all light switches and handles", duration: "10 min" },
      { id: "2-7", title: "Clean air vents and replace filters", duration: "15 min" },
      { id: "2-8", title: "Polish all wood surfaces", duration: "20 min" },
    ],
  },
  {
    id: "3",
    name: "Dog Walk",
    description: "Standard pet care routine",
    steps: [
      { id: "3-1", title: "Collect dog and leash", duration: "2 min" },
      { id: "3-2", title: "30-minute neighborhood walk", duration: "30 min" },
      { id: "3-3", title: "Provide fresh water", duration: "2 min" },
      { id: "3-4", title: "Check food bowl and refill if needed", duration: "3 min" },
      { id: "3-5", title: "Quick play session", duration: "10 min" },
      { id: "3-6", title: "Log visit in app", duration: "3 min" },
    ],
  },
  {
    id: "4",
    name: "Pool Maintenance",
    description: "Daily pool care checklist",
    steps: [
      { id: "4-1", title: "Skim surface debris", duration: "10 min" },
      { id: "4-2", title: "Check and log chemical levels", duration: "5 min" },
      { id: "4-3", title: "Adjust chlorine if needed", duration: "5 min" },
      { id: "4-4", title: "Clean skimmer baskets", duration: "5 min" },
      { id: "4-5", title: "Brush pool walls and floor", duration: "15 min" },
      { id: "4-6", title: "Check pump and filter pressure", duration: "5 min" },
    ],
  },
]

export function ProjectLibrary() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const getTotalDuration = (steps: Step[]) => {
    let total = 0
    steps.forEach((step) => {
      if (step.duration) {
        const mins = Number.parseInt(step.duration)
        if (!isNaN(mins)) total += mins
      }
    })
    const hours = Math.floor(total / 60)
    const mins = total % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins} min`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Manage your SOPs and project templates</p>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <Accordion
        type="single"
        collapsible
        value={selectedTemplate || undefined}
        onValueChange={(val) => setSelectedTemplate(val || null)}
        className="space-y-3"
      >
        {templates.map((template) => (
          <AccordionItem
            key={template.id}
            value={template.id}
            className="border border-border rounded-xl bg-card overflow-hidden"
          >
            <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center justify-between w-full pr-2">
                <div className="text-left">
                  <p className="text-base font-medium text-foreground">{template.name}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{template.description}</p>
                </div>
                <div className="flex items-center gap-4 mr-2">
                  <span className="text-sm text-muted-foreground">{template.steps.length} steps</span>
                  <span className="text-sm font-medium text-foreground">{getTotalDuration(template.steps)}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0">
              <div className="border-t border-border pt-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-3 font-medium">#</th>
                      <th className="pb-3 font-medium">Step</th>
                      <th className="pb-3 font-medium text-right">Est. Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {template.steps.map((step, index) => (
                      <tr
                        key={step.id}
                        className={cn("text-sm", index !== template.steps.length - 1 && "border-b border-border/50")}
                      >
                        <td className="py-3 text-muted-foreground w-10">{index + 1}</td>
                        <td className="py-3 text-foreground">{step.title}</td>
                        <td className="py-3 text-muted-foreground text-right">{step.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
