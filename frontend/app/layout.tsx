import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'AI Spend Audit — Credex',
  description: 'Audit your AI tool stack and find overspend in under two minutes.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn(inter.variable, 'font-sans')}>
      <body>{children}</body>
    </html>
  )
}
