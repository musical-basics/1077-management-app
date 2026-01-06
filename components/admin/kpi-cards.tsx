"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

export function KpiCards() {
  const [laborCost, setLaborCost] = useState(145.2)

  useEffect(() => {
    const interval = setInterval(() => {
      setLaborCost((prev) => prev + 0.01 + Math.random() * 0.02)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Staff Status */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Active Staff
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-4xl font-bold text-foreground">2/3</p>
          <p className="text-sm text-muted-foreground mt-1">Sarah, Mike clocked in</p>
        </CardContent>
      </Card>

      {/* Real-time Spend */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Today's Labor Cost
            <span className="flex items-center gap-1 text-live">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-xs font-normal">Live</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-4xl font-bold text-foreground tabular-nums">${laborCost.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground mt-1">Updated per minute</p>
        </CardContent>
      </Card>

      {/* Next Up */}
      <Card className="border border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Upcoming Event
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xl font-semibold text-foreground">Unit A Check-in</p>
          <p className="text-sm text-muted-foreground mt-1">4:00 PM today</p>
        </CardContent>
      </Card>
    </div>
  )
}
