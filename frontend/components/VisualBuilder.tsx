'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import SubmitProgress from './SubmitProgress'
import type { ToolName, UseCase } from '@backend/lib/types'

// ─── Catalogues ───────────────────────────────────────────────────────────────
interface ToolCfg {
  id: ToolName
  label: string
  iconBg: string
  iconText: string
  initials: string
}

const ALL_TOOLS: ToolCfg[] = [
  { id: 'cursor',         label: 'Cursor',        iconBg: '#ede9fe', iconText: '#6d28d9', initials: 'Cu' },
  { id: 'chatgpt',        label: 'ChatGPT',       iconBg: '#d1fae5', iconText: '#065f46', initials: 'GP' },
  { id: 'claude',         label: 'Claude',        iconBg: '#fef3c7', iconText: '#92400e', initials: 'Cl' },
  { id: 'gemini',         label: 'Gemini',        iconBg: '#dbeafe', iconText: '#1e40af', initials: 'Ge' },
  { id: 'github-copilot', label: 'Copilot',       iconBg: '#1f2937', iconText: '#ffffff', initials: 'GC' },
  { id: 'windsurf',       label: 'Windsurf',      iconBg: '#cffafe', iconText: '#155e75', initials: 'Ws' },
  { id: 'anthropic-api',  label: 'Anthropic',     iconBg: '#fde8d8', iconText: '#9a3412', initials: 'An' },
  { id: 'openai-api',     label: 'OpenAI API',    iconBg: '#f0fdf4', iconText: '#166534', initials: 'OA' },
  { id: 'figma',          label: 'Figma',         iconBg: '#fee2e2', iconText: '#ef4444', initials: 'Fi' },
  { id: 'notion',         label: 'Notion',        iconBg: '#f3f4f6', iconText: '#111827', initials: 'No' },
]

interface PlanOption {
  id: string
  label: string
  price: number
}

const TOOL_PLANS: Record<ToolName, PlanOption[]> = {
  cursor: [
    { id: 'pro', label: 'Pro ($20/mo)', price: 20 },
    { id: 'business', label: 'Business ($40/mo)', price: 40 },
  ],
  'github-copilot': [
    { id: 'individual', label: 'Individual ($10/mo)', price: 10 },
    { id: 'business', label: 'Business ($19/mo)', price: 19 },
    { id: 'enterprise', label: 'Enterprise ($39/mo)', price: 39 },
  ],
  claude: [
    { id: 'pro', label: 'Pro ($20/mo)', price: 20 },
    { id: 'team', label: 'Team ($30/mo)', price: 30 },
    { id: 'max', label: 'Max ($100/mo)', price: 100 },
  ],
  chatgpt: [
    { id: 'plus', label: 'Plus ($20/mo)', price: 20 },
    { id: 'team', label: 'Team ($30/mo)', price: 30 },
  ],
  windsurf: [
    { id: 'pro', label: 'Pro ($15/mo)', price: 15 },
    { id: 'teams', label: 'Teams ($35/mo)', price: 35 },
  ],
  gemini: [
    { id: 'pro', label: 'Pro ($0/mo)', price: 0 },
    { id: 'ultra', label: 'Ultra ($19.99/mo)', price: 19.99 },
  ],
  'anthropic-api': [
    { id: 'pay-as-you-go', label: 'Pay-as-you-go (API)', price: 0 },
  ],
  'openai-api': [
    { id: 'pay-as-you-go', label: 'Pay-as-you-go (API)', price: 0 },
  ],
  figma: [
    { id: 'professional', label: 'Professional ($15/mo)', price: 15 },
    { id: 'organization', label: 'Organization ($45/mo)', price: 45 },
    { id: 'enterprise', label: 'Enterprise ($75/mo)', price: 75 },
  ],
  notion: [
    { id: 'plus', label: 'Plus ($10/mo)', price: 10 },
    { id: 'business', label: 'Business ($15/mo)', price: 15 },
    { id: 'enterprise', label: 'Enterprise ($25/mo)', price: 25 },
  ],
}

const USE_CASES: { id: UseCase; label: string; emoji: string }[] = [
  { id: 'coding',   label: 'Engineering', emoji: '💻' },
  { id: 'writing',  label: 'Marketing',   emoji: '📣' },
  { id: 'data',     label: 'Design',      emoji: '🎨' },
  { id: 'research', label: 'Research',    emoji: '🔬' },
  { id: 'mixed',    label: 'Mixed',       emoji: '✨' },
]

