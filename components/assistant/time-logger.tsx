"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { submitTimeLog } from "@/app/actions/time-logging"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { IOSTimePicker } from "@/components/ui/ios-time-picker"

export function TimeLogger() {
    const [hours, setHours] = React.useState(0)
    const [minutes, setMinutes] = React.useState(0)
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [showConfirm, setShowConfirm] = React.useState(false)

    const totalMinutes = hours * 60 + minutes
    const isZero = totalMinutes === 0
    const isOverEightHours = hours >= 8

    const handleTimeChange = (h: number, m: number) => {
        setHours(h)
        setMinutes(m)
    }

    const handleSubmitClick = () => {
        if (isOverEightHours) {
            setShowConfirm(true)
        } else {
            doSubmit()
        }
    }

    const [resetCount, setResetCount] = React.useState(0)

    const doSubmit = async () => {
        setIsSubmitting(true)
        try {
            await submitTimeLog(hours, minutes)
            // Reset after success
            setHours(0)
            setMinutes(0)
            setResetCount(prev => prev + 1)
        } catch (error) {
            console.error("Failed to submit time log", error)
        } finally {
            setIsSubmitting(false)
            setShowConfirm(false)
        }
    }

    return (
        <>
            <Card className="w-full max-w-md mx-auto bg-transparent border-0 shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="sr-only">Log Today's Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 px-0">
                    {/* iOS Time Picker */}
                    <IOSTimePicker
                        key={resetCount}
                        onChange={handleTimeChange}
                        minimumMinutes={120}
                    />

                    <Button
                        className="w-full h-14 text-lg rounded-2xl font-semibold"
                        onClick={handleSubmitClick}
                        disabled={isZero || isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Time Log"}
                    </Button>
                </CardContent>
            </Card>

            {/* Manual Confirmation Dialog */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in-0">
                    <Card className="w-full max-w-sm m-4 shadow-xl scale-100 animate-in zoom-in-95 bg-[#1c1c1e] border-white/10">
                        <CardHeader>
                            <CardTitle className="text-white">Whoa, 8+ hours!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-400 mb-6">
                                You are logging {hours} hours and {minutes} minutes for today. Is that correct?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button variant="ghost" onClick={() => setShowConfirm(false)} className="text-zinc-400 hover:text-white hover:bg-white/10">
                                    Cancel
                                </Button>
                                <Button onClick={doSubmit} className="bg-white text-black hover:bg-zinc-200">
                                    Yes, Submit
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    )
}
