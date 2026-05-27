'use client'

import { useEffect, useState } from 'react'

const STEPS = ['Analyzing stack', 'Building recommendations', 'Finalizing']

interface Props {
  active: boolean
}

export default function SubmitProgress({ active }: Props) {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    if (!active) {
      setStepIndex(0)
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setStepIndex(1), 700))
    timers.push(setTimeout(() => setStepIndex(2), 1500))
    return () => timers.forEach(clearTimeout)
  }, [active])

  if (!active) return null

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <div className="h-1 w-full bg-accent/50 rounded-sm overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-[11px] text-secondary">{STEPS[stepIndex]}…</p>
    </div>
  )
}
