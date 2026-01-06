import { Button } from "@/components/ui/button"
import { PayrollTable } from "@/components/payroll/payroll-table"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default function PayrollPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground hover:text-foreground/80 transition-colors"
            >
              1077
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="text-lg font-medium text-foreground">Payroll Period: Oct 14 - Oct 20</h1>
          </div>
          <Button className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Sync to Gusto
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        <PayrollTable />
      </main>
    </div>
  )
}
