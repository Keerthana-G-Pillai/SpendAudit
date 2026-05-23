'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { spendInputSchema, type SpendInputSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SubmitProgress from './SubmitProgress'
import type { ToolName, UseCase } from '@backend/lib/types'

interface PlanInfo {
  value: string
  label: string
  pricePerSeat: number
}

interface ToolConfig {
  id: ToolName
  label: string
  plans: PlanInfo[]
}

const TOOLS: ToolConfig[] = [
  {
    id: 'cursor',
    label: 'Cursor',
    plans: [
      { value: 'hobby', label: 'Hobby (Free)', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro ($20/mo)', pricePerSeat: 20 },
      { value: 'business', label: 'Business ($40/mo)', pricePerSeat: 40 },
    ],
  },
  {
    id: 'github-copilot',
    label: 'GitHub Copilot',
    plans: [
      { value: 'individual', label: 'Individual ($10/mo)', pricePerSeat: 10 },
      { value: 'business', label: 'Business ($19/mo)', pricePerSeat: 19 },
      { value: 'enterprise', label: 'Enterprise ($39/mo)', pricePerSeat: 39 },
    ],
  },
  {
    id: 'claude',
    label: 'Claude',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro ($20/mo)', pricePerSeat: 20 },
      { value: 'max', label: 'Max ($100/mo)', pricePerSeat: 100 },
      { value: 'team', label: 'Team ($30/mo)', pricePerSeat: 30 },
      { value: 'api-direct', label: 'API Direct (Pay-as-you-go)', pricePerSeat: 0 },
    ],
  },
  {
    id: 'chatgpt',
    label: 'ChatGPT',
    plans: [
      { value: 'plus', label: 'Plus ($20/mo)', pricePerSeat: 20 },
      { value: 'team', label: 'Team ($30/mo)', pricePerSeat: 30 },
      { value: 'api-direct', label: 'API Direct (Pay-as-you-go)', pricePerSeat: 0 },
    ],
  },
  {
    id: 'anthropic-api',
    label: 'Anthropic API Direct',
    plans: [
      { value: 'pay-as-you-go', label: 'Pay-as-you-go', pricePerSeat: 0 },
    ],
  },
  {
    id: 'openai-api',
    label: 'OpenAI API Direct',
    plans: [
      { value: 'pay-as-you-go', label: 'Pay-as-you-go', pricePerSeat: 0 },
    ],
  },
  {
    id: 'gemini',
    label: 'Gemini',
    plans: [
      { value: 'pro', label: 'Pro (Free)', pricePerSeat: 0 },
      { value: 'ultra', label: 'Ultra ($19.99/mo)', pricePerSeat: 19.99 },
      { value: 'api', label: 'API (Pay-as-you-go)', pricePerSeat: 0 },
    ],
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    plans: [
      { value: 'free', label: 'Free', pricePerSeat: 0 },
      { value: 'pro', label: 'Pro ($15/mo)', pricePerSeat: 15 },
      { value: 'teams', label: 'Teams ($35/mo)', pricePerSeat: 35 },
    ],
  },
]

const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: 'Coding / engineering' },
  { value: 'writing', label: 'Writing / content' },
  { value: 'data', label: 'Data analysis' },
  { value: 'research', label: 'Research' },
  { value: 'mixed', label: 'Mixed / general' },
]

const STORAGE_KEY = 'credex-spend-form-v1'

