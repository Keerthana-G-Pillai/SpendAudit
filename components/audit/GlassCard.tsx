export default function GlassCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-white/70 bg-white/75 backdrop-blur-md premium-stack-shadow ${className}`}
    >
      {children}
    </div>
  )
}
