'use client'

import { useState, useRef, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Search } from 'lucide-react'
import SubmitProgress from './SubmitProgress'
import type { ToolName, UseCase } from '@backend/lib/types'

// ─── Tool catalogue ───────────────────────────────────────────────────────────
interface ToolCfg {
  id: ToolName
  label: string
  pricePerSeat: number
  iconBg: string
  iconText: string
  initials: string
}

const ALL_TOOLS: ToolCfg[] = [
  { id: 'cursor',         label: 'Cursor',        pricePerSeat: 20, iconBg: '#ede9fe', iconText: '#6d28d9', initials: 'Cu' },
  { id: 'chatgpt',        label: 'ChatGPT',       pricePerSeat: 30, iconBg: '#d1fae5', iconText: '#065f46', initials: 'GP' },
  { id: 'claude',         label: 'Claude',        pricePerSeat: 20, iconBg: '#fef3c7', iconText: '#92400e', initials: 'Cl' },
  { id: 'gemini',         label: 'Gemini',        pricePerSeat: 20, iconBg: '#dbeafe', iconText: '#1e40af', initials: 'Ge' },
  { id: 'github-copilot', label: 'Copilot',       pricePerSeat: 19, iconBg: '#1f2937', iconText: '#ffffff', initials: 'GC' },
  { id: 'windsurf',       label: 'Windsurf',      pricePerSeat: 20, iconBg: '#cffafe', iconText: '#155e75', initials: 'Ws' },
  { id: 'anthropic-api',  label: 'Anthropic API', pricePerSeat: 0,  iconBg: '#fde8d8', iconText: '#9a3412', initials: 'An' },
  { id: 'openai-api',     label: 'OpenAI API',    pricePerSeat: 0,  iconBg: '#f0fdf4', iconText: '#166534', initials: 'OA' },
]

const USE_CASES: { id: UseCase; label: string; emoji: string }[] = [
  { id: 'coding',   label: 'Engineering', emoji: '💻' },
  { id: 'writing',  label: 'Marketing',   emoji: '📣' },
  { id: 'data',     label: 'Design',      emoji: '🎨' },
  { id: 'research', label: 'Research',    emoji: '🔬' },
  { id: 'mixed',    label: 'Mixed',       emoji: '✨' },
]

const AVATARS = ['🧑', '👩', '👨', '🧑‍💻', '👩‍💼', '👨‍🔬', '🧑‍🎨', '👩‍🚀', '👨‍💼', '🧑‍🔬']

interface SelectedTool { toolId: ToolName; seats: number }

// ─── Shared state via context so both panels share one state ──────────────────
interface FormCtx {
  teamSize: number
  setTeamSize: (v: number) => void
  useCase: UseCase
  setUseCase: (v: UseCase) => void
  selected: SelectedTool[]
  toggleTool: (id: ToolName) => void
  adjustSeats: (id: ToolName, d: number) => void
  quickAdd: string
  setQuickAdd: (v: string) => void
  suggestions: ToolCfg[]
  addSuggestion: (id: ToolName) => void
  handleQuickAdd: (e: React.KeyboardEvent<HTMLInputElement>) => void
  loading: boolean
  submitErr: string | null
  handleSubmit: () => void
}

const Ctx = createContext<FormCtx | null>(null)
const useCtx = () => useContext(Ctx)!

// ─── Provider (used by the FIRST panel rendered) ──────────────────────────────
// Because both <SpendForm panel="left"> and <SpendForm panel="right"> are in the
// same server component tree, we lift state into a single client wrapper.

function FormProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [teamSize,  setTeamSize]  = useState(4)
  const [useCase,   setUseCase]   = useState<UseCase>('coding')
  const [selected,  setSelected]  = useState<SelectedTool[]>([])
  const [quickAdd,  setQuickAdd]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const toggleTool = (toolId: ToolName) =>
    setSelected(prev =>
      prev.find(t => t.toolId === toolId)
        ? prev.filter(t => t.toolId !== toolId)
        : [...prev, { toolId, seats: 1 }]
    )

  const adjustSeats = (toolId: ToolName, delta: number) =>
    setSelected(prev =>
      prev.map(t => t.toolId === toolId ? { ...t, seats: Math.max(1, t.seats + delta) } : t)
    )

  const suggestions = quickAdd.length > 0
    ? ALL_TOOLS.filter(t =>
        (t.label.toLowerCase().includes(quickAdd.toLowerCase()) ||
         t.id.toLowerCase().includes(quickAdd.toLowerCase())) &&
        !selected.find(s => s.toolId === t.id)
      ).slice(0, 5)
    : []

  const addSuggestion = (toolId: ToolName) => {
    setSelected(prev => [...prev, { toolId, seats: 1 }])
    setQuickAdd('')
  }

  const handleQuickAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const match = ALL_TOOLS.find(t =>
      t.label.toLowerCase().includes(quickAdd.toLowerCase()) ||
      t.id.toLowerCase().includes(quickAdd.toLowerCase())
    )
    if (match && !selected.find(s => s.toolId === match.id)) {
      setSelected(prev => [...prev, { toolId: match.id, seats: 1 }])
    }
    setQuickAdd('')
  }

  const handleSubmit = async () => {
    if (selected.length === 0) { setSubmitErr('Please select at least one tool.'); return }
    setLoading(true); setSubmitErr(null)
    try {
      const tools = selected.map(s => {
        const cfg = ALL_TOOLS.find(t => t.id === s.toolId)!
        return { tool: s.toolId, plan: 'pro', monthlySpend: cfg.pricePerSeat * s.seats, seats: s.seats }
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
    <Ctx.Provider value={{
      teamSize, setTeamSize, useCase, setUseCase,
      selected, toggleTool, adjustSeats,
      quickAdd, setQuickAdd, suggestions, addSuggestion, handleQuickAdd,
      loading, submitErr, handleSubmit,
    }}>
      {children}
    </Ctx.Provider>
  )
}

// ─── Left panel: slider + use case ───────────────────────────────────────────
function LeftPanel() {
  const { teamSize, setTeamSize, useCase, setUseCase, selected } = useCtx()
  const fillPct = `${((teamSize - 1) / 99) * 100}%`
  const avatarCount = Math.min(Math.ceil((teamSize / 100) * 10) + 1, 10)

  const totalMonthly = selected.reduce((sum, s) => {
    const cfg = ALL_TOOLS.find(t => t.id === s.toolId)
    return sum + (cfg?.pricePerSeat ?? 0) * s.seats
  }, 0)

  return (
    <div className="h-full flex flex-col gap-7">

      {/* Hero copy */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Step 1</p>
        <h2 className="text-lg font-bold text-gray-800 leading-snug">
          Tell us about<br />your team
        </h2>
        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
          Set your team size and primary use case so we can tailor the audit.
        </p>
      </div>

      {/* Team size */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Team Size</span>
          <span className="text-sm font-bold text-purple-600 bg-purple-50 px-3 py-0.5 rounded-full border border-purple-100">
            {teamSize === 100 ? '100+' : teamSize}
          </span>
        </div>
        {/* Avatar strip */}
        <div className="relative h-8 mb-1 overflow-hidden">
          <div
            className="absolute top-0 flex transition-all duration-200"
            style={{ left: `clamp(0px, calc(${fillPct} - ${avatarCount * 12}px), calc(100% - ${avatarCount * 22}px))` }}
          >
            {AVATARS.slice(0, avatarCount).map((av, i) => (
              <span key={i} style={{ fontSize: 18 }}>{av}</span>
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

      {/* Use case */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Use Case</p>
        <div className="flex flex-col gap-2">
          {USE_CASES.map(uc => (
            <button
              key={uc.id} type="button"
              className={`use-pill justify-start${useCase === uc.id ? ' active' : ''}`}
              onClick={() => setUseCase(uc.id)}
            >
              <span>{uc.emoji}</span>
              {uc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mini spend summary */}
      {selected.length > 0 && (
        <div className="mt-auto bg-purple-50 border border-purple-100 rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-1">Current spend</p>
          <p className="text-2xl font-black text-purple-700">${totalMonthly}<span className="text-sm font-medium text-purple-400">/mo</span></p>
          <p className="text-xs text-purple-500 mt-0.5">{selected.length} tool{selected.length > 1 ? 's' : ''} selected</p>
        </div>
      )}
    </div>
  )
}

// ─── Right panel: tool grid + quick-add + submit ──────────────────────────────
function RightPanel() {
  const { selected, toggleTool, adjustSeats, quickAdd, setQuickAdd,
          suggestions, addSuggestion, handleQuickAdd, loading, submitErr, handleSubmit } = useCtx()

  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Step 2</p>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Select your tools</h2>
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-400">
            <Search size={11} />
            <span>Search</span>
          </div>
        </div>
      </div>

      {/* Tool grid — 4 columns on wide, 3 on medium */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 flex-1">
        {ALL_TOOLS.map(tool => {
          const sel = selected.find(s => s.toolId === tool.id)
          const isSelected = !!sel
          return (
            <div
              key={tool.id}
              className={`tool-card${isSelected ? ' selected' : ''}`}
              onClick={() => toggleTool(tool.id)}
            >
              <div className="absolute top-2.5 right-2.5">
                <span className="text-[9px] font-bold text-gray-400 bg-gray-100 rounded-full px-1.5 py-0.5">
                  {tool.pricePerSeat === 0 ? 'usage' : `$${tool.pricePerSeat}`}
                </span>
              </div>
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm mb-2 mx-auto shadow-sm"
                style={{ background: tool.iconBg, color: tool.iconText }}
              >
                {tool.initials}
              </div>
              <p className="text-xs font-semibold text-center text-gray-800 mb-2.5 leading-tight">{tool.label}</p>
              <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                <button type="button" className="counter-btn"
                  onClick={() => isSelected && adjustSeats(tool.id, -1)}
                  disabled={!isSelected} aria-label="Decrease">−</button>
                <span className="text-xs font-bold text-gray-700 w-4 text-center">{sel?.seats ?? 1}</span>
                <button type="button" className="counter-btn"
                  onClick={() => isSelected ? adjustSeats(tool.id, 1) : toggleTool(tool.id)}
                  aria-label="Increase">+</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick add bar */}
      <div className="relative">
        <div className="quick-add-bar">
          <span className="text-[11px] font-semibold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded shrink-0">
            Quick Add
          </span>
          <input
            value={quickAdd}
            onChange={e => setQuickAdd(e.target.value)}
            onKeyDown={handleQuickAdd}
            placeholder="Type tool name or use AI suggestion…"
            aria-label="Quick add tool"
          />
          <button type="button"
            className="text-[11px] font-semibold text-purple-300 hover:text-white transition-colors shrink-0"
            onClick={() => handleQuickAdd({ key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>)}
          >Add</button>
        </div>
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestions.map(s => (
              <button key={s.id} type="button"
                onClick={() => addSuggestion(s.id)}
                className="text-[11px] font-medium bg-white border border-purple-200 text-purple-700 rounded-full px-3 py-1 hover:bg-purple-50 transition-colors">
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {submitErr && (
        <p role="alert" className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{submitErr}</p>
      )}
      <SubmitProgress active={loading} />

      <button
        type="button" disabled={loading} onClick={handleSubmit}
        className="w-full min-h-[52px] rounded-2xl font-semibold text-base transition-all shadow-lg"
        style={{
          background: loading ? '#9ca3af' : 'linear-gradient(135deg, #7c6fe0 0%, #6366f1 100%)',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running audit…' : 'Get my free audit →'}
      </button>
    </div>
  )
}

// ─── Public export — single entry point, split by panel prop ─────────────────
export default function SpendForm({ panel }: { panel: 'left' | 'right' }) {
  // The provider must wrap BOTH panels. Since Next.js renders both in the same
  // component tree from page.tsx, we wrap the provider at the module level
  // using a singleton via React context + a shared wrapper rendered in page.tsx.
  // Here we just render the appropriate sub-panel.
  if (panel === 'left')  return <FormProvider><LeftPanel /></FormProvider>
  return <RightPanel />
}
