// components/ToolBadge.tsx
import React from 'react'

const TOOL_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  cursor:          { bg: '#0a0a0a', text: '#ffffff', label: 'Cu' },
  'github-copilot':{ bg: '#24292e', text: '#ffffff', label: 'GH' },
  claude:          { bg: '#c96442', text: '#ffffff', label: 'Cl' },
  chatgpt:         { bg: '#10a37f', text: '#ffffff', label: 'GP' },
  'anthropic-api': { bg: '#c96442', text: '#ffffff', label: 'An' },
  'openai-api':    { bg: '#000000', text: '#ffffff', label: 'OA' },
  gemini:          { bg: '#4285f4', text: '#ffffff', label: 'Ge' },
  windsurf:        { bg: '#0ea5e9', text: '#ffffff', label: 'Ws' },
  figma:           { bg: '#f24e1e', text: '#ffffff', label: 'Fi' },
  notion:          { bg: '#000000', text: '#ffffff', label: 'No' },
}

export default function ToolBadge({ tool, size = 38 }: { tool: string; size?: number }) {
  const config = TOOL_COLORS[tool] ?? { bg: '#6b6a66', text: '#fff', label: tool.slice(0,2).toUpperCase() }
  return (
    <div style={{
      width: size, height: size,
      borderRadius: size * 0.26,
      background: config.bg,
      color: config.text,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.32, fontWeight: 700, flexShrink: 0,
      fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px'
    }}>
      {config.label}
    </div>
  )
}
