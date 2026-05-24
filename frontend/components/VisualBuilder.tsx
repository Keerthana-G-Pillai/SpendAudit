'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Code2,
  PenLine,
  BarChart2,
  Microscope,
  Layers,
  Check,
  Plus,
  Minus,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import SubmitProgress from './SubmitProgress'
import type { ToolName, UseCase } from '@backend/lib/types'
import type { LucideIcon } from 'lucide-react'

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
    { id: 'business', label: 'Business · $40/seat', price: 40 },
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
    { id: 'plus', label: 'Plus · $20/seat', price: 20 },
    { id: 'team', label: 'Team · $30/seat', price: 30 },
  ],
  windsurf: [
    { id: 'pro', label: 'Pro · $15/seat', price: 15 },
    { id: 'teams', label: 'Teams · $35/seat', price: 35 },
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
  description: string
  icon: LucideIcon
}[] = [
  {
    id: 'coding',
    label: 'Engineering',
    description: 'Product development, code, and technical workflows',
    icon: Code2,
  },
  {
    id: 'writing',
    label: 'Content & marketing',
    description: 'Copy, campaigns, and growth operations',
    icon: PenLine,
  },
  {
    id: 'data',
    label: 'Data & analytics',
    description: 'Analysis, reporting, and business intelligence',
    icon: BarChart2,
  },
  {
    id: 'research',
    label: 'Research',
    description: 'Discovery, synthesis, and knowledge work',
    icon: Microscope,
  },
  {
    id: 'mixed',
    label: 'Cross-functional',
    description: 'Multiple teams or mixed departmental use',
    icon: Layers,
  },
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

function ToolMark({ initials, domain }: { initials: string; domain?: string }) {
  const [error, setError] = useState(false)

  if (domain && !error) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={initials}
        className="h-8 w-8 rounded object-cover shadow-sm bg-white"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent/30 text-[11px] font-semibold text-primary">
      {initials}
    </span>
  )
}