const AVATARS = ['🧑', '👩', '👨', '🧑‍💻', '👩‍💼', '👨‍🔬', '🧑‍🎨', '👩‍🚀', '👨‍💼', '🧑‍🔬']

interface SelectedTool {
  toolId: ToolName
  plan: string
  seats: number
  customSpend?: number
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function VisualBuilder() {
  const router = useRouter()

  const [teamSize,  setTeamSize]  = useState(4)
  const [useCase,   setUseCase]   = useState<UseCase>('coding')
  
  // Pre-populate with options matching the user mockup
  const [selected,  setSelected]  = useState<SelectedTool[]>([
    { toolId: 'cursor', plan: 'pro', seats: 1, customSpend: 0 },
    { toolId: 'chatgpt', plan: 'plus', seats: 1, customSpend: 0 },
    { toolId: 'figma', plan: 'professional', seats: 2, customSpend: 0 },
    { toolId: 'notion', plan: 'plus', seats: 3, customSpend: 0 },
  ])
  
  const [quickAdd,  setQuickAdd]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const fillPct = `${((teamSize - 1) / 99) * 100}%`
  const avatarCount = Math.min(Math.ceil((teamSize / 100) * 10) + 1, 10)

  const totalMonthly = selected.reduce((sum, s) => {
    const cfg = ALL_TOOLS.find(t => t.id === s.toolId)
    if (!cfg) return sum
    if (s.toolId === 'anthropic-api' || s.toolId === 'openai-api') {
      return sum + (s.customSpend ?? 100)
    }
    const plans = TOOL_PLANS[s.toolId]
    const plan = plans.find(p => p.id === s.plan) || plans[0]
    return sum + (plan?.price ?? 0) * s.seats
  }, 0)

  const addTool = (toolId: ToolName) => {
    if (selected.find(s => s.toolId === toolId)) return
    const defaultPlan = TOOL_PLANS[toolId][0]!.id
    setSelected(prev => [...prev, { 
      toolId, 
      plan: defaultPlan, 
      seats: 1, 
      customSpend: toolId.includes('-api') ? 100 : 0 
    }])
  }

  const removeTool = (toolId: ToolName) => {
    setSelected(prev => prev.filter(t => t.toolId !== toolId))
  }

  const changePlan = (toolId: ToolName, plan: string) => {
    setSelected(prev => prev.map(t => t.toolId === toolId ? { ...t, plan } : t))
  }

  const changeCustomSpend = (toolId: ToolName, spend: number) => {
    setSelected(prev => prev.map(t => t.toolId === toolId ? { ...t, customSpend: Math.max(0, spend) } : t))
  }

  const adjustSeats = (toolId: ToolName, delta: number) => {
    setSelected(prev => prev.map(t => t.toolId === toolId ? { ...t, seats: Math.max(1, t.seats + delta) } : t))
  }

  const suggestions = quickAdd.length > 0
    ? ALL_TOOLS.filter(t =>
        (t.label.toLowerCase().includes(quickAdd.toLowerCase()) ||
         t.id.toLowerCase().includes(quickAdd.toLowerCase())) &&
        !selected.find(s => s.toolId === t.id)
      ).slice(0, 5)
    : []

  const handleSubmit = async () => {
    if (selected.length === 0) { setSubmitErr('Please select at least one tool.'); return }
    setLoading(true); setSubmitErr(null)
    try {
      const tools = selected.map(s => {
        let monthlySpend = 0
        if (s.toolId === 'anthropic-api' || s.toolId === 'openai-api') {
          monthlySpend = s.customSpend ?? 100
        } else {
          const plans = TOOL_PLANS[s.toolId]
          const plan = plans.find(p => p.id === s.plan) || plans[0]
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
      const { slug } = await res.json() as { slug: string }
      await new Promise(r => setTimeout(r, 1800))
      router.push(`/audit/${slug}`)
    } catch {
      setSubmitErr('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-10">

      {/* ═══════════════════════ STEP 1 CARD ════════════════════════════ */}
      <div className="bg-white/90 backdrop-blur border border-purple-100/80 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-center justify-between transition-all">
        <div className="max-w-md w-full shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Step 1 of 3</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4 leading-snug">How many people are in your team?</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Set size so we can customize the recommendations and seat adjustments.
          </p>
        </div>

        <div className="flex-1 w-full max-w-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Team Size</span>
            <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-100">
              {teamSize === 100 ? '100+' : teamSize}
            </span>
          </div>
          {/* Emoji strip */}
          <div className="relative h-7 mb-1 overflow-hidden">
            <div
              className="absolute top-0 flex transition-all duration-200"
              style={{ left: `clamp(0px, calc(${fillPct} - ${avatarCount * 11}px), calc(100% - ${avatarCount * 22}px))` }}
            >
              {AVATARS.slice(0, avatarCount).map((av, i) => (
                <span key={i} style={{ fontSize: 17 }} className="mr-1">{av}</span>
              ))}
            </div>
          </div>
          <input
            type="range" min={1} max={100} value={teamSize}
            onChange={e => setTeamSize(Number(e.target.value))}
            className="team-slider w-full"
            style={{ '--fill-pct': fillPct } as React.CSSProperties}
            aria-label="Team size"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
            <span>1</span><span>25</span><span>50</span><span>75</span><span>100+</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ STEP 2 CARD ════════════════════════════ */}
      <div className="bg-white/90 backdrop-blur border border-purple-100/80 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row gap-8 items-start justify-between transition-all">
        <div className="max-w-md w-full shrink-0">
          <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Step 2 of 3</span>
          <h2 className="text-xl font-bold text-gray-900 mt-4 leading-snug">What best describes your primary use case?</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            We'll customize recommendations based on your work.
          </p>
        </div>

        <div className="flex-1 w-full max-w-xl flex flex-col gap-3">
          {USE_CASES.map(uc => {
            const isSelected = useCase === uc.id
            return (
              <button
                key={uc.id} type="button"
                className={`flex items-center justify-between p-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected 
                    ? 'border-purple-600 bg-purple-50/50 shadow-md ring-1 ring-purple-600' 
                    : 'border-gray-100 bg-white hover:border-purple-200 hover:shadow-sm'
                }`}
                onClick={() => setUseCase(uc.id)}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{uc.emoji}</span>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{uc.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {uc.id === 'coding' && 'Building products, coding, and technical workflows'}
                      {uc.id === 'writing' && 'Content, campaigns, growth, and analytics'}
                      {uc.id === 'data' && 'UI/UX, creative, and visual content'}
                      {uc.id === 'research' && 'Data analysis, insights, and reporting'}
                      {uc.id === 'mixed' && 'Cross-functional or multiple departments'}
                    </p>
                  </div>
                </div>
                {isSelected ? (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
                    ✓
                  </div>
                ) : (
                  <span className="text-gray-300 text-sm">➔</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ═══════════════════════ STEP 3 CARD ════════════════════════════ */}
      <div className="bg-white/90 backdrop-blur border border-purple-100/80 rounded-3xl p-8 shadow-xl flex flex-col gap-8 transition-all">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">Step 3 of 3</span>
            <h2 className="text-xl font-bold text-gray-900 mt-4 leading-snug">Add the tools you're paying for</h2>
            <p className="text-sm text-gray-500 mt-1">
              Select the tools in your stack and we'll calculate your total spend.
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-400 focus-within:border-purple-300 focus-within:bg-white transition-colors">
              <Search size={14} className="text-gray-400" />
              <input
                value={quickAdd}
                onChange={e => setQuickAdd(e.target.value)}
                placeholder="Search tools..."
                className="bg-transparent border-none outline-none w-full text-gray-700 text-sm placeholder-gray-400 font-sans"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="absolute right-0 top-11 z-10 w-full bg-white border border-purple-100 shadow-xl rounded-2xl p-2 flex flex-col gap-1">
                {suggestions.map(s => (
                  <button
                    key={s.id} type="button"
                    onClick={() => { addTool(s.id); setQuickAdd('') }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-purple-50 text-left w-full transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm shrink-0" style={{ background: s.iconBg, color: s.iconText }}>
                      {s.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{s.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Active List */}
        <div className="flex flex-col gap-3">
          {selected.map(item => {
            const cfg = ALL_TOOLS.find(t => t.id === item.toolId)!
            const plans = TOOL_PLANS[item.toolId]
            const currentPlan = plans.find(p => p.id === item.plan) || plans[0]!
            const isApi = item.toolId === 'anthropic-api' || item.toolId === 'openai-api'
            const itemPrice = isApi ? (item.customSpend ?? 100) : (currentPlan?.price ?? 0) * item.seats

            return (
              <div key={item.toolId} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/50 border border-purple-50 rounded-2xl shadow-sm hover:shadow transition-all">
                {/* Tool Meta */}
                <div className="flex items-center gap-3 w-48 shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm shrink-0" style={{ background: cfg.iconBg, color: cfg.iconText }}>
                    {cfg.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{cfg.label}</p>
                  </div>
                </div>

                {/* Plan Dropdown */}
                <div className="flex-1 min-w-[150px]">
                  <select
                    value={item.plan}
                    onChange={e => changePlan(item.toolId, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 outline-none focus:border-purple-300 shadow-sm cursor-pointer hover:border-gray-300 transition-colors"
                  >
                    {plans.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>

                {/* Seats or Custom Spend */}
                <div className="flex items-center justify-end gap-6 ml-auto">
                  {isApi ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">SPEND</span>
                      <div className="flex items-center bg-white border border-gray-200 rounded-xl px-2 py-1 shadow-sm w-28">
                        <span className="text-xs text-gray-400 font-bold">$</span>
                        <input
                          type="number"
                          value={item.customSpend ?? 100}
                          onChange={e => changeCustomSpend(item.toolId, Number(e.target.value))}
                          className="bg-transparent border-none outline-none w-full text-xs font-bold text-gray-700 text-right px-1"
                        />
                        <span className="text-[10px] text-gray-400">/mo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-[9px] font-bold text-gray-400 tracking-wider uppercase mb-1">Seats</span>
                      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                        <button type="button" className="w-6 h-6 rounded-lg bg-gray-50 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors font-bold text-xs"
                          onClick={() => adjustSeats(item.toolId, -1)}>-</button>
                        <span className="text-xs font-bold text-gray-700 w-4 text-center">{item.seats}</span>
                        <button type="button" className="w-6 h-6 rounded-lg bg-gray-50 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors font-bold text-xs"
                          onClick={() => adjustSeats(item.toolId, 1)}>+</button>
                      </div>
                    </div>
                  )}

                  {/* Price info */}
                  <div className="w-20 text-right">
                    <p className="text-sm font-black text-gray-800">${itemPrice}<span className="text-[10px] font-normal text-gray-400">/mo</span></p>
                  </div>

                  {/* Delete */}
                  <button type="button" className="text-gray-300 hover:text-red-500 transition-colors text-sm font-semibold p-1"
                    onClick={() => removeTool(item.toolId)}>×</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Available Catalog Grid */}
        {ALL_TOOLS.filter(t => !selected.find(s => s.toolId === t.id)).length > 0 && (
          <div className="mt-4 pt-6 border-t border-gray-100">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Add more tools to your stack:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {ALL_TOOLS.filter(t => !selected.find(s => s.toolId === t.id)).map(tool => (
                <button
                  key={tool.id} type="button"
                  onClick={() => addTool(tool.id)}
                  className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-2xl hover:border-purple-300 hover:shadow-sm hover:translate-y-[-1px] transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm shrink-0" style={{ background: tool.iconBg, color: tool.iconText }}>
                    {tool.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{tool.label}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">Click to add</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Spend Tracker Sticky-like card at bottom */}
      <div className="bg-purple-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300">Stack Spend Summary</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-black">${totalMonthly}</span>
            <span className="text-sm font-semibold text-purple-300">/ month</span>
            <span className="text-xs text-purple-400 font-medium ml-2">({selected.length} tools configured)</span>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col gap-2">
          {submitErr && (
            <p role="alert" className="text-xs text-red-200 bg-red-900/50 border border-red-500/30 px-3 py-1.5 rounded-xl">{submitErr}</p>
          )}
          <SubmitProgress active={loading} />
          
          <button
            type="button" disabled={loading} onClick={handleSubmit}
            className="w-full md:w-64 min-h-[50px] bg-white text-purple-900 hover:bg-purple-50 rounded-2xl font-bold text-base transition-all shadow-lg active:scale-95 hover:shadow-xl"
          >
            {loading ? 'Running audit…' : 'Get my free audit →'}
          </button>
        </div>
      </div>

    </div>
  )
}
