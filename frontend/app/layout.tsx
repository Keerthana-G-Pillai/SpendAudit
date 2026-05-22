import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

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
    <html lang="en" className={cn('font-sans', inter.variable)}>
      <body className="antialiased text-foreground bg-background">{children}</body>
    </html>
  )
}
