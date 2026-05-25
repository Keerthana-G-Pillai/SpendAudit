'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Check,
  Plus,
  Minus,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SubmitProgress from './SubmitProgress'
import ToolIcon from './ToolIcon'
import type { ToolName, UseCase } from '@backend/lib/types'

interface ToolCfg {
  id: ToolName
  label: string
  initials: string
  domain: string
}

const ALL_TOOLS: ToolCfg[] = [
  { id: 'cursor', label: 'Cursor', initials: 'Cu', domain: 'cursor.com' },
  { id: 'chatgpt', label: 'ChatGPT', initials: 'GP', domain: 'openai.com' },
  { id: 'claude', label: 'Claude', initials: 'Cl', domain: 'anthropic.com' },
  { id: 'gemini', label: 'Gemini', initials: 'Ge', domain: 'google.com' },
  { id: 'github-copilot', label: 'Copilot', initials: 'CP', domain: 'github.com' },
  { id: 'windsurf', label: 'Windsurf', initials: 'Ws', domain: 'codeium.com' },
  { id: 'anthropic-api', label: 'Anthropic API', initials: 'An', domain: 'anthropic.com' },
  { id: 'openai-api', label: 'OpenAI API', initials: 'OA', domain: 'openai.com' },
  { id: 'figma', label: 'Figma', initials: 'Fg', domain: 'figma.com' },
  { id: 'notion', label: 'Notion', initials: 'No', domain: 'notion.so' },
]

interface PlanOption {
  id: string
  label: string
  price: number
}

const TOOL_PLANS: Record<ToolName, PlanOption[]> = {
  cursor: [
    { id: 'pro', label: 'Pro · $20/seat', price: 20 },
    { id: 'pro-plus', label: 'Pro+ · $60/seat', price: 60 },
    { id: 'teams', label: 'Teams · $40/seat', price: 40 },
  ],
  'github-copilot': [
    { id: 'individual', label: 'Individual · $10/seat', price: 10 },
    { id: 'business', label: 'Business · $19/seat', price: 19 },
    { id: 'enterprise', label: 'Enterprise · $39/seat', price: 39 },
  ],
  claude: [
    { id: 'pro', label: 'Pro · $20/seat', price: 20 },
    { id: 'team', label: 'Team · $30/seat', price: 30 },
    { id: 'max', label: 'Max · $100/seat', price: 100 },
  ],
  chatgpt: [
    { id: 'go', label: 'Go · $8/seat', price: 8 },
    { id: 'plus', label: 'Plus · $20/seat', price: 20 },
    { id: 'business', label: 'Business · $30/seat', price: 30 },
  ],
  windsurf: [
    { id: 'pro', label: 'Pro · $20/seat', price: 20 },
    { id: 'teams', label: 'Teams · $40/seat', price: 40 },
    { id: 'max', label: 'Max · $200/seat', price: 200 },
  ],
  gemini: [
    { id: 'pro', label: 'Pro · Free', price: 0 },
    { id: 'ultra', label: 'Ultra · $19.99/seat', price: 19.99 },
  ],
  'anthropic-api': [{ id: 'pay-as-you-go', label: 'Pay-as-you-go', price: 0 }],
  'openai-api': [{ id: 'pay-as-you-go', label: 'Pay-as-you-go', price: 0 }],
  figma: [
    { id: 'professional', label: 'Professional · $15/seat', price: 15 },
    { id: 'organization', label: 'Organization · $45/seat', price: 45 },
  ],
  notion: [
    { id: 'plus', label: 'Plus · $10/seat', price: 10 },
    { id: 'business', label: 'Business · $15/seat', price: 15 },
  ],
}