export default function VisualBuilder() {
  const router = useRouter()

  const [teamSize, setTeamSize] = useState(8)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [selected, setSelected] = useState<SelectedTool[]>([
    { toolId: 'cursor', plan: 'pro', seats: 4 },
    { toolId: 'chatgpt', plan: 'team', seats: 4 },
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

  const available = ALL_TOOLS.filter((t) => !selected.some((s) => s.toolId === t.id))
  const suggestions =
    quickAdd.length > 0
      ? available
          .filter(
            (t) =>
              t.label.toLowerCase().includes(quickAdd.toLowerCase()) ||
              t.id.toLowerCase().includes(quickAdd.toLowerCase())
          )
          .slice(0, 6)
      : []

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
      <Section
        step={1}
        title="Team size"
        description="Used to benchmark plan tiers and seat counts against typical team profiles."
      >
        <div className="flex items-center justify-between gap-4 mb-3">
          <span className="ui-label">People on your team</span>
          <span className="text-[13px] font-medium text-primary tabular-nums">
            {teamSize}
            {teamSize >= 100 ? '+' : ''}
          </span>
        </div>
        
        <div className="flex items-center justify-center mb-6 h-10">
          <div className="flex -space-x-3 overflow-hidden p-1">
            {Array.from({ length: Math.min(teamSize, 8) }).map((_, i) => (
              <img
                key={i}
                className="inline-block h-10 w-10 rounded-full ring-2 ring-background bg-secondary object-cover"
                src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i + 12}&backgroundColor=C8D9E6,F5EFEB,567C8D`}
                alt="Avatar"
              />
            ))}
            {teamSize > 8 && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary ring-2 ring-background text-[11px] font-medium text-white shadow-sm z-10">
                +{teamSize - 8}
              </div>
            )}
          </div>
        </div>
        <input
          type="range"
          min={1}
          max={100}
          value={teamSize}
          onChange={(e) => setTeamSize(Number(e.target.value))}
          className="ui-range w-full"
          aria-label="Team size"
        />
        <div className="flex justify-between mt-2 text-[11px] text-secondary/80 tabular-nums">
          <span>1</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100+</span>
        </div>
      </Section>

      <Section
        step={2}
        title="Primary use case"
        description="Shapes which recommendations and overlap checks we prioritize."
      >
        <div className="grid gap-2">
          {USE_CASES.map((uc) => {
            const Icon = uc.icon
            const isSelected = useCase === uc.id
            return (
              <button
                key={uc.id}
                type="button"
                onClick={() => setUseCase(uc.id)}
                className={cn('ui-option', isSelected && 'ui-option-selected')}
              >
                <span
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded border',
                    isSelected
                      ? 'border-primary bg-primary text-white'
                      : 'border-accent bg-background text-primary/70'
                  )}
                >
                  <Icon size={15} strokeWidth={1.75} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-medium text-primary">
                    {uc.label}
                  </span>
                  <span className="block text-[12px] text-secondary mt-0.5 leading-snug">
                    {uc.description}
                  </span>
                </span>
                {isSelected && (
                  <Check size={16} className="shrink-0 text-primary mt-0.5" strokeWidth={2} />
                )}
              </button>
            )
          })}
        </div>
      </Section>

      <Section
        step={3}
        title="Your stack"
        description="Add tools, set plans, and seat counts. Spend updates as you configure."
      >
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/80 pointer-events-none"
          />
          <input
            value={quickAdd}
            onChange={(e) => setQuickAdd(e.target.value)}
            placeholder="Search tools to add…"
            className="ui-input pl-9"
            aria-label="Search tools"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-20 left-0 right-0 top-[calc(100%+4px)] bg-white border border-accent rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.08)] py-1">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    addTool(s.id)
                    setQuickAdd('')
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left hover:bg-background transition-colors"
                >
                  <ToolMark initials={s.initials} domain={s.domain} />
                  <span className="text-[13px] font-medium text-primary">{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selected.length > 0 && (
          <div className="mb-5 border border-accent rounded-md overflow-hidden divide-y divide-accent">
            {selected.map((item) => {
              const cfg = ALL_TOOLS.find((t) => t.id === item.toolId)!
              const plans = TOOL_PLANS[item.toolId]
              const currentPlan = plans.find((p) => p.id === item.plan) ?? plans[0]!
              const isApi =
                item.toolId === 'anthropic-api' || item.toolId === 'openai-api'
              const itemPrice = isApi
                ? (item.customSpend ?? 100)
                : (currentPlan?.price ?? 0) * item.seats

              return (
                <div
                  key={item.toolId}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-white"
                >
                  <div className="flex items-center gap-2.5 sm:w-[140px] shrink-0">
                    <ToolMark initials={cfg.initials} domain={cfg.domain} />
                    <span className="text-[13px] font-medium text-primary">{cfg.label}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <select
                      value={item.plan}
                      onChange={(e) => changePlan(item.toolId, e.target.value)}
                      className="ui-select w-full"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-3 sm:ml-auto">
                    {isApi ? (
                      <div className="flex items-center gap-1.5">
                        <span className="ui-label">Spend</span>
                        <div className="flex items-center h-8 border border-accent rounded-md bg-white px-2">
                          <span className="text-[12px] text-secondary/80">$</span>
                          <input
                            type="number"
                            value={item.customSpend ?? 100}
                            onChange={(e) =>
                              changeCustomSpend(item.toolId, Number(e.target.value))
                            }
                            className="w-16 bg-transparent border-0 outline-none text-[13px] text-primary text-right tabular-nums"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="ui-label">Seats</span>
                        <div className="inline-flex items-center h-8 border border-accent rounded-md">
                          <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center text-secondary hover:bg-background hover:text-primary transition-colors"
                            onClick={() => adjustSeats(item.toolId, -1)}
                            aria-label="Decrease seats"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-6 text-center text-[13px] font-medium tabular-nums text-primary">
                            {item.seats}
                          </span>
                          <button
                            type="button"
                            className="h-8 w-8 flex items-center justify-center text-secondary hover:bg-background hover:text-primary transition-colors"
                            onClick={() => adjustSeats(item.toolId, 1)}
                            aria-label="Increase seats"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    )}

                    <span className="text-[13px] font-medium text-primary tabular-nums w-[72px] text-right">
                      ${itemPrice}
                      <span className="text-secondary/80 font-normal">/mo</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => removeTool(item.toolId)}
                      className="h-8 w-8 flex items-center justify-center text-secondary/80 hover:text-primary transition-colors"
                      aria-label={`Remove ${cfg.label}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {available.length > 0 && (
          <div>
            <p className="ui-label mb-2">Add to stack</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {available.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => addTool(tool.id)}
                  className="ui-tool-tile"
                >
                  <ToolMark initials={tool.initials} domain={tool.domain} />
                  <span className="text-[12px] font-medium text-primary text-center leading-tight">
                    {tool.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </Section>

      <div className="ui-section p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="ui-label">Estimated monthly spend</p>
          <p className="mt-1 text-[24px] font-semibold text-primary tracking-[-0.02em] tabular-nums">
            ${totalMonthly.toLocaleString()}
            <span className="text-[14px] font-normal text-secondary">/mo</span>
          </p>
          <p className="text-[12px] text-secondary mt-0.5">
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
            className="ui-btn-primary w-full h-10"
          >
            {loading ? 'Running audit…' : 'Run audit'}
          </button>
        </div>
      </div>
    </div>
  )
}
