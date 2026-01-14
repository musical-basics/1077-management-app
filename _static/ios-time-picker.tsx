"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"

interface PickerColumnProps {
  values: number[]
  selectedValue: number
  onChange: (value: number) => void
  formatValue?: (value: number) => string
}

function PickerColumn({ values, selectedValue, onChange, formatValue }: PickerColumnProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemHeight = 56
  const visibleItems = 5
  const centerOffset = Math.floor(visibleItems / 2)

  const scrollToValue = useCallback(
    (value: number, smooth = true) => {
      const index = values.indexOf(value)
      if (index !== -1 && containerRef.current) {
        containerRef.current.scrollTo({
          top: index * itemHeight,
          behavior: smooth ? "smooth" : "auto",
        })
      }
    },
    [values, itemHeight],
  )

  useEffect(() => {
    scrollToValue(selectedValue, false)
  }, [])

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return
    const scrollTop = containerRef.current.scrollTop
    const index = Math.round(scrollTop / itemHeight)
    const clampedIndex = Math.max(0, Math.min(index, values.length - 1))
    if (values[clampedIndex] !== selectedValue) {
      onChange(values[clampedIndex])
    }
  }, [values, selectedValue, onChange, itemHeight])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let scrollTimeout: NodeJS.Timeout
    const debouncedScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        handleScroll()
        // Snap to nearest item
        if (container) {
          const scrollTop = container.scrollTop
          const index = Math.round(scrollTop / itemHeight)
          container.scrollTo({
            top: index * itemHeight,
            behavior: "smooth",
          })
        }
      }, 50)
    }

    container.addEventListener("scroll", debouncedScroll)
    return () => {
      container.removeEventListener("scroll", debouncedScroll)
      clearTimeout(scrollTimeout)
    }
  }, [handleScroll, itemHeight])

  return (
    <div className="relative h-[280px] flex-1">
      {/* Gradient overlays for fade effect */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-[#0f1115] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-[#0f1115] to-transparent" />

      {/* Center selection highlight */}
      <div className="pointer-events-none absolute inset-x-2 top-1/2 z-10 h-14 -translate-y-1/2 rounded-xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.08]" />

      {/* Scrollable column */}
      <div
        ref={containerRef}
        className="h-full overflow-y-scroll scrollbar-hide snap-y snap-mandatory"
        style={{
          scrollSnapType: "y mandatory",
          paddingTop: centerOffset * itemHeight,
          paddingBottom: centerOffset * itemHeight,
        }}
      >
        {values.map((value, index) => {
          const isSelected = value === selectedValue
          return (
            <div
              key={value}
              className="h-14 flex items-center justify-center snap-center cursor-pointer"
              style={{ scrollSnapAlign: "center" }}
              onClick={() => {
                onChange(value)
                scrollToValue(value)
              }}
            >
              <span
                className={cn(
                  "font-medium tabular-nums transition-all duration-200",
                  isSelected ? "text-3xl text-white font-semibold" : "text-xl text-muted-foreground/50",
                )}
                style={{
                  transform: isSelected ? "scale(1)" : "scale(0.85) perspective(100px) rotateX(15deg)",
                }}
              >
                {formatValue ? formatValue(value) : value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface IOSTimePickerProps {
  onChange?: (hours: number, minutes: number) => void
  minimumMinutes?: number
  className?: string
}

export function IOSTimePicker({
  onChange,
  minimumMinutes = 120, // 2 hours default
  className,
}: IOSTimePickerProps) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const hoursValues = Array.from({ length: 13 }, (_, i) => i) // 0-12
  const minutesValues = [0, 15, 30, 45]

  const totalMinutes = hours * 60 + minutes
  const isMinimumApplied = totalMinutes < minimumMinutes && totalMinutes > 0
  const payableMinutes = totalMinutes === 0 ? 0 : Math.max(totalMinutes, minimumMinutes)
  const payableHours = Math.floor(payableMinutes / 60)
  const payableMins = payableMinutes % 60

  useEffect(() => {
    onChange?.(hours, minutes)
  }, [hours, minutes, onChange])

  const formatHours = (h: number) => h.toString().padStart(2, "0")
  const formatMinutes = (m: number) => m.toString().padStart(2, "0")

  return (
    <div className={cn("w-full", className)}>
      {/* Picker Container */}
      <div className="rounded-2xl bg-[#0f1115] border border-border p-4">
        <div className="flex items-center gap-0">
          <PickerColumn values={hoursValues} selectedValue={hours} onChange={setHours} formatValue={formatHours} />

          {/* Separator */}
          <div className="flex flex-col items-center justify-center h-[280px] px-1">
            <span className="text-3xl font-semibold text-white">:</span>
          </div>

          <PickerColumn
            values={minutesValues}
            selectedValue={minutes}
            onChange={setMinutes}
            formatValue={formatMinutes}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-around mt-2 text-xs text-muted-foreground uppercase tracking-wider">
          <span>Hours</span>
          <span>Minutes</span>
        </div>
      </div>

      {/* Summary Display */}
      <div className="mt-6 space-y-3 px-1">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Total Logged</span>
          <span className="text-lg font-medium text-foreground tabular-nums">
            {hours} Hour{hours !== 1 ? "s" : ""} {minutes} Minute{minutes !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="h-px bg-border" />

        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Payable</span>
          <div className="text-right">
            <span
              className={cn(
                "text-lg font-semibold tabular-nums",
                isMinimumApplied ? "text-warning" : "text-foreground",
              )}
            >
              {payableHours} Hour{payableHours !== 1 ? "s" : ""}{" "}
              {payableMins > 0 ? `${payableMins} Minute${payableMins !== 1 ? "s" : ""}` : ""}
            </span>
            {isMinimumApplied && <p className="text-xs text-warning mt-0.5">Minimum Guarantee Applied</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
