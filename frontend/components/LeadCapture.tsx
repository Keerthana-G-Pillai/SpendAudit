'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const leadFormSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  company: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.string().optional(),
  website: z.string().optional(),
})

type LeadFormData = z.infer<typeof leadFormSchema>

interface Props {
  slug: string
  auditId: string
  defaultTeamSize?: number
  totalSavings: number
  onSuccess: () => void
  isOptimal: boolean
}

export default function LeadCapture({
  slug,
  auditId,
  defaultTeamSize,
  totalSavings,
  onSuccess,
  isOptimal,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      email: '',
      company: '',
      role: '',
      teamSize: defaultTeamSize != null ? String(defaultTeamSize) : '',
      website: '',
    },
  })

  const onSubmit = async (data: LeadFormData) => {
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          company: data.company || undefined,
          role: data.role || undefined,
          teamSize: data.teamSize === '' ? undefined : Number(data.teamSize),
          website: data.website,
          auditId,
          auditSlug: slug,
          totalSavings,
        }),
      })

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; details?: string }
        throw new Error(body.details ?? body.error ?? 'Request failed')
      }

      onSuccess()
    } catch (err: any) {
      setError('root', { message: err?.message || 'Something went wrong. Please try again.' })
    }
  }

  return (
    <section className="ui-section p-5 sm:p-6" aria-labelledby="lead-heading">
      <h2 id="lead-heading" className="ui-heading">
        {isOptimal ? 'Pricing alerts' : 'Email this audit'}
      </h2>
      <p className="ui-body mt-1 mb-5">
        {isOptimal
          ? 'Notify me when pricing changes affect my stack.'
          : 'Receive a copy of this report and recommendations.'}
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          className="sr-only"
          aria-hidden="true"
          {...register('website')}
        />

        <div>
          <label htmlFor="lead-email" className="ui-label block mb-1.5">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="ui-input"
            {...register('email')}
          />
          {errors.email && (
            <p role="alert" className="text-[12px] text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="lead-company" className="ui-label block mb-1.5">
              Company
            </label>
            <input
              id="lead-company"
              autoComplete="organization"
              className="ui-input"
              {...register('company')}
            />
          </div>
          <div>
            <label htmlFor="lead-role" className="ui-label block mb-1.5">
              Role
            </label>
            <input
              id="lead-role"
              autoComplete="organization-title"
              className="ui-input"
              {...register('role')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="lead-team-size" className="ui-label block mb-1.5">
            Team size
          </label>
          <input
            id="lead-team-size"
            type="number"
            min={1}
            inputMode="numeric"
            className="ui-input"
            {...register('teamSize')}
          />
        </div>

        {errors.root && (
          <p role="alert" className="text-[12px] text-red-600">
            {errors.root.message}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className="ui-btn-primary w-full">
          {isSubmitting ? 'Sending…' : 'Send audit'}
        </button>

        <p className="text-[11px] text-secondary/80 text-center">No spam. Unsubscribe anytime.</p>
      </form>
    </section>
  )
}
