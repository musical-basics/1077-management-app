import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface Shift {
  id: string
  status: "confirmed" | "pending" | "open"
  label: string
  time?: string
}

interface DaySchedule {
  day: string
  date: number
  shifts: Shift[]
  isToday?: boolean
}

const weekSchedule: DaySchedule[] = [
  {
    day: "Mon",
    date: 21,
    shifts: [{ id: "1", status: "confirmed", label: "Sarah", time: "9am-1pm" }],
  },
  {
    day: "Tue",
    date: 22,
    shifts: [{ id: "2", status: "confirmed", label: "Mike", time: "10am-2pm" }],
  },
  {
    day: "Wed",
    date: 23,
    shifts: [{ id: "3", status: "open", label: "Open Shift" }],
  },
  {
    day: "Thu",
    date: 24,
    isToday: true,
    shifts: [
      { id: "4", status: "confirmed", label: "Sarah", time: "9am-1pm" },
      { id: "5", status: "confirmed", label: "Mike", time: "1pm-5pm" },
    ],
  },
  {
    day: "Fri",
    date: 25,
    shifts: [{ id: "6", status: "pending", label: "Mike", time: "TBD" }],
  },
  {
    day: "Sat",
    date: 26,
    shifts: [{ id: "7", status: "confirmed", label: "Sarah", time: "10am-4pm" }],
  },
  {
    day: "Sun",
    date: 27,
    shifts: [],
  },
]

const statusStyles = {
  confirmed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  open: "bg-muted text-muted-foreground border-border",
}

export function WeeklySchedule() {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Weekly Schedule</h2>

      <div className="grid grid-cols-7 gap-3">
        {weekSchedule.map((day) => (
          <div
            key={day.day}
            className={cn(
              "rounded-xl border border-border p-4 min-h-[140px]",
              day.isToday ? "bg-accent/50 border-foreground/20" : "bg-card",
            )}
          >
            <div className="text-center mb-3">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{day.day}</p>
              <p className={cn("text-lg font-semibold mt-0.5", day.isToday ? "text-foreground" : "text-foreground/80")}>
                {day.date}
              </p>
            </div>

            <div className="space-y-2">
              {day.shifts.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center">No shifts</p>
              ) : (
                day.shifts.map((shift) => (
                  <Badge
                    key={shift.id}
                    variant="outline"
                    className={cn("w-full justify-center text-xs py-1.5 font-medium", statusStyles[shift.status])}
                  >
                    {shift.status === "confirmed" && "✓ "}
                    {shift.label}
                    {shift.time && ` (${shift.time})`}
                  </Badge>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
