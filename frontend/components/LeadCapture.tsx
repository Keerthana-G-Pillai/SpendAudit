'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
        const body = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(body.error ?? 'Request failed')
      }

      onSuccess()
    } catch {
      setError('root', { message: 'Something went wrong. Please try again.' })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isOptimal
            ? 'Get notified when new optimizations apply'
            : 'Get this audit in your inbox'}
        </CardTitle>
        <CardDescription>
          {isOptimal
            ? 'We will alert you when pricing changes or better alternatives emerge.'
            : 'One email with your full audit summary and recommendations.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="sr-only"
            aria-hidden="true"
            {...register('website')}
          />

          <div>
            <Label htmlFor="lead-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="lead-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className="mt-1 min-h-[44px]"
              {...register('email')}
            />
            {errors.email && (
              <p role="alert" className="text-sm text-destructive mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lead-company">Company (optional)</Label>
              <Input
                id="lead-company"
                autoComplete="organization"
                className="mt-1 min-h-[44px]"
                {...register('company')}
              />
            </div>
            <div>
              <Label htmlFor="lead-role">Role (optional)</Label>
              <Input
                id="lead-role"
                autoComplete="organization-title"
                className="mt-1 min-h-[44px]"
                {...register('role')}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="lead-team-size">Team size (optional)</Label>
            <Input
              id="lead-team-size"
              type="number"
              min={1}
              inputMode="numeric"
              className="mt-1 min-h-[44px]"
              {...register('teamSize')}
            />
          </div>

          {errors.root && (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="w-full min-h-[48px]"
          >
            {isSubmitting ? 'Sending...' : 'Send me the audit'}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            No spam. Unsubscribe any time.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
