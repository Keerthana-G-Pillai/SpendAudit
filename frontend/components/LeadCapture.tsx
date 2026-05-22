'use client'

import { useState } from 'react'

interface Props {
  slug: string
  auditId: string
  defaultTeamSize?: number
  totalSavings: number
  onSuccess: () => void
  isOptimal: boolean
}

const inputClass =
  'w-full min-h-[44px] border border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1'

export default function LeadCapture({
  slug,
  auditId,
  defaultTeamSize,
  totalSavings,
  onSuccess,
  isOptimal,
}: Props) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [teamSize, setTeamSize] = useState(defaultTeamSize ? String(defaultTeamSize) : '')
  const [honeypot, setHoneypot] = useState('')
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
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company: company || undefined,
          role: role || undefined,
          teamSize: teamSize ? Number(teamSize) : undefined,
          website: honeypot,
          auditId,
          auditSlug: slug,
          totalSavings,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Request failed')
      }

      onSuccess()
    } catch {
      setFieldError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section
      className="border border-gray-100 rounded-2xl p-5 sm:p-6 space-y-4"
      aria-labelledby="lead-capture-heading"
    >
      <div>
        <h2 id="lead-capture-heading" className="font-semibold text-gray-900">
          {isOptimal
            ? 'Get notified when new optimizations apply to your stack'
            : 'Get this audit in your inbox'}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {isOptimal
            ? 'We will alert you when pricing changes or better alternatives emerge.'
            : 'One email with your full audit summary and recommendations.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3" noValidate>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="sr-only"
        />

        <div>
          <label htmlFor="lead-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="lead-company" className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="lead-company"
              type="text"
              autoComplete="organization"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="lead-role" className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="lead-role"
              type="text"
              autoComplete="organization-title"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="lead-team-size" className="block text-sm font-medium text-gray-700 mb-1">
            Team size <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            id="lead-team-size"
            type="number"
            min={1}
            inputMode="numeric"
            value={teamSize}
            onChange={(e) => setTeamSize(e.target.value)}
            className={inputClass}
          />
        </div>

        {fieldError && (
          <p role="alert" className="text-sm text-red-600">
            {fieldError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="w-full min-h-[48px] bg-gray-900 text-white rounded-lg py-2.5 text-base font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          {loading ? 'Sending...' : 'Send me the audit'}
        </button>

        <p className="text-xs text-gray-400 text-center">No spam. Unsubscribe any time.</p>
      </form>
    </section>
  )
}
