import ToolBadge from './ToolBadge'

const TOOL_TILES = [
  {
    tool: 'cursor' as const,
    name: 'Cursor',
    detail: 'Business, $40/seat',
    overspend: true,
    className:
      'absolute top-[35%] left-[2%] w-[250px] max-w-[250px] bg-[#d3e2ed]/85 backdrop-blur-sm -rotate-[0.5deg] z-30',
  },
  {
    tool: 'chatgpt' as const,
    name: 'ChatGPT',
    detail: 'Team, $30/seat',
    overspend: true,
    className:
      'absolute top-[48%] right-[1%] w-[250px] max-w-[250px] bg-[#c8d8e5]/85 backdrop-blur-sm rotate-[0.5deg] z-40',
  },
  {
    tool: 'github-copilot' as const,
    name: 'Copilot',
    detail: 'Individual, $10/seat',
    overspend: false,
    className:
      'absolute top-[61%] left-[0%] w-[250px] max-w-[250px] bg-[#dae6f1]/85 backdrop-blur-sm -rotate-1 z-30',
  },
  {
    tool: 'claude' as const,
    name: 'Claude Pro',
    detail: '$20/seat',
    overspend: false,
    className:
      'absolute top-[73%] right-[5%] w-[245px] max-w-[245px] bg-[#c3d4e2]/85 backdrop-blur-sm rotate-[0.5deg] z-20',
  },
] as const

function OverspendBadge() {
  return (
    <span className="bg-[#446577]/15 text-[#3d5969] font-black text-[7px] px-1.5 py-0.5 rounded-md tracking-wide shrink-0">
      OVERSPEND
    </span>
  )
}

function StackCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`premium-border premium-stack-shadow shrink-0 ${className}`}>
      {children}
    </div>
  )
}

export default function HeroVisualStack() {
  return (
    <div className="relative w-[480px] max-w-[480px] h-[560px] shrink-0 select-none">
      <StackCard className="absolute top-[8%] left-[10%] w-[215px] max-w-[215px] bg-[#e1edf6]/90 backdrop-blur-md px-5 py-3 rounded-2xl -rotate-1 z-10">
        <div className="text-[9px] font-extrabold tracking-wider text-[#5a7185]">
          TOTAL MONTHLY SPEND:
        </div>
        <div className="text-2xl font-black text-[#446577] tracking-tight mt-0.5">$1,240</div>
      </StackCard>

      <StackCard className="absolute top-[20%] right-[4%] w-[180px] max-w-[180px] bg-[#d7e5f1]/90 backdrop-blur-md px-5 py-3 rounded-2xl rotate-1 z-20">
        <div className="text-[9px] font-extrabold tracking-wider text-[#5a7185]">
          SAVINGS FOUND:
        </div>
        <div className="text-2xl font-black text-[#446577] tracking-tight mt-0.5">$380</div>
      </StackCard>

      {TOOL_TILES.map((tile) => (
        <StackCard
          key={tile.name}
          className={`${tile.className} p-3 rounded-xl flex items-center gap-3`}
        >
          <ToolBadge tool={tile.tool} size={36} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="font-extrabold text-[13px] text-[#1d2d3c] tracking-tight truncate">
                {tile.name}
              </span>
              {tile.overspend && <OverspendBadge />}
            </div>
            <div className="text-[11px] text-[#55697c] font-medium">{tile.detail}</div>
          </div>
        </StackCard>
      ))}

      <StackCard className="absolute bottom-[5%] left-[10%] w-[270px] max-w-[270px] bg-[#dbe6f0]/95 backdrop-blur-md px-5 py-3.5 rounded-xl -rotate-[0.5deg] z-50">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-[#4c6275]">Optimisation score:</span>
          <span className="text-[13px] font-black text-[#1d2d3c]">62%</span>
        </div>
        <div className="w-full bg-[#becee0] h-[10px] rounded-full p-[2px] flex items-center shadow-inner">
          <div className="bg-[#446577] h-full rounded-full" style={{ width: '62%' }} />
        </div>
      </StackCard>
    </div>
  )
}
