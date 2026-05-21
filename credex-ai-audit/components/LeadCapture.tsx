'use client'

import { useState } from 'react'

interface Props {
  slug: string
  auditId: string
  totalSavings: number
  onSuccess: () => void
  isOptimal: boolean
}

export default function LeadCapture({ slug, auditId, totalSavings, onSuccess, isOptimal }: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [honeypot, setHoneypot] = useState('') // Must stay empty for real users
  const [loading, setLoading] = useState(false)
  const [fieldError, setFieldError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email) {
      setFieldError('Please enter your email address.')
      return
    }

    setLoading(true)
    setFieldError(null)

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company,
          role,
          website: honeypot, // Honeypot field — API silently rejects if filled
          auditId,
          auditSlug: slug,
          totalSavings,
        }),
      })
      onSuccess()
    } catch {
      setFieldError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-gray-100 rounded-2xl p-6 space-y-4">
      <div>
        <p className="font-semibold text-gray-900">
          {isOptimal
            ? 'Get notified when new optimizations apply to your stack'
            : 'Get this audit in your inbox'}
        </p>
        <p className="text-sm text-gray-400 mt-0.5">
          {isOptimal
            ? 'We will alert you when pricing changes or better alternatives emerge.'
            : 'One email with your full audit summary and recommendations.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Honeypot — visually hidden, aria-hidden, no tab stop */}
        <input
          name="website"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0 }}
        />

        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Company (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <input
            type="text"
            placeholder="Role (optional)"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        {fieldError && (
          <p className="text-sm text-red-600">{fieldError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send me the audit'}
        </button>

        <p className="text-xs text-gray-400 text-center">
          No spam. Unsubscribe any time.
        </p>
      </form>
    </div>
  )
}
