import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface PayrollEntry {
  id: string
  employee: string
  date: string
  timeIn: string
  timeOut: string
  durationMins: number
  guaranteeApplied: boolean
  guaranteeMinutes?: number
  totalPay: number
}

const payrollData: PayrollEntry[] = [
  {
    id: "1",
    employee: "Sarah Miller",
    date: "Oct 14",
    timeIn: "9:00 AM",
    timeOut: "12:35 PM",
    durationMins: 215,
    guaranteeApplied: false,
    totalPay: 89.58,
  },
  {
    id: "2",
    employee: "Mike Johnson",
    date: "Oct 14",
    timeIn: "1:00 PM",
    timeOut: "2:35 PM",
    durationMins: 95,
    guaranteeApplied: true,
    guaranteeMinutes: 25,
    totalPay: 50.0,
  },
  {
    id: "3",
    employee: "Sarah Miller",
    date: "Oct 15",
    timeIn: "10:00 AM",
    timeOut: "2:15 PM",
    durationMins: 255,
    guaranteeApplied: false,
    totalPay: 106.25,
  },
  {
    id: "4",
    employee: "Mike Johnson",
    date: "Oct 16",
    timeIn: "9:30 AM",
    timeOut: "11:10 AM",
    durationMins: 100,
    guaranteeApplied: true,
    guaranteeMinutes: 20,
    totalPay: 50.0,
  },
  {
    id: "5",
    employee: "Sarah Miller",
    date: "Oct 17",
    timeIn: "8:00 AM",
    timeOut: "12:00 PM",
    durationMins: 240,
    guaranteeApplied: false,
    totalPay: 100.0,
  },
  {
    id: "6",
    employee: "Mike Johnson",
    date: "Oct 18",
    timeIn: "2:00 PM",
    timeOut: "6:30 PM",
    durationMins: 270,
    guaranteeApplied: false,
    totalPay: 112.5,
  },
  {
    id: "7",
    employee: "Sarah Miller",
    date: "Oct 19",
    timeIn: "10:00 AM",
    timeOut: "11:45 AM",
    durationMins: 105,
    guaranteeApplied: true,
    guaranteeMinutes: 15,
    totalPay: 50.0,
  },
  {
    id: "8",
    employee: "Mike Johnson",
    date: "Oct 20",
    timeIn: "9:00 AM",
    timeOut: "1:00 PM",
    durationMins: 240,
    guaranteeApplied: false,
    totalPay: 100.0,
  },
]

export function PayrollTable() {
  const totalPay = payrollData.reduce((sum, entry) => sum + entry.totalPay, 0)

  return (
    <div className="space-y-4">
      <div className="border border-border rounded-xl overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground h-12">
                Employee
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Time In/Out
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Duration
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Min. Guarantee Applied
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-muted-foreground text-right">
                Total Pay
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payrollData.map((entry) => (
              <TableRow key={entry.id} className="border-border hover:bg-accent/30 transition-colors">
                <TableCell className="font-medium text-foreground">{entry.employee}</TableCell>
                <TableCell className="text-foreground/80">{entry.date}</TableCell>
                <TableCell className="text-foreground/80">
                  {entry.timeIn} – {entry.timeOut}
                </TableCell>
                <TableCell className="text-foreground/80 tabular-nums">{entry.durationMins} mins</TableCell>
                <TableCell>
                  {entry.guaranteeApplied ? (
                    <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 font-medium">
                      Yes (+{entry.guaranteeMinutes}m)
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground tabular-nums">
                  ${entry.totalPay.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="flex justify-end">
        <div className="border border-border rounded-xl bg-card px-6 py-4">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Period Total</p>
          <p className="text-3xl font-bold text-foreground mt-1 tabular-nums">${totalPay.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
