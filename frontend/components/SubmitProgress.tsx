'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  'Analysing your stack...',
  'Generating recommendations...',
  'Done.',
]

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
    timers.push(setTimeout(() => setStepIndex(1), 800))
    timers.push(setTimeout(() => setStepIndex(2), 1800))

    return () => timers.forEach(clearTimeout)
  }, [active])

  if (!active) return null

  const progress = ((stepIndex + 1) / STEPS.length) * 100

  return (
    <div className="space-y-3 py-4" role="status" aria-live="polite">
      {/* Progress bar */}
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between text-xs text-muted-foreground">
        {STEPS.map((step, i) => (
          <span
            key={step}
            className={`transition-colors duration-300 ${
              i <= stepIndex ? 'text-foreground font-medium' : 'text-muted-foreground'
            }`}
          >
            {i < stepIndex ? '✓ ' : ''}{step}
          </span>
        ))}
      </div>
    </div>
  )
}
