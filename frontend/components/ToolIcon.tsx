import type { ToolName } from '@backend/lib/types'
import { cn } from '@/lib/utils'

const INITIALS: Record<ToolName, string> = {
  cursor: 'Cu',
  'github-copilot': 'CP',
  claude: 'Cl',
  chatgpt: 'GP',
  'anthropic-api': 'An',
  'openai-api': 'OA',
  gemini: 'Ge',
  windsurf: 'Ws',
  figma: 'Fg',
  notion: 'No',
}

interface Props {
  tool: ToolName
  size?: 'sm' | 'md'
}

export default function ToolIcon({ tool, size = 'md' }: Props) {
  const sizeClasses = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-[11px]'

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded bg-zinc-100 font-semibold text-zinc-700',
        sizeClasses
      )}
      aria-hidden="true"
    >
      {INITIALS[tool] ?? '??'}
    </span>
  )
}
