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
          <label htmlFor="teamSize" className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Team Size</label>
          <input
            id="teamSize"
            type="number"
            min={1}
            inputMode="numeric"
            className="dark-input w-full rounded-lg px-3 py-3 text-sm font-medium min-h-[48px] focus:outline-none focus:ring-2 focus:ring-gray-600"
            {...register('teamSize', { valueAsNumber: true })}
          />
          {errors.teamSize && (
            <p role="alert" className="text-sm text-red-500 mt-1">
              {errors.teamSize.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="useCase" className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Primary Use Case</label>
          <select
            id="useCase"
            className="dark-input w-full rounded-lg px-3 py-3 text-sm font-medium min-h-[48px] focus:outline-none focus:ring-2 focus:ring-gray-600"
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
        <legend className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Tools You Are Paying For</legend>
        <div className="space-y-0">
          {/* Column headers */}
          {fields.length > 0 && (
            <div className="hidden sm:grid sm:grid-cols-12 sm:gap-2 px-0 mb-1">
              <div className="sm:col-span-4"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tool</span></div>
              <div className="sm:col-span-3"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Plan</span></div>
              <div className="sm:col-span-2"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">$/mo</span></div>
              <div className="sm:col-span-2"><span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Seats</span></div>
            </div>
          )}
        <div className="space-y-2">
          {fields.map((field, index) => {
            const selectedTool = watchedTools?.[index]?.tool
            const toolConfig = TOOLS.find((t) => t.id === selectedTool)
            const baseId = `tool-${index}`
            const toolErrors = errors.tools?.[index]

            return (
              <div
                key={field.id}
                className="flex flex-col gap-2 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-center py-2"
              >
                <div className="sm:col-span-4">
                  <label className="sm:hidden block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Tool</label>
                  <select
                    id={`${baseId}-name`}
                    className="dark-input w-full rounded-lg px-3 py-3 text-sm font-medium min-h-[44px] focus:outline-none"
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
                  <label className="sm:hidden block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Plan</label>
                  <select
                    id={`${baseId}-plan`}
                    className="dark-input w-full rounded-lg px-3 py-3 text-sm font-medium min-h-[44px] focus:outline-none disabled:opacity-40"
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
                    <p role="alert" className="text-xs text-red-500 mt-0.5">
                      {toolErrors.plan.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="sm:hidden block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">$/mo</label>
                  <input
                    id={`${baseId}-spend`}
                    type="number"
                    min={0}
                    inputMode="decimal"
                    className="dark-input w-full rounded-lg px-3 py-3 text-sm font-medium min-h-[44px] focus:outline-none"
                    {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                  />
                  {toolErrors?.monthlySpend && (
                    <p role="alert" className="text-xs text-red-500 mt-0.5">
                      {toolErrors.monthlySpend.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="sm:hidden block text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1">Seats</label>
                  <input
                    id={`${baseId}-seats`}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="dark-input w-full rounded-lg px-3 py-3 text-sm font-medium min-h-[44px] focus:outline-none"
                    {...register(`tools.${index}.seats`, {
                      valueAsNumber: true,
                      onChange: (e) => {
                        const sVal = parseInt(e.target.value) || 1
                        updateSpend(index, selectedTool || '', watchedTools?.[index]?.plan || '', sVal)
                      }
                    })}
                  />
                  {toolErrors?.seats && (
                    <p role="alert" className="text-xs text-red-500 mt-0.5">
                      {toolErrors.seats.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-1 flex sm:justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    aria-label={`Remove tool ${index + 1}`}
                    className="text-gray-400 hover:text-red-500 text-xl font-light transition-colors w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50"
                  >
                    ×
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        </div>

        <button
          type="button"
          className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-900 border border-gray-200 hover:border-gray-400 rounded-lg px-4 py-2.5 transition-all"
          onClick={() =>
            append({ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 })
          }
        >
          + Add a tool
        </button>
        {errors.tools?.message && (
          <p role="alert" className="text-sm text-red-500 mt-2">
            {errors.tools.message}
          </p>
        )}
      </fieldset>

      {submitError && (
        <p role="alert" className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-lg">
          {submitError}
        </p>
      )}

      <SubmitProgress active={loading} />

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full min-h-[52px] rounded-xl font-semibold text-base transition-all"
        style={{
          backgroundColor: loading ? '#555' : '#111',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Running audit...' : 'Get my free audit →'}
      </button>
    </form>
  )
}
