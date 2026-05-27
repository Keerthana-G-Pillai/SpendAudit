import VisualBuilder from '@/components/VisualBuilder'

export default function WidgetPage() {
  return (
    <div className="bg-transparent min-h-screen">
      <VisualBuilder isWidget={true} />
    </div>
  )
}
