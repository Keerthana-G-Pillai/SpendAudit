'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { SpendInput, ToolName, UseCase } from '@backend/lib/types'

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

const inputClass =
  'w-full min-h-[44px] border border-gray-200 rounded-lg px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1'

export default function SpendForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, control, handleSubmit, watch, setValue } = useForm<SpendInput>({
    defaultValues: { tools: [], teamSize: 1, useCase: 'coding' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'tools' })

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SpendInput
        setValue('tools', parsed.tools ?? [])
        setValue('teamSize', parsed.teamSize ?? 1)
        setValue('useCase', parsed.useCase ?? 'coding')
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

  const onSubmit = async (data: SpendInput) => {
    if (data.tools.length === 0) {
      setError('Please add at least one AI tool to audit.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Audit failed')
      const { slug } = await res.json()
      router.push(`/audit/${slug}`)
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
            Team size
          </label>
          <input
            id="teamSize"
            type="number"
            min={1}
            inputMode="numeric"
            {...register('teamSize', { valueAsNumber: true, min: 1 })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="useCase" className="block text-sm font-medium text-gray-700 mb-1">
            Primary use case
          </label>
          <select
            id="useCase"
            {...register('useCase')}
            className={inputClass}
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
        <legend className="text-sm font-medium text-gray-700 mb-3">
          AI tools you are paying for
        </legend>
        <div className="space-y-3">
          {fields.map((field, index) => {
            const selectedTool = watchedTools?.[index]?.tool
            const toolConfig = TOOLS.find((t) => t.id === selectedTool)
            const baseId = `tool-${index}`

            return (
              <div
                key={field.id}
                className="flex flex-col gap-3 sm:grid sm:grid-cols-12 sm:gap-2 sm:items-end border border-gray-200 rounded-xl p-4"
              >
                <div className="sm:col-span-4">
                  <label htmlFor={`${baseId}-name`} className="sr-only sm:not-sr-only sm:block text-xs text-gray-500 mb-1">
                    Tool
                  </label>
                  <select
                    id={`${baseId}-name`}
                    {...register(`tools.${index}.tool`)}
                    className={inputClass}
                  >
                    {TOOLS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor={`${baseId}-plan`} className="sr-only sm:not-sr-only sm:block text-xs text-gray-500 mb-1">
                    Plan
                  </label>
                  <select
                    id={`${baseId}-plan`}
                    {...register(`tools.${index}.plan`)}
                    className={inputClass}
                  >
                    {(toolConfig?.plans ?? []).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${baseId}-spend`} className="sr-only sm:not-sr-only sm:block text-xs text-gray-500 mb-1">
                    $/month
                  </label>
                  <input
                    id={`${baseId}-spend`}
                    type="number"
                    placeholder="$/mo"
                    min={0}
                    inputMode="decimal"
                    aria-label="Monthly spend in dollars"
                    {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor={`${baseId}-seats`} className="sr-only sm:not-sr-only sm:block text-xs text-gray-500 mb-1">
                    Seats
                  </label>
                  <input
                    id={`${baseId}-seats`}
                    type="number"
                    placeholder="Seats"
                    min={1}
                    inputMode="numeric"
                    {...register(`tools.${index}.seats`, { valueAsNumber: true, min: 1 })}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-1 flex sm:justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="min-h-[44px] min-w-[44px] text-gray-500 hover:text-red-600 transition text-lg"
                    aria-label={`Remove tool ${index + 1}`}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            append({ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 })
          }
          className="mt-3 min-h-[44px] text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
        >
          + Add a tool
        </button>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full min-h-[48px] bg-gray-900 text-white rounded-lg py-3 text-base font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
      >
        {loading ? 'Running audit...' : 'Get my free audit →'}
      </button>
    </form>
  )
}
