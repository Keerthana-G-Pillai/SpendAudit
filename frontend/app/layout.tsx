import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Spend Audit — Credex',
  description: 'Free 2-minute audit of your AI subscriptions.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased text-gray-900">{children}</body>
    </html>
  )
}
