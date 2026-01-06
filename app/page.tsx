import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, Monitor, FileSpreadsheet } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">1077</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Premium Property Management Platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Link href="/assistant" className="block group">
            <Card className="h-full border border-border bg-card hover:bg-accent/50 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-xl font-semibold">Assistant PWA</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Mobile-first time tracking, task management, and shift briefings for field staff.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin" className="block group">
            <Card className="h-full border border-border bg-card hover:bg-accent/50 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-chart-3/10 flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle className="text-xl font-semibold">Command Center</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Executive dashboard with KPIs, scheduling, and AI-powered staff management.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link href="/payroll" className="block group">
            <Card className="h-full border border-border bg-card hover:bg-accent/50 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-6 h-6 text-warning" />
                </div>
                <CardTitle className="text-xl font-semibold">Payroll Ledger</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Financial clarity with time tracking, minimum guarantees, and Gusto integration.
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
