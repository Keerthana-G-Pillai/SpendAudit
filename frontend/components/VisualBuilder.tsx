'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Plus, Minus, X, ArrowRight, ArrowDown, Layers, CircleDollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import SubmitProgress from './SubmitProgress'
import ToolBadge from './ToolBadge'
import GlassCard from './audit/GlassCard'
import type { ToolName, UseCase } from '@backend/lib/types'

interface ToolCfg {
  id: ToolName
  label: string
}

const ALL_TOOLS: ToolCfg[] = [
  { id: 'cursor', label: 'Cursor' },
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'github-copilot', label: 'Copilot' },
  { id: 'windsurf', label: 'Windsurf' },
  { id: 'anthropic-api', label: 'Anthropic API' },
  { id: 'openai-api', label: 'OpenAI API' },
  { id: 'figma', label: 'Figma' },
  { id: 'notion', label: 'Notion' },
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

const USE_CASES: { id: UseCase; label: string; description: string }[] = [
  { id: 'coding', label: 'Engineering', description: 'Code, shipping, and dev workflows' },
  { id: 'writing', label: 'Content', description: 'Marketing, copy, and comms' },
  { id: 'data', label: 'Data', description: 'Analytics and BI' },
  { id: 'research', label: 'Research', description: 'Discovery and synthesis' },
  { id: 'mixed', label: 'Mixed', description: 'Cross-functional teams' },
]

interface SelectedTool {
  toolId: ToolName
  plan: string
  seats: number
  customSpend?: number
}

