"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TemplateDialog } from "./template-dialog"
import { getTemplates, deleteTemplate, addTask, updateTask } from "@/app/admin/actions"

interface Step {
  id: string
  title: string
  duration?: string
  project_id: string
}

interface Template {
  id: string
  name: string
  description: string
  estimated_duration?: number
  steps: Step[]
}

export function ProjectLibrary() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const data = await getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this template?")) return

    try {
      await deleteTemplate(id)
      fetchTemplates()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleAddStep = async (templateId: string) => {
    try {
      await addTask(templateId)
      fetchTemplates()
    } catch (error) {
      console.error('Error adding step:', error)
    }
  }

  const getTotalDuration = (steps: Step[]) => {
    let total = 0
    steps.forEach((step) => {
      if (step.duration) {
        const mins = parseInt(step.duration)
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
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-transparent"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      <TemplateDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={fetchTemplates}
      />

      {loading ? (
        <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <p className="text-muted-foreground">No SOPs found. Create your first one.</p>
          <Button
            variant="ghost"
            className="mt-2 text-primary"
            onClick={() => setIsDialogOpen(true)}
          >
            Create Template
          </Button>
        </div>
      ) : (
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
              className="border border-border rounded-xl bg-card overflow-hidden group"
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

                    {/* Action Buttons - Visible on Group Hover */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => { e.stopPropagation(); console.log("Edit template meta") }}
                        title="Edit Template Details"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDelete(template.id, e)}
                        title="Delete Template"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
                        <TaskRow key={step.id} step={step} index={index} onUpdate={fetchTemplates} />
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2 text-muted-foreground hover:text-foreground"
                      onClick={() => handleAddStep(template.id)}
                    >
                      <Plus className="w-3 h-3" />
                      Add Step
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  )
}

function TaskRow({ step, index, onUpdate }: { step: Step, index: number, onUpdate: () => void }) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(step.title)
  const [duration, setDuration] = useState(step.duration || "")

  const handleSave = async () => {
    if (title === step.title && duration === step.duration) {
      setIsEditing(false)
      return
    }

    try {
      await updateTask(step.id, title, duration)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    }
  }

  if (isEditing) {
    return (
      <tr className="text-sm border-b border-border/50">
        <td className="py-3 text-muted-foreground w-10">{index + 1}</td>
        <td className="py-3 pr-2">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-8"
          />
        </td>
        <td className="py-3 pl-2 text-right">
          <Input
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="h-8 w-20 ml-auto"
            placeholder="5 min"
          />
        </td>
      </tr>
    )
  }

  return (
    <tr
      className="text-sm border-b border-border/50 group/row hover:bg-muted/30 transition-colors cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <td className="py-3 text-muted-foreground w-10">{index + 1}</td>
      <td className="py-3 text-foreground group-hover/row:text-primary transition-colors">{step.title}</td>
      <td className="py-3 text-muted-foreground text-right">{step.duration}</td>
    </tr>
  )
}
