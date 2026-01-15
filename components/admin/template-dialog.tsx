"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTemplate, updateTemplate } from "@/app/admin/actions"

interface TemplateDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
    initialData?: {
        id: string
        name: string
        description: string
        estimated_duration?: number
    } | null
}

export function TemplateDialog({ open, onOpenChange, onSuccess, initialData }: TemplateDialogProps) {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [duration, setDuration] = useState("0")

    useEffect(() => {
        if (open) {
            if (initialData) {
                setName(initialData.name)
                setDescription(initialData.description || "")
                setDuration(initialData.estimated_duration?.toString() || "0")
            } else {
                setName("")
                setDescription("")
                setDuration("0")
            }
        }
    }, [open, initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (initialData) {
                await updateTemplate(initialData.id, name, description, parseInt(duration) || 0)
            } else {
                await createTemplate(name, description, parseInt(duration) || 0)
            }

            onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Error saving template:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{initialData ? "Edit Template" : "Create New Template"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Morning Setup"
                            required
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the process"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="duration">Estimated Duration (minutes)</Label>
                        <Input
                            id="duration"
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            min="0"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : (initialData ? "Save Changes" : "Create Template")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
