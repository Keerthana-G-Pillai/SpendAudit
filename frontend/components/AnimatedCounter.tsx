'use client'

import { useEffect, useState } from 'react'

interface Props {
  target: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}

export default function AnimatedCounter({
  target,
  duration = 1500,
  prefix = '',
  suffix = '',
  className = '',
}: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (target === 0) return
    const startTime = performance.now()
    let raf: number

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic for a satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return (
    <span className={className}>
      {prefix}{current.toLocaleString()}{suffix}
    </span>
  )
}
