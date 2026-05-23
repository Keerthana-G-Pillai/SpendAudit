import type { ToolName } from '@backend/lib/types'

const TOOL_CONFIG: Record<ToolName, { initials: string; bg: string; text: string }> = {
  cursor: { initials: 'Cu', bg: 'bg-violet-100', text: 'text-violet-700' },
  'github-copilot': { initials: 'GC', bg: 'bg-gray-900', text: 'text-white' },
  claude: { initials: 'Cl', bg: 'bg-orange-100', text: 'text-orange-700' },
  chatgpt: { initials: 'GP', bg: 'bg-emerald-100', text: 'text-emerald-700' },
  'anthropic-api': { initials: 'An', bg: 'bg-amber-100', text: 'text-amber-800' },
  'openai-api': { initials: 'OA', bg: 'bg-teal-100', text: 'text-teal-700' },
  gemini: { initials: 'Ge', bg: 'bg-blue-100', text: 'text-blue-700' },
  windsurf: { initials: 'Ws', bg: 'bg-cyan-100', text: 'text-cyan-700' },
}

interface Props {
  tool: ToolName
  size?: 'sm' | 'md'
}

export default function ToolIcon({ tool, size = 'md' }: Props) {
  const config = TOOL_CONFIG[tool] ?? { initials: '??', bg: 'bg-gray-100', text: 'text-gray-600' }
  const sizeClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm'

  return (
    <span
      className={`inline-flex items-center justify-center rounded-lg font-bold shrink-0 ${sizeClasses} ${config.bg} ${config.text}`}
      aria-hidden="true"
    >
      {config.initials}
    </span>
  )
}
