'use client'

import { useState, useRef } from 'react'
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
  emoji?: string
}

const ALL_TOOLS: ToolCfg[] = [
  { id: 'cursor',         label: 'Cursor',          pricePerSeat: 20, iconBg: '#ede9fe', iconText: '#6d28d9', initials: 'Cu' },
  { id: 'chatgpt',        label: 'ChatGPT',         pricePerSeat: 30, iconBg: '#d1fae5', iconText: '#065f46', initials: 'GP' },
  { id: 'claude',         label: 'Claude',          pricePerSeat: 20, iconBg: '#fef3c7', iconText: '#92400e', initials: 'Cl' },
  { id: 'gemini',         label: 'Gemini',          pricePerSeat: 20, iconBg: '#dbeafe', iconText: '#1e40af', initials: 'Ge' },
  { id: 'github-copilot', label: 'Copilot',         pricePerSeat: 19, iconBg: '#1f2937', iconText: '#ffffff', initials: 'GC' },
  { id: 'windsurf',       label: 'Windsurf',        pricePerSeat: 15, iconBg: '#cffafe', iconText: '#155e75', initials: 'Ws' },
  { id: 'anthropic-api',  label: 'Anthropic API',   pricePerSeat: 0,  iconBg: '#fde8d8', iconText: '#9a3412', initials: 'An' },
  { id: 'openai-api',     label: 'OpenAI API',      pricePerSeat: 0,  iconBg: '#f0fdf4', iconText: '#166534', initials: 'OA' },
]

// ─── Use cases ────────────────────────────────────────────────────────────────
const USE_CASES: { id: UseCase; label: string; emoji: string }[] = [
  { id: 'coding',   label: 'Engineering', emoji: '💻' },
  { id: 'writing',  label: 'Marketing',   emoji: '📣' },
  { id: 'data',     label: 'Design',      emoji: '🎨' },
  { id: 'research', label: 'Research',    emoji: '🔬' },
  { id: 'mixed',    label: 'Mixed',       emoji: '✨' },
]

// ─── Avatars shown on slider ──────────────────────────────────────────────────
const AVATARS = ['🧑', '👩', '👨', '🧑‍💻', '👩‍💼', '👨‍🔬', '🧑‍🎨', '👩‍🚀', '👨‍💼', '🧑‍🔬']

// ─── Component ────────────────────────────────────────────────────────────────
interface SelectedTool { toolId: ToolName; seats: number }

