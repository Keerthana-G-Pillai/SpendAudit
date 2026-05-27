import './globals.css'
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
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
    <html lang="en" className={cn(fontSans.variable, 'font-sans')}>
      <body className={cn(fontSans.className, 'antialiased')}>{children}</body>
    </html>
  )
}
