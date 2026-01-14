"use client"

import { useState } from "react"
import { Paperclip, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { cn } from "@/lib/utils"

const laborCostData = [
  { day: "1", cost: 420 },
  { day: "2", cost: 380 },
  { day: "3", cost: 510 },
  { day: "4", cost: 450 },
  { day: "5", cost: 320 },
  { day: "6", cost: 280 },
  { day: "7", cost: 190 },
  { day: "8", cost: 440 },
  { day: "9", cost: 480 },
  { day: "10", cost: 520 },
  { day: "11", cost: 390 },
  { day: "12", cost: 410 },
  { day: "13", cost: 350 },
  { day: "14", cost: 220 },
  { day: "15", cost: 460 },
  { day: "16", cost: 490 },
  { day: "17", cost: 530 },
  { day: "18", cost: 470 },
  { day: "19", cost: 380 },
  { day: "20", cost: 290 },
  { day: "21", cost: 180 },
  { day: "22", cost: 420 },
  { day: "23", cost: 510 },
  { day: "24", cost: 480 },
  { day: "25", cost: 440 },
  { day: "26", cost: 390 },
  { day: "27", cost: 310 },
  { day: "28", cost: 200 },
  { day: "29", cost: 450 },
  { day: "30", cost: 520 },
]

const costByTypeData = [
  { name: "Cleaning", value: 60, color: "oklch(0.7 0.15 145)" },
  { name: "Errands", value: 30, color: "oklch(0.75 0.15 85)" },
  { name: "Admin", value: 10, color: "oklch(0.6 0.1 250)" },
]

interface Expense {
  id: string
  date: string
  employee: string
  description: string
  amount: number
  hasAttachment: boolean
  status: "pending" | "approved" | "rejected"
}

const expensesData: Expense[] = [
  {
    id: "1",
    date: "Jan 5",
    employee: "Mike Rodriguez",
    description: "Whole Foods - Groceries for Unit A",
    amount: 127.45,
    hasAttachment: true,
    status: "pending",
  },
  {
    id: "2",
    date: "Jan 4",
    employee: "Sarah Mitchell",
    description: "Target - Cleaning Supplies",
    amount: 45.99,
    hasAttachment: true,
    status: "pending",
  },
  {
    id: "3",
    date: "Jan 4",
    employee: "Emma Chen",
    description: "Costco - Bulk Paper Products",
    amount: 89.0,
    hasAttachment: true,
    status: "approved",
  },
  {
    id: "4",
    date: "Jan 3",
    employee: "Mike Rodriguez",
    description: "Petco - Dog Food & Treats",
    amount: 62.3,
    hasAttachment: false,
    status: "pending",
  },
  {
    id: "5",
    date: "Jan 2",
    employee: "James Wilson",
    description: "Home Depot - Pool Chemicals",
    amount: 156.78,
    hasAttachment: true,
    status: "approved",
  },
]

export function FinancialIntelligence() {
  const [expenses, setExpenses] = useState(expensesData)

  const handleApprove = (id: string) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, status: "approved" as const } : e)))
  }

  const handleReject = (id: string) => {
    setExpenses(expenses.map((e) => (e.id === id ? { ...e, status: "rejected" as const } : e)))
  }

  const totalLaborCost = laborCostData.reduce((sum, d) => sum + d.cost, 0)

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Labor Cost Trend */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Labor Cost Trend</h3>
              <p className="text-sm text-muted-foreground">Last 30 days</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-foreground">${totalLaborCost.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total spent</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={laborCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.005 250)" vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke="oklch(0.6 0 0)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  stroke="oklch(0.6 0 0)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0.005 250)",
                    border: "1px solid oklch(0.25 0.005 250)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                  formatter={(value: number) => [`$${value}`, "Cost"]}
                />
                <Bar dataKey="cost" fill="oklch(0.7 0.15 145)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by Project Type */}
        <div className="border border-border rounded-lg p-6 bg-card">
          <div className="mb-6">
            <h3 className="font-semibold text-foreground">Cost by Project Type</h3>
            <p className="text-sm text-muted-foreground">Distribution breakdown</p>
          </div>
          <div className="flex items-center gap-8">
            <div className="h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={costByTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {costByTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.005 250)",
                      border: "1px solid oklch(0.25 0.005 250)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    formatter={(value: number) => [`${value}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-3">
              {costByTypeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reimbursements & Expenses */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="font-semibold text-foreground">Reimbursements & Expenses</h3>
          <p className="text-sm text-muted-foreground">Review and approve receipts</p>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </th>
              <th className="text-right px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Amount
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Receipt
              </th>
              <th className="text-center px-6 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-muted-foreground">{expense.date}</td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">{expense.employee}</td>
                <td className="px-6 py-4 text-sm text-foreground">{expense.description}</td>
                <td className="px-6 py-4 text-sm text-foreground font-mono text-right">${expense.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  {expense.hasAttachment ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {expense.status === "pending" ? (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-chart-1 hover:text-chart-1 hover:bg-chart-1/20"
                          onClick={() => handleApprove(expense.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20"
                          onClick={() => handleReject(expense.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className={cn(
                          expense.status === "approved"
                            ? "bg-chart-1/20 text-chart-1 border-chart-1/30"
                            : "bg-destructive/20 text-destructive border-destructive/30",
                        )}
                      >
                        {expense.status === "approved" ? "Approved" : "Rejected"}
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
