'use client'

import React from 'react'
import ToolIcon from './ToolIcon'
import type { ToolName } from '@/lib/types'

interface BadgeConfig {
  id: string
  tool: ToolName
  top: string
  left: string
  duration: string
  delay: string
  shadowColor: string
}

const BADGES: BadgeConfig[] = [
  { id: 'chatgpt', tool: 'chatgpt', top: '12%', left: '8%', duration: '5s', delay: '0s', shadowColor: 'shadow-emerald-500/20' },
  { id: 'claude', tool: 'claude', top: '65%', left: '5%', duration: '6.5s', delay: '1.2s', shadowColor: 'shadow-orange-500/20' },
  { id: 'notion', tool: 'notion', top: '82%', left: '25%', duration: '7s', delay: '0.5s', shadowColor: 'shadow-zinc-400/20' },
  { id: 'figma', tool: 'figma', top: '35%', left: '22%', duration: '5.5s', delay: '0.8s', shadowColor: 'shadow-pink-500/20' },
  { id: 'cursor', tool: 'cursor', top: '35%', left: '85%', duration: '6s', delay: '1.5s', shadowColor: 'shadow-blue-500/20' },
  { id: 'gemini', tool: 'gemini', top: '75%', left: '78%', duration: '7.5s', delay: '2.1s', shadowColor: 'shadow-indigo-500/20' },
  { id: 'github-copilot', tool: 'github-copilot', top: '18%', left: '75%', duration: '6.2s', delay: '0.3s', shadowColor: 'shadow-slate-500/20' },
  { id: 'windsurf', tool: 'windsurf', top: '85%', left: '12%', duration: '5.8s', delay: '1.8s', shadowColor: 'shadow-cyan-500/20' },
  { id: 'anthropic-api', tool: 'anthropic-api', top: '48%', left: '10%', duration: '7.2s', delay: '0.9s', shadowColor: 'shadow-orange-500/20' },
  { id: 'openai-api', tool: 'openai-api', top: '58%', left: '88%', duration: '6.8s', delay: '1.1s', shadowColor: 'shadow-emerald-500/20' },
]

export default function FloatingHeroBadges() {
  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block overflow-hidden z-0">
      {BADGES.map((badge) => (
        <div
          key={badge.id}
          className="absolute animate-float"
          style={{
            top: badge.top,
            left: badge.left,
            animationDuration: badge.duration,
            animationDelay: badge.delay,
          }}
        >
          <div
            className={`
              pointer-events-auto flex items-center justify-center p-1
              backdrop-blur-md bg-white/10 border border-white/20 rounded-[12px]
              shadow-xl ${badge.shadowColor}
              transition-all duration-300 ease-out
              hover:scale-110 hover:border-white/40 cursor-default
            `}
          >
            <ToolIcon tool={badge.tool} size="md" />
          </div>
        </div>
      ))}
    </div>
  )
}
