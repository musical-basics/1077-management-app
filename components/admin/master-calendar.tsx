"use client"

import { useState, useEffect } from "react"
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
// Import Server Actions
import { getTemplates, createTemplate, getShifts, createShift } from "@/app/admin/actions"

// --- Types tailored to Supabase Data ---
interface ProjectTemplate {
  id: string
  name: string
  description?: string
  estimated_duration?: number // in minutes
  // Helper for UI color logic - we can cycle based on ID or index
}

interface ShiftDisplay {
  id: string
  title: string
  employee: string
  start: Date
  end: Date
  dayIndex: number // 0 = Mon, 6 = Sun
  startHour: number // decimal 9.5 etc
  duration: number // hours
  status: string
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const hours = Array.from({ length: 13 }, (_, i) => i + 8) // 8am to 8pm

export function MasterCalendar() {
  const [currentWeek, setCurrentWeek] = useState(new Date())

  // Real Data State
  const [templates, setTemplates] = useState<ProjectTemplate[]>([])
  const [shifts, setShifts] = useState<ShiftDisplay[]>([])
  const [loading, setLoading] = useState(true)

  // Drag State
  const [draggedTemplate, setDraggedTemplate] = useState<ProjectTemplate | null>(null)

  // Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    hours: "",
    description: "",
  })

  // --- Initial Data Fetching ---
  const fetchData = async () => {
    setLoading(true)
    try {
      // 1. Fetch Templates
      const templatesData = await getTemplates()
      setTemplates(templatesData)

      // 2. Fetch Shifts for current week
      const weekDates = getWeekDates()
      const startOfWeek = new Date(currentWeek) // Cloned in getWeekDates logic actually
      // Let's calculate proper bounds
      const start = getStartOfWeek(currentWeek)
      const end = new Date(start)
      end.setDate(end.getDate() + 7)

      const shiftsData = await getShifts(start, end)

      // Transform DB shifts to UI Shifts
      const mappedShifts: ShiftDisplay[] = shiftsData.map((s: any) => {
        const startTime = new Date(s.start_time)
        const endTime = new Date(s.end_time_expected)
        // Calculate day index (0-6, Mon-Sun)
        let dayIndex = startTime.getDay() - 1
        if (dayIndex < 0) dayIndex = 6 // Sunday fix

        // Calculate duration in hours
        const durationHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

        // Start hour (decimal)
        const startHour = startTime.getHours() + (startTime.getMinutes() / 60)

        return {
          id: s.id,
          title: s.project?.name || "Unknown Project",
          employee: s.user?.full_name || "Unassigned",
          start: startTime,
          end: endTime,
          dayIndex,
          startHour,
          duration: durationHours,
          status: s.status
        }
      })
      setShifts(mappedShifts)

    } catch (e) {
      console.error("Error loading calendar data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [currentWeek])


  // --- Helper Functions ---
  const getStartOfWeek = (date: Date) => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setHours(0, 0, 0, 0)
    start.setDate(diff)
    return start
  }

  const getWeekDates = () => {
    const start = getStartOfWeek(currentWeek)
    return days.map((_, i) => {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      return date.getDate()
    })
  }

  const weekDates = getWeekDates()

  const getShiftsForDay = (dayIndex: number) => {
    return shifts.filter((shift) => shift.dayIndex === dayIndex)
  }

  // --- Drag & Drop Handlers ---
  const handleDragStart = (template: ProjectTemplate) => {
    setDraggedTemplate(template)
  }

  const handleDragEnd = () => {
    setDraggedTemplate(null)
  }

  const handleDrop = async (dayIndex: number, hour: number) => {
    if (!draggedTemplate) return

    // 1. Calculate Start Time
    const startOfWeek = getStartOfWeek(currentWeek)
    const targetDate = new Date(startOfWeek)
    targetDate.setDate(targetDate.getDate() + dayIndex)
    targetDate.setHours(hour, 0, 0, 0)

    // 2. Calculate End Time
    const durationMinutes = draggedTemplate.estimated_duration || 60
    const endDate = new Date(targetDate.getTime() + durationMinutes * 60000)

    try {
      await createShift({
        project_template_id: draggedTemplate.id,
        start_time: targetDate,
        end_time_expected: endDate,
        status: 'draft' // Default to draft/pending
      })
      // Optimized refresh
      fetchData()
    } catch (error) {
      console.error("Failed to drop shift", error)
    } finally {
      setDraggedTemplate(null)
    }
  }

  // --- Create Template Modal Handlers ---
  const handleCreateTemplate = async () => {
    try {
      await createTemplate(newTemplate.name, newTemplate.description, parseFloat(newTemplate.hours) * 60)
      setIsTemplateModalOpen(false)
      fetchData() // Refresh list
      setNewTemplate({ name: "", hours: "", description: "" })
    } catch (e) {
      console.error(e)
    }
  }

  // Quick Color Helper
  const getTemplateColor = (index: number) => {
    const colors = ["bg-chart-1", "bg-chart-2", "bg-chart-3", "bg-chart-4", "bg-chart-5"]
    return colors[index % colors.length]
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] min-h-[600px]">
      {/* Left Column - Calendar Grid */}
      <div className="flex-1 min-w-0 flex flex-col border border-border rounded-lg overflow-hidden select-none">

        {/* Calendar Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              const next = new Date(currentWeek); next.setDate(next.getDate() - 7); setCurrentWeek(next)
            }}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-medium text-foreground">
              {currentWeek.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => {
              const next = new Date(currentWeek); next.setDate(next.getDate() + 7); setCurrentWeek(next)
            }}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentWeek(new Date())}>
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
                className={cn("relative border-l border-border", draggedTemplate && "bg-accent/10")}
              >
                {/* Hour Slots - Drop Targets */}
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-16 border-b border-border transition-colors hover:bg-muted/20"
                    onDragOver={(e) => {
                      e.preventDefault()
                      e.dataTransfer.dropEffect = "copy"
                    }}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleDrop(dayIndex, hour) // Pass specific hour
                    }}
                  />
                ))}

                {/* Shift Cards */}
                {getShiftsForDay(dayIndex).map((shift) => {
                  const top = (shift.startHour - 8) * 64
                  const height = shift.duration * 64

                  return (
                    <div
                      key={shift.id}
                      className={cn(
                        "absolute left-1 right-1 rounded-md px-2 py-1.5 overflow-hidden transition-all border",
                        "bg-primary/10 border-primary/20 hover:bg-primary/20"
                      )}
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <p className="text-xs font-medium truncate text-foreground">
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

      {/* Right Column - Project Template Library (Sidebar) */}
      <div className="w-72 flex flex-col border border-border rounded-lg overflow-hidden bg-card">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="font-medium text-foreground">Project Templates</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Drag to schedule</p>
        </div>

        <div className="flex-1 p-3 space-y-2 overflow-auto">
          {loading ? (
            <div className="text-center text-xs text-muted-foreground py-4">Loading...</div>
          ) : templates.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-4">No templates found.</div>
          ) : (
            templates.map((template, index) => (
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
                {/* Color strip */}
                <div className={cn("w-2 h-8 rounded-full flex-shrink-0", getTemplateColor(index))} />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{template.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {template.estimated_duration ? (
                      template.estimated_duration >= 60
                        ? `${Math.floor(template.estimated_duration / 60)}h ${template.estimated_duration % 60}m`
                        : `${template.estimated_duration}m`
                    ) : '0m'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent gap-2"
            onClick={() => setIsTemplateModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Quick Template
          </Button>
        </div>
      </div>

      {/* New Template Modal (Quick Add) */}
      <Dialog open={isTemplateModalOpen} onOpenChange={setIsTemplateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Quick Create Template</DialogTitle>
            <DialogDescription>
              Add a basic template. For more options use the Project Library.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g. Lawn Mowing"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={newTemplate.description}
                onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                placeholder="Optional description"
              />
            </div>
            <div className="space-y-2">
              <Label>Est. Hours</Label>
              <Input
                type="number"
                value={newTemplate.hours}
                onChange={(e) => setNewTemplate({ ...newTemplate, hours: e.target.value })}
                step="0.5"
                placeholder="2.5"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateTemplate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
