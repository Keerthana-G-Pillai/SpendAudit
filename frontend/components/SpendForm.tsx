'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { spendInputSchema, type SpendInputSchema } from '@/lib/schemas'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ToolName, UseCase } from '@backend/lib/types'

const TOOLS: { id: ToolName; label: string; plans: string[] }[] = [
  { id: 'cursor', label: 'Cursor', plans: ['hobby', 'pro', 'business', 'enterprise'] },
  { id: 'github-copilot', label: 'GitHub Copilot', plans: ['individual', 'business', 'enterprise'] },
  { id: 'claude', label: 'Claude', plans: ['free', 'pro', 'max', 'team', 'enterprise', 'api-direct'] },
  { id: 'chatgpt', label: 'ChatGPT', plans: ['plus', 'team', 'enterprise', 'api-direct'] },
  { id: 'anthropic-api', label: 'Anthropic API Direct', plans: ['pay-as-you-go'] },
  { id: 'openai-api', label: 'OpenAI API Direct', plans: ['pay-as-you-go'] },
  { id: 'gemini', label: 'Gemini', plans: ['pro', 'ultra', 'api'] },
  { id: 'windsurf', label: 'Windsurf', plans: ['free', 'pro', 'teams'] },
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
                    {...register(`tools.${index}.tool`)}
                  >
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
                    {...register(`tools.${index}.plan`)}
                  >
                    {(toolConfig?.plans ?? []).map((p) => (
                      <option key={p} value={p}>
                        {p}
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
                    {...register(`tools.${index}.seats`, { valueAsNumber: true })}
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

      <Button type="submit" disabled={loading} aria-busy={loading} className="w-full min-h-[48px]">
        {loading ? 'Running audit...' : 'Get my free audit →'}
      </Button>
    </form>
  )
}