export default function SpendForm() {
  const router = useRouter()

  // form state
  const [teamSize,  setTeamSize]  = useState(4)
  const [useCase,   setUseCase]   = useState<UseCase>('coding')
  const [selected,  setSelected]  = useState<SelectedTool[]>([])
  const [quickAdd,  setQuickAdd]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // slider fill % for CSS
  const fillPct = `${((teamSize - 1) / 99) * 100}%`

  // how many avatars to show (up to 10)
  const avatarCount = Math.min(Math.ceil((teamSize / 100) * 10) + 1, 10)

  // toggle a tool card on/off
  const toggleTool = (toolId: ToolName) => {
    setSelected(prev => {
      const exists = prev.find(t => t.toolId === toolId)
      return exists
        ? prev.filter(t => t.toolId !== toolId)
        : [...prev, { toolId, seats: 1 }]
    })
  }

  // adjust seats for a selected tool
  const adjustSeats = (toolId: ToolName, delta: number) => {
    setSelected(prev =>
      prev.map(t =>
        t.toolId === toolId
          ? { ...t, seats: Math.max(1, t.seats + delta) }
          : t
      )
    )
  }

  // quick-add via keyboard
  const handleQuickAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    const q = quickAdd.toLowerCase().trim()
    const match = ALL_TOOLS.find(t =>
      t.label.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)
    )
    if (match && !selected.find(s => s.toolId === match.id)) {
      setSelected(prev => [...prev, { toolId: match.id, seats: 1 }])
    }
    setQuickAdd('')
  }

  // filtered suggestions
  const suggestions = quickAdd.length > 0
    ? ALL_TOOLS.filter(t =>
        (t.label.toLowerCase().includes(quickAdd.toLowerCase()) ||
         t.id.toLowerCase().includes(quickAdd.toLowerCase())) &&
        !selected.find(s => s.toolId === t.id)
      ).slice(0, 4)
    : []

  // submit
  const handleSubmit = async () => {
    if (selected.length === 0) {
      setSubmitErr('Please select at least one tool.')
      return
    }
    setLoading(true)
    setSubmitErr(null)
    try {
      const tools = selected.map(s => {
        const cfg = ALL_TOOLS.find(t => t.id === s.toolId)!
        return {
          tool: s.toolId,
          plan: 'pro',
          monthlySpend: cfg.pricePerSeat * s.seats,
          seats: s.seats,
        }
      })
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamSize, useCase, tools }),
      })
      if (!res.ok) throw new Error('Audit failed')
      const { slug } = await res.json() as { slug: string }
      await new Promise(r => setTimeout(r, 1800))
      router.push(`/audit/${slug}`)
    } catch {
      setSubmitErr('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">

      {/* ── Team size slider ─────────────────────────────────── */}
      <div className="anim-2">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Team Size</span>
          <span className="text-sm font-bold text-[#7c6fe0] bg-purple-50 px-3 py-0.5 rounded-full">
            {teamSize === 100 ? '100+' : teamSize}
          </span>
        </div>

        {/* Avatar strip */}
        <div className="relative h-8 mb-1">
          <div
            className="absolute top-0 flex gap-0.5 transition-all duration-200"
            style={{ left: `calc(${fillPct} - ${avatarCount * 10}px)` }}
          >
            {AVATARS.slice(0, avatarCount).map((av, i) => (
              <span key={i} className="text-base leading-none" style={{ fontSize: 18 }}>{av}</span>
            ))}
          </div>
        </div>

        <input
          type="range"
          min={1}
          max={100}
          value={teamSize}
          onChange={e => setTeamSize(Number(e.target.value))}
          className="team-slider w-full"
          style={{ '--fill-pct': fillPct } as React.CSSProperties}
          aria-label="Team size"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-medium">
          <span>1</span><span>25</span><span>50</span><span>75</span><span>100+</span>
        </div>
      </div>

      {/* ── Use case pills ───────────────────────────────────── */}
      <div className="anim-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Use Case</p>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map(uc => (
            <button
              key={uc.id}
              type="button"
              className={`use-pill${useCase === uc.id ? ' active' : ''}`}
              onClick={() => setUseCase(uc.id)}
            >
              <span>{uc.emoji}</span>
              {uc.label}
            </button>
          ))}
          <button
            type="button"
            className="use-pill"
            title="More options"
            style={{ padding: '8px 12px' }}
          >
            <Sparkles size={14} />
          </button>
        </div>
      </div>

      {/* ── Tool cards grid ──────────────────────────────────── */}
      <div className="anim-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Drag-and-drop tools</p>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-400">
            <Search size={11} />
            <span>Search Tool…</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {ALL_TOOLS.map(tool => {
            const sel = selected.find(s => s.toolId === tool.id)
            const isSelected = !!sel

            return (
              <div
                key={tool.id}
                className={`tool-card${isSelected ? ' selected' : ''}`}
                onClick={() => toggleTool(tool.id)}
              >
                {/* Price badge */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-0.5">
                    {tool.pricePerSeat === 0 ? 'usage' : `$${tool.pricePerSeat}/mo`}
                  </span>
                </div>

                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm mb-2 mx-auto"
                  style={{ background: tool.iconBg, color: tool.iconText }}
                >
                  {tool.initials}
                </div>

                {/* Name */}
                <p className="text-xs font-semibold text-center text-gray-800 mb-2 leading-tight">
                  {tool.label}
                </p>

                {/* Seat counter */}
                <div
                  className="flex items-center justify-center gap-2"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => isSelected ? adjustSeats(tool.id, -1) : undefined}
                    disabled={!isSelected}
                    aria-label="Decrease seats"
                  >
                    −
                  </button>
                  <span className="text-xs font-bold text-gray-700 w-4 text-center">
                    {sel?.seats ?? 1}
                  </span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => {
                      if (!isSelected) toggleTool(tool.id)
                      else adjustSeats(tool.id, 1)
                    }}
                    aria-label="Increase seats"
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick-add bar ────────────────────────────────────── */}
      <div className="anim-5 relative">
        <div className="quick-add-bar">
          <span className="text-[11px] font-semibold text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded">
            Quick Add
          </span>
          <input
            ref={inputRef}
            value={quickAdd}
            onChange={e => setQuickAdd(e.target.value)}
            onKeyDown={handleQuickAdd}
            placeholder="Type tool name or use AI suggestion…"
            aria-label="Quick add tool"
          />
          <button
            type="button"
            className="text-[11px] font-semibold text-purple-300 hover:text-white transition-colors"
            onClick={() => {
              const e = { key: 'Enter' } as React.KeyboardEvent<HTMLInputElement>
              handleQuickAdd(e)
            }}
          >
            Add
          </button>
        </div>

        {/* Suggestion pills */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {suggestions.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelected(prev => [...prev, { toolId: s.id, seats: 1 }])
                  setQuickAdd('')
                }}
                className="text-[11px] font-medium bg-white border border-purple-200 text-purple-700 rounded-full px-3 py-1 hover:bg-purple-50 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Error & progress ─────────────────────────────────── */}
      {submitErr && (
        <p role="alert" className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">
          {submitErr}
        </p>
      )}
      <SubmitProgress active={loading} />

      {/* ── Submit ───────────────────────────────────────────── */}
      <button
        type="button"
        disabled={loading}
        onClick={handleSubmit}
        className="w-full min-h-[52px] rounded-2xl font-semibold text-base transition-all shadow-lg"
        style={{
          background: loading
            ? '#9ca3af'
            : 'linear-gradient(135deg, #7c6fe0 0%, #6366f1 100%)',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running audit…' : 'Get my free audit →'}
      </button>
    </div>
  )
}
