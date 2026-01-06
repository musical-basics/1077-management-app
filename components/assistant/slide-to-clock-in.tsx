"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function SlideToClockIn() {
  const [isClockedIn, setIsClockedIn] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef<number | null>(null)

  const THUMB_SIZE = 56
  const THRESHOLD = 0.85

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isClockedIn) {
      startTimeRef.current = Date.now() - elapsedTime * 1000
      interval = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000))
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isClockedIn])

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleStart = (clientX: number) => {
    if (isClockedIn) return
    setIsDragging(true)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging || !trackRef.current || isClockedIn) return
    const rect = trackRef.current.getBoundingClientRect()
    const maxSlide = rect.width - THUMB_SIZE - 8
    const position = Math.max(0, Math.min(clientX - rect.left - THUMB_SIZE / 2 - 4, maxSlide))
    setSliderPosition(position)
  }

  const handleEnd = () => {
    if (!isDragging || !trackRef.current) return
    setIsDragging(false)
    const rect = trackRef.current.getBoundingClientRect()
    const maxSlide = rect.width - THUMB_SIZE - 8
    if (sliderPosition / maxSlide >= THRESHOLD) {
      setIsClockedIn(true)
      setSliderPosition(maxSlide)
    } else {
      setSliderPosition(0)
    }
  }

  const handleClockOut = () => {
    setIsClockedIn(false)
    setSliderPosition(0)
    setElapsedTime(0)
    startTimeRef.current = null
  }

  return (
    <div className="space-y-4">
      {isClockedIn && (
        <div className="text-center">
          <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Time Elapsed</p>
          <p className="text-3xl font-mono font-semibold text-success tabular-nums">{formatTime(elapsedTime)}</p>
        </div>
      )}

      <div
        ref={trackRef}
        className={cn(
          "relative h-16 rounded-full p-1 transition-colors duration-300",
          isClockedIn ? "bg-success/20 cursor-pointer" : "bg-gradient-to-r from-muted to-accent",
        )}
        onClick={isClockedIn ? handleClockOut : undefined}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
      >
        {/* Track Label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className={cn(
              "text-sm font-medium uppercase tracking-wider transition-opacity duration-200",
              isDragging ? "opacity-0" : "opacity-100",
              isClockedIn ? "text-success" : "text-muted-foreground",
            )}
          >
            {isClockedIn ? "Tap to Clock Out" : "Slide to Clock In"}
          </span>
        </div>

        {/* Thumb */}
        <div
          className={cn(
            "absolute top-1 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300 select-none",
            isClockedIn ? "bg-success" : "bg-foreground",
          )}
          style={{ left: sliderPosition + 4 }}
        >
          {isClockedIn ? (
            <Check className="w-6 h-6 text-success-foreground" />
          ) : (
            <ArrowRight className="w-6 h-6 text-background" />
          )}
        </div>
      </div>
    </div>
  )
}
