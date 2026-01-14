"use client"

import { useState } from "react"
import { GripVertical, ChevronLeft, ChevronRight, Plus, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Shift {
  id: string
  title: string
  employee: string
  day: number
  startHour: number
  duration: number
  status: "confirmed" | "pending"
}

interface ProjectTemplate {
  id: string
  name: string
  duration: string
  hours: number
  color: string
  steps: string[]
}

const shifts: Shift[] = [
  { id: "1", title: "Unit B Turnover", employee: "Sarah", day: 1, startHour: 9, duration: 3, status: "confirmed" },
  { id: "2", title: "Dog Walk", employee: "Mike", day: 1, startHour: 14, duration: 1.5, status: "pending" },
  { id: "3", title: "Deep Clean", employee: "Emma", day: 2, startHour: 10, duration: 5, status: "confirmed" },
  { id: "4", title: "Groceries Run", employee: "Mike", day: 3, startHour: 11, duration: 1.5, status: "confirmed" },
  { id: "5", title: "Standard Clean", employee: "Sarah", day: 4, startHour: 9, duration: 3, status: "pending" },
  { id: "6", title: "Pool Maintenance", employee: "James", day: 5, startHour: 8, duration: 2, status: "confirmed" },
]

const projectTemplates: ProjectTemplate[] = [
  { id: "1", name: "Standard Clean", duration: "3h", hours: 3, color: "bg-chart-1", steps: ["Step 1", "Step 2"] },
  { id: "2", name: "Dog Walk & Groceries", duration: "1.5h", hours: 1.5, color: "bg-chart-2", steps: ["Step 1"] },
  { id: "3", name: "Deep Clean", duration: "5h", hours: 5, color: "bg-chart-3", steps: ["Step 1", "Step 2", "Step 3"] },
  { id: "4", name: "Pool Maintenance", duration: "2h", hours: 2, color: "bg-chart-5", steps: ["Step 1"] },
]

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8am to 8pm

export function MasterCalendar() {
  const [currentWeek] = useState(new Date())
  const [draggedTemplate, setDraggedTemplate] = useState<ProjectTemplate | null>(null)
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    hours: "",
    color: "bg-chart-1",
    steps: [""] as string[],
  })

  const colorOptions = [
    { value: "bg-chart-1", label: "Green" },
    { value: "bg-chart-2", label: "Yellow" },
    { value: "bg-chart-3", label: "Purple" },
    { value: "bg-chart-4", label: "Cyan" },
    { value: "bg-chart-5", label: "Orange" },
  ]

  const getWeekDates = () => {
    const start = new Date(currentWeek)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)

    return days.map((_, i) => {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      return date.getDate()
    })
  }

  const weekDates = getWeekDates()

  const getShiftsForDay = (dayIndex: number) => {
    return shifts.filter((shift) => shift.day === dayIndex)
  }

  const handleDragStart = (template: ProjectTemplate) => {
    setDraggedTemplate(template)
  }

  const handleDragEnd = () => {
    setDraggedTemplate(null)
  }

  const addStep = () => {
    setNewTemplate({ ...newTemplate, steps: [...newTemplate.steps, ""] })
  }

  const updateStep = (index: number, value: string) => {
    const updatedSteps = [...newTemplate.steps]
    updatedSteps[index] = value
    setNewTemplate({ ...newTemplate, steps: updatedSteps })
  }

  const removeStep = (index: number) => {
    const updatedSteps = newTemplate.steps.filter((_, i) => i !== index)
    setNewTemplate({ ...newTemplate, steps: updatedSteps.length > 0 ? updatedSteps : [""] })
  }

  const handleCreateTemplate = () => {
    // In a real app, this would save to the database
    setIsTemplateModalOpen(false)
    setNewTemplate({
      name: "",
      hours: "",
      color: "bg-chart-1",
      steps: [""],
    })
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left Column - Calendar Grid */}
      <div className="flex-1 min-w-0 flex flex-col border border-border rounded-lg overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-foreground">
              {currentWeek.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-muted/20">
          <div className="p-2" />
          {days.map((day, i) => (
            <div key={day} className="p-3 text-center border-l border-border">
              <p className="text-xs text-muted-foreground uppercase">{day}</p>
              <p className="text-lg font-semibold text-foreground">{weekDates[i]}</p>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-[60px_repeat(7,1fr)] min-h-full">
            {/* Time Labels */}
            <div className="relative">
              {hours.map((hour) => (
                <div key={hour} className="h-16 border-b border-border relative">
                  <span className="absolute -top-2 left-2 text-xs text-muted-foreground">
                    {hour > 12 ? `${hour - 12}pm` : hour === 12 ? "12pm" : `${hour}am`}
                  </span>
                </div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((_, dayIndex) => (
              <div
                key={dayIndex}
                className={cn("relative border-l border-border", draggedTemplate && "bg-accent/20")}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDragEnd()}
              >
                {hours.map((hour) => (
                  <div key={hour} className="h-16 border-b border-border" />
                ))}

                {/* Shift Cards */}
                {getShiftsForDay(dayIndex).map((shift) => {
                  const top = (shift.startHour - 8) * 64
                  const height = shift.duration * 64

                  return (
                    <div
                      key={shift.id}
                      className={cn(
                        "absolute left-1 right-1 rounded-md px-2 py-1.5 overflow-hidden transition-all",
                        shift.status === "confirmed"
                          ? "bg-chart-1/20 border border-chart-1/40"
                          : "bg-chart-2/20 border border-chart-2/40 border-dashed",
                      )}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <p
                        className={cn(
                          "text-xs font-medium truncate",
                          shift.status === "confirmed" ? "text-chart-1" : "text-chart-2",
                        )}
                      >
                        {shift.status === "pending" && "Pending: "}
                        {shift.employee}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{shift.title}</p>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - Project Template Library */}
      <div className="w-72 flex flex-col border border-border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-medium text-foreground">Project Templates</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Drag to schedule</p>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-auto">
          {projectTemplates.map((template) => (
            <div
              key={template.id}
              draggable
              onDragStart={() => handleDragStart(template)}
              onDragEnd={handleDragEnd}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 cursor-grab active:cursor-grabbing transition-colors",
                draggedTemplate?.id === template.id && "opacity-50",
              )}
            >
              <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className={cn("w-2 h-8 rounded-full flex-shrink-0", template.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{template.name}</p>
                <p className="text-xs text-muted-foreground">{template.duration}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent gap-2"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* New Template Modal */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Project Template</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Define a reusable project template with steps and estimated duration.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Template Name */}
            <div className="space-y-2">
              <Label className="text-foreground">Template Name</Label>
              <Input
                placeholder="e.g. Deep Clean, Dog Walk"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Duration and Color Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  Estimated Duration
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    step="0.5"
                    placeholder="3"
                    value={newTemplate.hours}
                    onChange={(e) => setNewTemplate({ ...newTemplate, hours: e.target.value })}
                    className="bg-muted/50 border-border pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">hours</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Color Tag</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setNewTemplate({ ...newTemplate, color: color.value })}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        color.value,
                        newTemplate.color === color.value
                          ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                          : "opacity-60 hover:opacity-100",
                      )}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Steps Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground">Checklist Steps</Label>
                <span className="text-xs text-muted-foreground">{newTemplate.steps.filter((s) => s).length} steps</span>
              </div>
              <div className="space-y-2 max-h-48 overflow-auto">
                {newTemplate.steps.map((step, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-5 text-right">{index + 1}.</span>
                    <Input
                      placeholder={`Step ${index + 1} description`}
                      value={step}
                      onChange={(e) => updateStep(index, e.target.value)}
                      className="bg-muted/50 border-border flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => removeStep(index)}
                      disabled={newTemplate.steps.length === 1 && !step}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent" onClick={addStep}>
                <Plus className="w-4 h-4" />
                Add Step
              </Button>
            </div>

            {/* Preview */}
            {newTemplate.name && (
              <div className="border border-border rounded-lg p-3 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Preview</p>
                <div className="flex items-center gap-3">
                  <div className={cn("w-2 h-8 rounded-full", newTemplate.color)} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{newTemplate.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {newTemplate.hours ? `${newTemplate.hours}h` : "0h"} • {newTemplate.steps.filter((s) => s).length}{" "}
                      steps
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} disabled={!newTemplate.name || !newTemplate.hours}>
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
