import type { ToolName } from '@/lib/types'
import ToolBadge from './ToolBadge'

interface Props {
  tool: ToolName
  size?: 'sm' | 'md'
}

export default function ToolIcon({ tool, size = 'md' }: Props) {
  const pixelSize = size === 'sm' ? 32 : 48
  return <ToolBadge tool={tool} size={pixelSize} />
}