export default function SpendForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SpendInputSchema>({
    resolver: zodResolver(spendInputSchema),
    defaultValues: { tools: [], teamSize: 1, useCase: 'coding' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'tools' })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = spendInputSchema.safeParse(JSON.parse(saved))
        if (parsed.success) {
          setValue('tools', parsed.data.tools)
          setValue('teamSize', parsed.data.teamSize)
          setValue('useCase', parsed.data.useCase)
        }
      }
    } catch {
      /* ignore */
    }
  }, [setValue])

  const formValues = watch()
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues))
    } catch {
      /* ignore */
    }
  }, [formValues])

  const watchedTools = watch('tools')

  const updateSpend = (index: number, toolName: ToolName | '', planValue: string, numSeats: number) => {
    if (!toolName || !planValue) return
    const config = TOOLS.find((t) => t.id === toolName)
    const planObj = config?.plans.find((p) => p.value === planValue)
    if (planObj) {
      const calculatedSpend = planObj.pricePerSeat * numSeats
      setValue(`tools.${index}.monthlySpend`, calculatedSpend)
    }
  }

  const onSubmit = async (data: SpendInputSchema) => {
    setLoading(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Audit failed')
      const { slug } = (await res.json()) as { slug: string }
      // Ensure progress bar animation completes before navigating
      await new Promise((resolve) => setTimeout(resolve, 2000))
      router.push(`/audit/${slug}`)
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="teamSize">Team size</Label>
          <Input
            id="teamSize"
            type="number"
            min={1}
            inputMode="numeric"
            className="mt-1 min-h-[44px]"
            {...register('teamSize', { valueAsNumber: true })}
          />
          {errors.teamSize && (
            <p role="alert" className="text-sm text-destructive mt-1">
              {errors.teamSize.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="useCase">Primary use case</Label>
          <select
            id="useCase"
            className="mt-1 flex min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('useCase')}
          >
            {USE_CASES.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium mb-3">AI tools you are paying for</legend>
        <div className="space-y-3">
          {fields.map((field, index) => {
            const selectedTool = watchedTools?.[index]?.tool
            const toolConfig = TOOLS.find((t) => t.id === selectedTool)
            const baseId = `tool-${index}`
            const toolErrors = errors.tools?.[index]

            return (
              <div
                key={field.id}
                className="flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-end border border-border rounded-xl p-4"
              >
                <div className="sm:col-span-4">
                  <Label htmlFor={`${baseId}-name`} className="text-xs text-muted-foreground">
                    Tool
                  </Label>
                  <select
                    id={`${baseId}-name`}
                    className="mt-1 flex min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    defaultValue=""
                    {...register(`tools.${index}.tool`, {
                      onChange: (e) => {
                        const val = e.target.value as ToolName
                        const config = TOOLS.find((t) => t.id === val)
                        if (config && config.plans.length > 0) {
                          const firstPlan = config.plans[0]?.value
                          if (firstPlan) {
                            setValue(`tools.${index}.plan`, firstPlan)
                            updateSpend(index, val, firstPlan, watchedTools?.[index]?.seats ?? 1)
                          }
                        }
                      }
                    })}
                  >
                    <option value="" disabled>Select tool</option>
                    {TOOLS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <Label htmlFor={`${baseId}-plan`} className="text-xs text-muted-foreground">
                    Plan
                  </Label>
                  <select
                    id={`${baseId}-plan`}
                    className="mt-1 flex min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    disabled={!selectedTool}
                    defaultValue=""
                    {...register(`tools.${index}.plan`, {
                      onChange: (e) => {
                        updateSpend(index, selectedTool || '', e.target.value, watchedTools?.[index]?.seats ?? 1)
                      }
                    })}
                  >
                    <option value="" disabled>Select plan</option>
                    {(toolConfig?.plans ?? []).map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {toolErrors?.plan && (
                    <p role="alert" className="text-xs text-destructive mt-0.5">
                      {toolErrors.plan.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor={`${baseId}-spend`} className="text-xs text-muted-foreground">
                    $/month
                  </Label>
                  <Input
                    id={`${baseId}-spend`}
                    type="number"
                    min={0}
                    inputMode="decimal"
                    className="mt-1 min-h-[44px]"
                    {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                  />
                  {toolErrors?.monthlySpend && (
                    <p role="alert" className="text-xs text-destructive mt-0.5">
                      {toolErrors.monthlySpend.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor={`${baseId}-seats`} className="text-xs text-muted-foreground">
                    Seats
                  </Label>
                  <Input
                    id={`${baseId}-seats`}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="mt-1 min-h-[44px]"
                    {...register(`tools.${index}.seats`, {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const sVal = parseInt(e.target.value) || 1
                        updateSpend(index, selectedTool || '', watchedTools?.[index]?.plan || '', sVal)
                      }
                    })}
                  />
                  {toolErrors?.seats && (
                    <p role="alert" className="text-xs text-destructive mt-0.5">
                      {toolErrors.seats.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-1 flex sm:justify-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    aria-label={`Remove tool ${index + 1}`}
                  >
                    ×
                  </Button>
                </div>
              </div>
            )
          })}
        </div>

        <Button
          type="button"
          variant="outline"
          className="mt-3"
          onClick={() =>
            append({ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 })
          }
        >
          + Add a tool
        </Button>
        {errors.tools?.message && (
          <p role="alert" className="text-sm text-destructive mt-2">
            {errors.tools.message}
          </p>
        )}
      </fieldset>

      {submitError && (
        <p role="alert" className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {submitError}
        </p>
      )}

      <SubmitProgress active={loading} />

      <Button type="submit" disabled={loading} aria-busy={loading} className="w-full min-h-[48px]">
        {loading ? 'Running audit...' : 'Get my free audit →'}
      </Button>
    </form>
  )
}
