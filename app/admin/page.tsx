"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { KpiCards } from "@/components/admin/kpi-cards"
import { WeeklySchedule } from "@/components/admin/weekly-schedule"
import { CommunicationHub } from "@/components/admin/communication-hub"
import { ProjectLibrary } from "@/components/admin/project-library"

import { MasterCalendar } from "@/components/admin/master-calendar"
import { StaffManagement } from "@/components/admin/staff-management"
import { FinancialIntelligence } from "@/components/admin/financial-intelligence"

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard")

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  })

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <AdminSidebar activeNav={activeNav} onNavChange={setActiveNav} />

      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border px-8 py-6">
          <p className="text-muted-foreground text-sm">{today}</p>
          <h1 className="text-2xl font-semibold text-foreground mt-1">
            {activeNav === "dashboard" && "Welcome back"}
            {activeNav === "library" && "Project Library"}
            {activeNav === "calendar" && "Calendar"}
            {activeNav === "staff" && "Staff"}
            {activeNav === "finances" && "Finances"}
          </h1>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 pb-16 space-y-8">
          {activeNav === "dashboard" && (
            <>
              <KpiCards />
              <WeeklySchedule />
              <CommunicationHub />
            </>
          )}
          {activeNav === "library" && <ProjectLibrary />}
          {activeNav === "calendar" && <MasterCalendar />}
          {activeNav === "staff" && <StaffManagement />}
          {activeNav === "finances" && <FinancialIntelligence />}
        </div>
      </main>
    </div>
  )
}
