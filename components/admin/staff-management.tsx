"use client"

import { useState, useEffect } from "react"
import { Plus, MoreHorizontal, Phone, Mail, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Import Server Actions
import { getStaff, createStaff, updateStaff } from "@/app/admin/actions"

// Extended type for UI
interface StaffMember {
  id: string
  full_name: string
  phone: string
  email: string
  avatar_url?: string
  role: string
  hourly_rate_cents: number
  min_guarantee_minutes: number
  // Derived or View fields
  onTimeRate?: number
  // Status is not yet in DB, we mock online/offline based on something or just random for now?
  // Let's assume 'offline' as default since no real presence system yet.
}

const roleColors: Record<string, string> = {
  "Cleaner": "bg-chart-1/20 text-chart-1 border-chart-1/30",
  "Personal Assistant": "bg-chart-3/20 text-chart-3 border-chart-3/30",
  "Dog Walker": "bg-chart-2/20 text-chart-2 border-chart-2/30",
  "Team Lead": "bg-chart-5/20 text-chart-5 border-chart-5/30",
  "admin": "bg-primary/20 text-primary border-primary/30",
  "assistant": "bg-secondary/20 text-secondary border-secondary/30",
}

export function StaffManagement() {
  const [data, setData] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  // Edit State
  const [editedStaff, setEditedStaff] = useState<{
    name: string,
    phone: string,
    email: string,
    role: string,
    rate: number, // display dollars
    minGuaranteedMinutes: number
  } | null>(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newAssistant, setNewAssistant] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    rate: "",
    minGuaranteedMinutes: "",
  })

  // Fetch Data
  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await getStaff()
      // Supabase returns keys matching DB columns: full_name, hourly_rate_cents etc.
      // Typescript might complain if we don't cast or map.
      // The action returns `merged` array.
      setData(result as unknown as StaffMember[])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRowClick = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setEditedStaff({
      name: staff.full_name,
      phone: staff.phone,
      email: staff.email,
      role: staff.role,
      rate: staff.hourly_rate_cents / 100,
      minGuaranteedMinutes: staff.min_guarantee_minutes
    })
  }

  const handleCloseSheet = () => {
    setSelectedStaff(null)
    setEditedStaff(null)
  }

  const handleSaveEdit = async () => {
    if (!selectedStaff || !editedStaff) return
    try {
      await updateStaff(selectedStaff.id, {
        name: editedStaff.name,
        phone: editedStaff.phone,
        email: editedStaff.email,
        role: editedStaff.role,
        rate: editedStaff.rate,
        minGuaranteedMinutes: editedStaff.minGuaranteedMinutes
      })
      fetchData()
      handleCloseSheet()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateAssistant = async () => {
    try {
      await createStaff({
        name: newAssistant.name,
        phone: newAssistant.phone,
        email: newAssistant.email,
        role: newAssistant.role,
        rate: parseFloat(newAssistant.rate),
        minGuaranteedMinutes: parseInt(newAssistant.minGuaranteedMinutes) || 120
      })

      setIsAddModalOpen(false)
      fetchData() // Refresh
      // Reset
      setNewAssistant({
        name: "",
        phone: "",
        email: "",
        role: "",
        rate: "",
        minGuaranteedMinutes: "",
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Team Roster</h2>
        <Button size="sm" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4" />
          Add New Assistant
        </Button>
      </div>

      {/* Data Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Employee
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rate
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Status
              </th>
              <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">Loading roster...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-sm text-muted-foreground">No team members found. Add one to get started.</td></tr>
            ) : (
              data.map((staff) => (
                <tr
                  key={staff.id}
                  onClick={() => handleRowClick(staff)}
                  className="border-b border-border last:border-b-0 hover:bg-muted/20 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border border-border">
                        <AvatarImage src={staff.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                          {(staff.full_name || "?")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{staff.full_name}</p>
                        <p className="text-xs text-muted-foreground">{staff.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant="outline" className={cn("font-medium", roleColors[staff.role] || "bg-muted text-muted-foreground")}>
                      {staff.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-foreground font-mono">${(staff.hourly_rate_cents / 100).toFixed(2)}/hr</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          /* Mock Status */
                          "bg-muted-foreground"
                        )}
                      />
                      <span className="text-sm text-muted-foreground capitalize">Offline</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRowClick(staff)}>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedStaff} onOpenChange={handleCloseSheet}>
        <SheetContent className="w-[400px] sm:w-[540px] bg-card border-border">
          <SheetHeader className="border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-foreground">Employee Details</SheetTitle>
            </div>
          </SheetHeader>

          {editedStaff && selectedStaff && (
            <div className="py-6 space-y-6">
              {/* Profile Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Profile</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-16 h-16 border border-border">
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                      {(editedStaff.name || "?")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{editedStaff.name}</p>
                    <Badge variant="outline" className={cn("font-medium mt-1", roleColors[editedStaff.role] || "bg-muted")}>
                      {editedStaff.role}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Name</Label>
                    <Input
                      value={editedStaff.name}
                      onChange={(e) => setEditedStaff({ ...editedStaff, name: e.target.value })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone (Twilio)
                    </Label>
                    <Input
                      value={editedStaff.phone}
                      onChange={(e) => setEditedStaff({ ...editedStaff, phone: e.target.value })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email
                    </Label>
                    <Input
                      value={editedStaff.email}
                      onChange={(e) => setEditedStaff({ ...editedStaff, email: e.target.value })}
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Compensation Section */}
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Compensation</h3>
                <div className="bg-muted/30 rounded-lg border border-border p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Hourly Rate</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={editedStaff.rate}
                        onChange={(e) =>
                          setEditedStaff({ ...editedStaff, rate: Number.parseFloat(e.target.value) || 0 })
                        }
                        className="bg-muted/50 border-border pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Minimum Guaranteed Minutes</Label>
                    <Input
                      type="number"
                      value={editedStaff.minGuaranteedMinutes}
                      onChange={(e) =>
                        setEditedStaff({ ...editedStaff, minGuaranteedMinutes: Number.parseInt(e.target.value) || 0 })
                      }
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Performance Section */}
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Performance</h3>
                <div className="bg-muted/30 rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">On-Time Arrival Rate</span>
                    <span className="text-2xl font-semibold text-foreground">{selectedStaff.onTimeRate || 0}%</span>
                  </div>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-live rounded-full transition-all"
                      style={{ width: `${selectedStaff.onTimeRate || 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={handleSaveEdit}>Save Changes</Button>
                <Button variant="outline" onClick={handleCloseSheet}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* New Assistant Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Add New Assistant</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the details for the new team member. They will receive an SMS invitation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 py-4">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 border-dashed border-border">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {newAssistant.name
                    ? newAssistant.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Upload className="w-4 h-4" />
                Upload Photo
              </Button>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-foreground">Full Name</Label>
              <Input
                placeholder="e.g. Sarah Mitchell"
                value={newAssistant.name}
                onChange={(e) => setNewAssistant({ ...newAssistant, name: e.target.value })}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Phone className="w-3 h-3 text-muted-foreground" />
                Phone Number
              </Label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={newAssistant.phone}
                onChange={(e) => setNewAssistant({ ...newAssistant, phone: e.target.value })}
                className="bg-muted/50 border-border"
              />
              <p className="text-xs text-muted-foreground">Used for Twilio SMS communication</p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Mail className="w-3 h-3 text-muted-foreground" />
                Email Address
              </Label>
              <Input
                type="email"
                placeholder="sarah@1077.com"
                value={newAssistant.email}
                onChange={(e) => setNewAssistant({ ...newAssistant, email: e.target.value })}
                className="bg-muted/50 border-border"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label className="text-foreground">Role</Label>
              <Select
                value={newAssistant.role}
                onValueChange={(value) => setNewAssistant({ ...newAssistant, role: value })}
              >
                <SelectTrigger className="bg-muted/50 border-border">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cleaner">Cleaner</SelectItem>
                  <SelectItem value="Personal Assistant">Personal Assistant</SelectItem>
                  <SelectItem value="Dog Walker">Dog Walker</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Compensation Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Hourly Rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    type="number"
                    placeholder="25.00"
                    value={newAssistant.rate}
                    onChange={(e) => setNewAssistant({ ...newAssistant, rate: e.target.value })}
                    className="bg-muted/50 border-border pl-7"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Min. Guaranteed</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="120"
                    value={newAssistant.minGuaranteedMinutes}
                    onChange={(e) => setNewAssistant({ ...newAssistant, minGuaranteedMinutes: e.target.value })}
                    className="bg-muted/50 border-border pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">min</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAssistant}
              disabled={!newAssistant.name || !newAssistant.phone || !newAssistant.role}
            >
              Create & Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
