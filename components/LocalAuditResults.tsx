'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AuditResults from './AuditResults'
import type { PublicAuditData } from '@/lib/types'

export const LOCAL_AUDIT_STORAGE_KEY = 'credex_local_audit'

export default function LocalAuditResults() {
  const [data, setData] = useState<PublicAuditData | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LOCAL_AUDIT_STORAGE_KEY)
      if (raw) {
        setData(JSON.parse(raw) as PublicAuditData)
      }
    } catch {
      // Ignore storage/parse errors
    } finally {
      setChecked(true)
    }
  }, [])

  if (!checked) {
    return (
      <div className="min-h-screen hero-creme-vignette flex items-center justify-center">
        <p className="text-sm font-semibold text-[#567C8D]">Loading your audit report…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen hero-creme-vignette flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-2xl font-bold text-[#2F4156]">No audit report found</h1>
        <p className="mt-2 text-sm text-[#567C8D]">
          Run a new audit to view your AI spend report.
        </p>
        <Link
          href="/#audit-step-1"
          className="mt-6 inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold bg-[#2F4156] text-white"
        >
          Run free audit
        </Link>
      </div>
    )
  }

  return <AuditResults data={data} />
}