const USE_CASES: {
  id: UseCase
  label: string
  renderIcon: () => React.ReactNode
}[] = [
    {
      id: 'coding',
      label: 'Coding',
      renderIcon: () => (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <rect x="8" y="12" width="48" height="32" rx="6" fill="#3b82f6" fillOpacity="0.1" stroke="#3b82f6" strokeWidth="3" />
          <path d="M20 44l-4 8h32l-4-8" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M24 52h16" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
          <path d="M16 22l6 6-6 6" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="28" cy="28" r="2" fill="#3b82f6" />
        </svg>
      )
    },
    {
      id: 'writing',
      label: 'Writing',
      renderIcon: () => (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <path d="M16 48c8-4 12-8 16-16m-4-4l20-20a4.24 4.24 0 016 6L34 50l-12 4 4-12z" stroke="#ec4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M42 14l6 6" stroke="#ec4899" strokeWidth="3" />
          <path d="M12 52c10 0 18-4 24-12" stroke="#f472b6" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      )
    },
    {
      id: 'data',
      label: 'Data',
      renderIcon: () => (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <rect x="12" y="32" width="8" height="20" rx="2" fill="#10b981" fillOpacity="0.8" />
          <rect x="28" y="16" width="8" height="36" rx="2" fill="#ef4444" fillOpacity="0.8" />
          <rect x="44" y="24" width="8" height="28" rx="2" fill="#3b82f6" fillOpacity="0.8" />
          <path d="M8 52h48" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'research',
      label: 'Research',
      renderIcon: () => (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <circle cx="26" cy="26" r="16" stroke="#8b5cf6" strokeWidth="4" />
          <path d="M38 38l16 16" stroke="#8b5cf6" strokeWidth="5" strokeLinecap="round" />
          <path d="M20 20a8 8 0 018 0" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'mixed',
      label: 'Mixed',
      renderIcon: () => (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
          <path d="M36 4L16 32h16v28l20-28H36V4z" fill="url(#bolt-grad)" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round" />
          <defs>
            <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#fbbf24" />
              <stop offset="100%" stop-color="#d97706" />
            </linearGradient>
          </defs>
        </svg>
      )
    }
  ]

interface SelectedTool {
  toolId: ToolName
  plan: string
  seats: number
  customSpend?: number
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="ui-section p-5 sm:p-6">
      <div className="mb-5">
        <p className="ui-step-badge mb-1.5">Step {step} of 3</p>
        <h2 className="ui-heading">{title}</h2>
        <p className="ui-body mt-1">{description}</p>
      </div>
      {children}
    </section>
  )
}

export default function VisualBuilder() {
  const router = useRouter()

  const [teamSize, setTeamSize] = useState(8)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [selected, setSelected] = useState<SelectedTool[]>([
    { toolId: 'cursor', plan: 'pro', seats: 4 },
    { toolId: 'chatgpt', plan: 'business', seats: 4 },
  ])
  const [quickAdd, setQuickAdd] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const totalMonthly = selected.reduce((sum, s) => {
    if (s.toolId === 'anthropic-api' || s.toolId === 'openai-api') {
      return sum + (s.customSpend ?? 100)
    }
    const plans = TOOL_PLANS[s.toolId]
    const plan = plans.find((p) => p.id === s.plan) ?? plans[0]
    return sum + (plan?.price ?? 0) * s.seats
  }, 0)

  const addTool = (toolId: ToolName) => {
    if (selected.some((s) => s.toolId === toolId)) return
    const defaultPlan = TOOL_PLANS[toolId][0]!.id
    setSelected((prev) => [
      ...prev,
      {
        toolId,
        plan: defaultPlan,
        seats: 1,
        customSpend: toolId.includes('-api') ? 100 : undefined,
      },
    ])
  }

  const removeTool = (toolId: ToolName) => {
    setSelected((prev) => prev.filter((t) => t.toolId !== toolId))
  }

  const changePlan = (toolId: ToolName, plan: string) => {
    setSelected((prev) => prev.map((t) => (t.toolId === toolId ? { ...t, plan } : t)))
  }

  const changeCustomSpend = (toolId: ToolName, spend: number) => {
    setSelected((prev) =>
      prev.map((t) =>
        t.toolId === toolId ? { ...t, customSpend: Math.max(0, spend) } : t
      )
    )
  }

  const adjustSeats = (toolId: ToolName, delta: number) => {
    setSelected((prev) =>
      prev.map((t) =>
        t.toolId === toolId ? { ...t, seats: Math.max(1, t.seats + delta) } : t
      )
    )
  }

  const filteredTools = ALL_TOOLS.filter((t) =>
    t.label.toLowerCase().includes(quickAdd.toLowerCase()) ||
    t.id.toLowerCase().includes(quickAdd.toLowerCase())
  )

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setSubmitErr('Add at least one tool to continue.')
      return
    }
    setLoading(true)
    setSubmitErr(null)
    try {
      const tools = selected.map((s) => {
        let monthlySpend = 0
        if (s.toolId === 'anthropic-api' || s.toolId === 'openai-api') {
          monthlySpend = s.customSpend ?? 100
        } else {
          const plans = TOOL_PLANS[s.toolId]
          const plan = plans.find((p) => p.id === s.plan) ?? plans[0]
          monthlySpend = (plan?.price ?? 0) * s.seats
        }
        return { tool: s.toolId, plan: s.plan, monthlySpend, seats: s.seats }
      })
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamSize, useCase, tools }),
      })
      if (!res.ok) throw new Error()
      const { slug } = (await res.json()) as { slug: string }
      await new Promise((r) => setTimeout(r, 1600))
      router.push(`/audit/${slug}`)
    } catch {
      setSubmitErr('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Step 1: Team size */}
      <Section
        step={1}
        title="Team size"
        description="Used to benchmark plan tiers and seat counts against typical team profiles."
      >
        <div className="flex items-center justify-between gap-4 mb-5 bg-[#C8D9E6]/10 p-3.5 rounded-xl border border-[#C8D9E6]/30">
          {/* Left: TEAM SIZE label */}
          <div className="flex flex-col">
            <span className="ui-label text-[12px] font-extrabold tracking-wider" style={{ color: '#2F4156' }}>Team Size</span>
            <span className="text-[10px] text-[#567C8D]/80 font-medium">Organization capacity</span>
          </div>

          {/* Center: row of dynamic overlapping avatars */}
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-2.5 overflow-hidden py-0.5 px-1.5 bg-white/45 rounded-full border border-[#C8D9E6]/25">
              {Array.from({ length: Math.min(Math.floor(teamSize / 10) + 1, 8) }).map((_, i) => (
                <img
                  key={i}
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-[#567C8D] object-cover shadow-sm transition-transform duration-300 hover:scale-110 hover:z-10 relative cursor-pointer"
                  src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 12}&backgroundColor=C8D9E6,F5EFEB,567C8D`}
                  alt="Avatar"
                />
              ))}
            </div>
            {teamSize > 70 && (
              <span className="text-[#567C8D] font-extrabold text-[14px] leading-none animate-pulse px-1" aria-hidden="true">
                &gt;
              </span>
            )}
          </div>

          {/* Right: numeric size badge */}
          <div className="px-3.5 py-1.5 rounded-lg bg-[#2F4156] text-[#ffffff] font-extrabold text-[13px] shadow-sm tabular-nums min-w-[3.5rem] text-center">
            {teamSize}
            {teamSize >= 100 ? '+' : ''}
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={100}
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #567C8D 0%, #2F4156 ${((teamSize - 1) / (100 - 1)) * 100}%, #C8D9E6 ${((teamSize - 1) / (100 - 1)) * 100}%, #C8D9E6 100%)`
          }}
          className="ui-range w-full"
          aria-label="Team size"
        />
        <div className="flex justify-between mt-2.5 text-[11px] font-bold text-secondary/85 tabular-nums">
          <span>1</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100+</span>
        </div>
      </Section>

      {/* Step 2: Primary use case */}
      <section className="ui-section p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2F4156] text-white text-sm font-bold shrink-0">
            2
          </span>
          <h2 className="text-lg font-bold" style={{ color: '#2F4156' }}>
            What does your team primarily use AI for?
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
          {USE_CASES.map((uc) => {
            const isSelected = useCase === uc.id
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setUseCase(uc.id)}
                className={cn(
                  'flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-200 relative group',
                  isSelected
                    ? 'border-[#2F4156] bg-gradient-to-br from-[#567C8D]/15 to-[#C8D9E6]/25 shadow-md scale-[1.02]'
                    : 'border-[#C8D9E6] bg-white hover:border-[#567C8D]/85 hover:bg-[#C8D9E6]/10'
                )}
              >
                <span className="flex h-16 w-16 items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  {uc.renderIcon()}
                </span>
                <span className={cn(
                  'text-sm font-bold tracking-tight transition-colors',
                  isSelected ? 'text-[#2F4156]' : 'text-[#567C8D]'
                )}>
                  {uc.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Step 3: Build your AI stack */}
      <section className="ui-section p-5 sm:p-6">
        <div className="flex flex-col gap-1.5 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2F4156] text-white text-sm font-bold shrink-0">
              3
            </span>
            <h2 className="text-lg font-bold" style={{ color: '#2F4156' }}>Build your AI stack</h2>
          </div>
          <div className="flex items-center justify-between mt-2.5">
            <span className="text-sm font-semibold text-[#567C8D]">
              {selected.length} tool{selected.length === 1 ? '' : 's'} added · ${totalMonthly}/mo total
            </span>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#2F4156] bg-[#C8D9E6]/30 border border-[#C8D9E6]">
              Select plan & seats per tool
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mb-5">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#567C8D]/60 pointer-events-none"
          />
          <input
            value={quickAdd}
            onChange={(e) => setQuickAdd(e.target.value)}
            placeholder="Search tools to add to stack…"
            className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-[#C8D9E6] outline-none focus:border-[#2F4156] focus:ring-2 focus:ring-[#567C8D]/20 transition-all bg-white text-[#2F4156] placeholder-[#567C8D]/60"
            aria-label="Search tools"
          />
        </div>

        {/* Selection grid of all tools */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 mb-8">
          {filteredTools.map((tool) => {
            const sel = selected.find((s) => s.toolId === tool.id)
            const isSelected = !!sel
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    removeTool(tool.id)
                  } else {
                    addTool(tool.id)
                  }
                }}
                className={cn(
                  'flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all duration-200 group relative',
                  isSelected
                    ? 'border-[#2F4156] bg-gradient-to-br from-[#567C8D]/15 to-[#C8D9E6]/25 shadow-md scale-[1.02]'
                    : 'border-[#C8D9E6] bg-white hover:border-[#567C8D]/60 hover:bg-[#C8D9E6]/10'
                )}
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden mb-2.5 transition-transform duration-300 group-hover:scale-105 shadow-sm bg-white flex items-center justify-center">
                  <ToolIcon tool={tool.id} size="sm" />
                </div>
                <span className={cn(
                  'text-xs font-bold truncate max-w-full px-1',
                  isSelected ? 'text-[#2F4156]' : 'text-[#567C8D]'
                )}>
                  {tool.label}
                </span>
                {isSelected ? (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#2F4156] flex items-center justify-center text-white">
                    <Check size={10} strokeWidth={3} />
                  </div>
                ) : (
                  <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={10} strokeWidth={3} />
                  </div>
                )}
              </button>
            )
          })}
          {filteredTools.length === 0 && (
            <div className="col-span-full py-8 text-center text-sm text-gray-400">
              No tools found matching &quot;{quickAdd}&quot;
            </div>
          )}
        </div>

        {/* Configuration cards of selected tools */}
        {selected.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-gray-100 pt-6">
            {selected.map((item) => {
              const cfg = ALL_TOOLS.find((t) => t.id === item.toolId)!
              const plans = TOOL_PLANS[item.toolId]
              const currentPlan = plans.find((p) => p.id === item.plan) ?? plans[0]!
              const isApi = item.toolId === 'anthropic-api' || item.toolId === 'openai-api'
              const itemPrice = isApi
                ? (item.customSpend ?? 100)
                : (currentPlan?.price ?? 0) * item.seats

              return (
                <div
                  key={item.toolId}
                  className="bg-gradient-to-br from-white to-[#C8D9E6]/10 border border-[#C8D9E6] rounded-2xl p-5 shadow-sm hover:border-[#567C8D]/50 transition-colors flex flex-col gap-4 relative text-left"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm bg-white flex items-center justify-center border border-[#C8D9E6]/40">
                        <ToolIcon tool={item.toolId} size="md" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-[#2F4156]">{cfg.label}</h3>
                        <p className="text-xs text-[#567C8D] font-medium mt-0.5">
                          {isApi ? 'API Usage' : `${currentPlan.label.split(' · ')[0]} · ${item.seats} seat${item.seats === 1 ? '' : 's'}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-[#2F4156]">${itemPrice}</span>
                        <span className="text-xs text-[#567C8D]/70 font-medium ml-1">/month</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTool(item.toolId)}
                        className="w-8 h-8 rounded-lg bg-[#C8D9E6]/20 hover:bg-red-50 border border-[#C8D9E6] flex items-center justify-center text-[#567C8D] hover:text-red-600 transition-colors"
                        aria-label={`Remove ${cfg.label}`}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  {/* PLAN Row */}
                  <div className="border-t border-[#C8D9E6]/40 pt-4 flex flex-col gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#567C8D]/80">PLAN</span>
                    <div className="flex flex-wrap gap-2">
                      {plans.map((p) => {
                        const isActive = item.plan === p.id
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => changePlan(item.toolId, p.id)}
                            className={cn(
                              'px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all',
                              isActive
                                ? 'bg-[#2F4156] text-white shadow-sm'
                                : 'bg-[#C8D9E6]/30 hover:bg-[#C8D9E6]/60 text-[#2F4156] border border-[#C8D9E6]'
                            )}
                          >
                            {p.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Seats or Custom Spend Row */}
                  <div className="flex items-center justify-between border-t border-[#C8D9E6]/40 pt-4">
                    {isApi ? (
                      <>
                        <span className="text-xs font-semibold text-[#2F4156]">Estimated monthly API spend</span>
                        <div className="flex items-center h-9 border border-[#C8D9E6] rounded-xl bg-[#C8D9E6]/15 px-3">
                          <span className="text-xs text-[#567C8D]/80 font-semibold mr-1.5">$</span>
                          <input
                            type="number"
                            value={item.customSpend ?? 100}
                            onChange={(e) => changeCustomSpend(item.toolId, Number(e.target.value))}
                            className="w-20 bg-transparent border-0 outline-none text-sm text-[#2F4156] text-right font-bold tabular-nums"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-[#2F4156]">Seats</span>
                        <div className="flex items-center gap-2.5">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#C8D9E6]/20 hover:bg-[#C8D9E6]/50 border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] font-bold transition-all disabled:opacity-40"
                            onClick={() => adjustSeats(item.toolId, -1)}
                            disabled={item.seats <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-extrabold text-[#2F4156] tabular-nums">
                            {item.seats}
                          </span>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-lg bg-[#C8D9E6]/20 hover:bg-[#C8D9E6]/50 border border-[#C8D9E6] flex items-center justify-center text-[#2F4156] font-bold transition-all"
                            onClick={() => adjustSeats(item.toolId, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Monthly Spend Row */}
                  <div className="flex items-center justify-between border-t border-[#C8D9E6]/40 pt-4">
                    <span className="text-xs font-semibold text-[#2F4156]">Monthly spend</span>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#C8D9E6]/25 border border-[#C8D9E6] rounded-lg text-sm text-[#2F4156] font-bold w-24 justify-end">
                      <span>$ {itemPrice}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Audit Summary & Action Footer */}
      <div className="ui-section p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-[#567C8D] bg-gradient-to-r from-white to-[#C8D9E6]/10">
        <div>
          <p className="ui-label">Estimated monthly spend</p>
          <p className="mt-1 text-[28px] font-extrabold text-[#2F4156] tracking-tight tabular-nums">
            ${totalMonthly.toLocaleString()}
            <span className="text-[14px] font-bold text-[#567C8D] ml-1">/mo</span>
          </p>
          <p className="text-[12px] text-[#567C8D] mt-0.5">
            {selected.length} tool{selected.length === 1 ? '' : 's'} configured
          </p>
        </div>

        <div className="w-full sm:w-[220px] flex flex-col gap-2">
          {submitErr && (
            <p
              role="alert"
              className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
            >
              {submitErr}
            </p>
          )}
          <SubmitProgress active={loading} />
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="ui-btn-primary w-full h-10 hover:scale-[1.02] shadow-md transition-transform duration-200"
          >
            {loading ? 'Running audit…' : 'Run audit'}
          </button>
        </div>
      </div>
    </div>
  )
}