function scrollToStep(stepId: string) {
  const el = document.getElementById(stepId)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function planSummary(toolId: ToolName, planId: string): string {
  const plan = TOOL_PLANS[toolId].find((p) => p.id === planId) ?? TOOL_PLANS[toolId][0]
  if (!plan) return ''
  if (toolId === 'anthropic-api' || toolId === 'openai-api') return 'Pay-as-you-go'
  const tier = plan.label.split(' · ')[0]
  return `${tier}, $${plan.price}/seat`
}

function StepHeader({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="mb-5">
      <span className="inline-flex items-center gap-2 rounded-full bg-[#2F4156] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white mb-3">
        Step {step} of 3
      </span>
      <h3 className="text-[20px] sm:text-[22px] font-black text-[#1d2d3c] tracking-tight">{title}</h3>
      <p className="mt-1.5 text-[14px] text-[#55697c] font-medium leading-relaxed">{description}</p>
    </div>
  )
}

function ContinueButton({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hero-primary-btn mt-6 text-[14px] py-3 px-6 rounded-full"
    >
      {label}
      <ArrowDown size={16} />
    </button>
  )
}

export default function VisualBuilder() {
  const router = useRouter()
  const [teamSize, setTeamSize] = useState(8)
  const [useCase, setUseCase] = useState<UseCase>('coding')
  const [selected, setSelected] = useState<SelectedTool[]>([])
  const [loading, setLoading] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const totalMonthly = selected.reduce((sum, s) => {
    const plans = TOOL_PLANS[s.toolId]
    if (!plans?.length) return sum
    if (s.toolId === 'anthropic-api' || s.toolId === 'openai-api') {
      return sum + (s.customSpend ?? 0)
    }
    const plan = plans.find((p) => p.id === s.plan)
    if (!plan) return sum
    return sum + plan.price * s.seats
  }, 0)

  const estimatedSavings = useMemo(() => {
    if (selected.length === 0) return 0
    const overlapFactor = Math.min(0.35, (selected.length - 1) * 0.08)
    return Math.round(totalMonthly * overlapFactor)
  }, [selected.length, totalMonthly])

  const savingsPct =
    totalMonthly > 0 ? Math.min(90, Math.round((estimatedSavings / totalMonthly) * 100)) : 0

  const overlapCount = selected.length >= 2 ? Math.min(3, selected.length - 1) : 0

  const addTool = (toolId: ToolName) => {
    if (selected.some((s) => s.toolId === toolId)) return
    setSelected((prev) => [
      ...prev,
      {
        toolId,
        plan: TOOL_PLANS[toolId][0]!.id,
        seats: Math.min(teamSize, 10),
        customSpend: toolId.includes('-api') ? 0 : undefined,
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

  const showOverspendHint = (toolId: ToolName) =>
    selected.length >= 2 &&
    useCase === 'coding' &&
    ['cursor', 'chatgpt', 'claude', 'github-copilot'].includes(toolId)

  const handleSubmit = async () => {
    if (selected.length === 0) {
      setSubmitErr('Add at least one tool to run your audit.')
      scrollToStep('audit-step-3')
      return
    }
    setLoading(true)
    setSubmitErr(null)
    try {
      const tools = selected.map((s) => {
        let monthlySpend = 0
        if (s.toolId === 'anthropic-api' || s.toolId === 'openai-api') {
          monthlySpend = s.customSpend ?? 0
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
    <div
      id="run-audit"
      className="scroll-mt-28 -mx-6 sm:-mx-12 px-6 sm:px-12 py-14 sm:py-16 rounded-none sm:rounded-3xl"
      style={{
        background: 'linear-gradient(180deg, #e8f0f6 0%, #eef4f8 40%, #f5efeb 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#567C8D] mb-2">
            Step-by-step audit
          </p>
          <h2 className="text-[28px] sm:text-[32px] font-black text-[#1d2d3c] tracking-tight">
            Build your AI stack
          </h2>
          <p className="mt-2 text-[15px] text-[#55697c] font-medium">
            Complete each step below. When you finish one, continue — the page scrolls to the
            next step (nothing is hidden).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* Left — all steps stacked */}
          <div className="lg:col-span-7 flex flex-col gap-20 sm:gap-24 pb-8">
            {/* Step 1 */}
            <article id="audit-step-1" className="scroll-mt-28">
              <StepHeader
                step={1}
                title="Team size"
                description="How many people on your team use AI tools? We use this to benchmark plans and seats."
              />
              <GlassCard className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <span className="text-[15px] font-bold text-[#1d2d3c]">Team Size</span>
                  <span className="inline-flex rounded-full bg-[#2F4156] px-3.5 py-1 text-[13px] font-bold text-white tabular-nums">
                    {teamSize}
                    {teamSize >= 500 ? '+' : ''} seats
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={500}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="ui-range w-full"
                  aria-label="Team size"
                />
                <div className="flex justify-between mt-2.5 text-[11px] font-medium text-[#697d90]">
                  <span>1 seat</span>
                  <span>500+ seats</span>
                </div>
              </GlassCard>
              <ContinueButton
                label="Continue to use case"
                onClick={() => scrollToStep('audit-step-2')}
              />
            </article>

            {/* Step 2 */}
            <article id="audit-step-2" className="scroll-mt-28">
              <StepHeader
                step={2}
                title="Primary use case"
                description="What does your team mainly use AI for? This shapes overlap and savings checks."
              />
              <GlassCard className="p-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc.id}
                      type="button"
                      onClick={() => setUseCase(uc.id)}
                      className={cn(
                        'text-left p-4 rounded-xl border transition-all',
                        useCase === uc.id
                          ? 'border-[#2F4156] bg-[#e8f0f6] ring-1 ring-[#2F4156]'
                          : 'border-[#C8D9E6] bg-white/60 hover:border-[#567C8D]'
                      )}
                    >
                      <span className="block text-[14px] font-bold text-[#1d2d3c]">{uc.label}</span>
                      <span className="block text-[12px] text-[#55697c] font-medium mt-0.5">
                        {uc.description}
                      </span>
                    </button>
                  ))}
                </div>
              </GlassCard>
              <ContinueButton
                label="Continue to your stack"
                onClick={() => scrollToStep('audit-step-3')}
              />
            </article>

            {/* Step 3 */}
            <article id="audit-step-3" className="scroll-mt-28">
              <StepHeader
                step={3}
                title="Your AI stack"
                description="Select every tool you pay for, then set plan and seats on each card below the grid."
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {ALL_TOOLS.map((tool) => {
                  const isSelected = selected.some((s) => s.toolId === tool.id)
                  const sel = selected.find((s) => s.toolId === tool.id)
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => (isSelected ? removeTool(tool.id) : addTool(tool.id))}
                      className={cn(
                        'relative text-left rounded-2xl border p-4 flex flex-col gap-3 min-h-[118px] transition-all',
                        isSelected
                          ? 'border-[#2F4156] bg-white/90 premium-stack-shadow'
                          : 'border-white/70 bg-white/75 backdrop-blur-md premium-stack-shadow hover:border-[#567C8D]'
                      )}
                    >
                      {isSelected && showOverspendHint(tool.id) && (
                        <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-wide text-[#697d90] bg-[#e8eff5] px-1.5 py-0.5 rounded-md">
                          Overspend
                        </span>
                      )}
                      <ToolBadge tool={tool.id} size={36} />
                      <div>
                        <p className="text-[14px] font-bold text-[#1d2d3c]">{tool.label}</p>
                        {sel && (
                          <p className="text-[11px] font-medium text-[#55697c] mt-0.5">
                            {planSummary(sel.toolId, sel.plan)}
                          </p>
                        )}
                      </div>
                      {isSelected && (
                        <span className="absolute bottom-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#2F4156] text-white">
                          <Check size={11} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {selected.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <p className="text-[12px] font-bold uppercase tracking-wider text-[#567C8D]">
                    Plans &amp; seats
                  </p>
                  {selected.map((item) => {
                    const cfg = ALL_TOOLS.find((t) => t.id === item.toolId)!
                    const plans = TOOL_PLANS[item.toolId]
                    const isApi =
                      item.toolId === 'anthropic-api' || item.toolId === 'openai-api'
                    const currentPlan = plans.find((p) => p.id === item.plan) ?? plans[0]!
                    const itemPrice = isApi
                      ? (item.customSpend ?? 0)
                      : (currentPlan?.price ?? 0) * item.seats

                    return (
                      <GlassCard key={item.toolId} className="p-4">
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <div className="flex items-center gap-2.5">
                            <ToolBadge tool={item.toolId} size={32} />
                            <div>
                              <p className="text-[14px] font-bold text-[#1d2d3c]">{cfg.label}</p>
                              <p className="text-[11px] font-medium text-[#55697c]">
                                ${itemPrice}/mo
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeTool(item.toolId)}
                            className="h-8 w-8 rounded-lg border border-[#C8D9E6] flex items-center justify-center text-[#697d90] hover:text-red-600"
                            aria-label={`Remove ${cfg.label}`}
                          >
                            <X size={15} />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {plans.map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => changePlan(item.toolId, p.id)}
                              className={cn(
                                'px-2.5 py-1 rounded-full text-[10px] font-semibold',
                                item.plan === p.id
                                  ? 'bg-[#2F4156] text-white'
                                  : 'bg-[#e8f0f6] text-[#446577]'
                              )}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                        {!isApi ? (
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-[#55697c]">Seats</span>
                            <div className="inline-flex items-center rounded-lg border border-[#C8D9E6] bg-white/60">
                              <button
                                type="button"
                                className="h-8 w-8 flex items-center justify-center"
                                onClick={() => adjustSeats(item.toolId, -1)}
                                disabled={item.seats <= 1}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center text-[13px] font-bold tabular-nums">
                                {item.seats}
                              </span>
                              <button
                                type="button"
                                className="h-8 w-8 flex items-center justify-center"
                                onClick={() => adjustSeats(item.toolId, 1)}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <span className="text-[12px] font-semibold text-[#55697c]">
                              Monthly API spend
                            </span>
                            <div className="flex items-center h-8 rounded-lg border border-[#C8D9E6] bg-white/60 px-2">
                              <span className="text-[12px] text-[#697d90]">$</span>
                              <input
                                type="number"
                                value={item.customSpend ?? 0}
                                onChange={(e) =>
                                  changeCustomSpend(item.toolId, Number(e.target.value))
                                }
                                className="w-16 bg-transparent outline-none text-[13px] font-bold text-right tabular-nums"
                              />
                            </div>
                          </div>
                        )}
                      </GlassCard>
                    )
                  })}
                </div>
              ) : (
                <GlassCard className="p-6 border-dashed border-[#C8D9E6] bg-white/40 text-center">
                  <p className="text-[14px] font-medium text-[#55697c]">
                    Select at least one tool above to configure plans and seats.
                  </p>
                </GlassCard>
              )}


            </article>

            <article id="audit-step-submit" className="scroll-mt-28 lg:hidden">
              <GlassCard className="p-6">
                {submitErr && (
                  <p role="alert" className="text-[12px] text-red-600 mb-3">
                    {submitErr}
                  </p>
                )}
                <SubmitProgress active={loading} />
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmit}
                  className="hero-primary-btn w-full justify-center py-3.5 rounded-xl text-[14px] font-bold mt-3"
                >
                  {loading ? 'Running audit…' : 'Run audit — it\'s free'}
                  <ArrowRight size={16} />
                </button>
              </GlassCard>
            </article>
          </div>

          {/* Right — live summary (sticky) */}
          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <GlassCard className="overflow-hidden flex flex-col p-0">
              <div className="bg-[#2F4156] px-6 py-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C8D9E6]/90">
                  Total monthly spend
                </p>
                <p className="mt-1 text-[34px] font-black text-white tracking-tight tabular-nums leading-none">
                  ${selected.length === 0 ? '0' : totalMonthly.toLocaleString()}
                  <span className="text-[15px] font-semibold text-[#C8D9E6]/80"> /mo</span>
                </p>
              </div>
              <div className="p-6 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold text-[#55697c]">
                    Est. potential savings
                  </span>
                  <span className="text-[20px] font-black text-[#2F4156] tabular-nums">
                    ${estimatedSavings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#C8D9E6]/60 overflow-hidden mb-5">
                  <div
                    className="h-full rounded-full bg-[#567C8D] transition-all duration-300"
                    style={{ width: `${savingsPct}%` }}
                  />
                </div>
                <ul className="space-y-2.5 mb-6">
                  {overlapCount > 0 && (
                    <li className="flex items-center gap-2.5 text-[13px] font-medium text-[#1d2d3c]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f0f6] text-[#567C8D]">
                        <Layers size={14} />
                      </span>
                      {overlapCount} overlap{overlapCount === 1 ? '' : 's'} may apply
                    </li>
                  )}
                  {teamSize >= 20 && (
                    <li className="flex items-center gap-2.5 text-[13px] font-medium text-[#1d2d3c]">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8f0f6] text-[#567C8D]">
                        <CircleDollarSign size={14} />
                      </span>
                      Volume discount may apply
                    </li>
                  )}
                  <li className="text-[12px] text-[#697d90] font-medium">
                    {selected.length} tool{selected.length === 1 ? '' : 's'} · {USE_CASES.find((u) => u.id === useCase)?.label} · {teamSize} seats
                  </li>
                </ul>
                {submitErr && (
                  <p role="alert" className="text-[12px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
                    {submitErr}
                  </p>
                )}
                <SubmitProgress active={loading} />
                <button
                  type="button"
                  disabled={loading || selected.length === 0}
                  onClick={handleSubmit}
                  className="hero-primary-btn w-full justify-center py-3.5 rounded-xl text-[14px] font-bold mt-2 disabled:opacity-50"
                >
                  {loading ? 'Running audit…' : 'Run audit — it\'s free'}
                  <ArrowRight size={16} strokeWidth={2.5} />
                </button>
                <p className="mt-4 text-center text-[11px] font-medium text-[#697d90]">
                  No credit card required
                </p>
              </div>
            </GlassCard>
          </aside>
        </div>
      </div>
    </div>
  )
}
