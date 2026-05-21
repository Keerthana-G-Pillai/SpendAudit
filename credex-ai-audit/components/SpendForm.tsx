'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { SpendInput, ToolName, UseCase } from '@/lib/types'

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
  const [error, setError] = useState<string | null>(null)

  const { register, control, handleSubmit, watch, setValue, getValues } = useForm<SpendInput>({
    defaultValues: { tools: [], teamSize: 1, useCase: 'coding' },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'tools' })

  // Restore from localStorage on mount
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
      // Silently ignore malformed localStorage data
    }
  }, [setValue])

  // Persist to localStorage on every change
  const formValues = watch()
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues))
    } catch {
      // Storage might be full or blocked — not a critical failure
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Team info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Team size
          </label>
          <input
            type="number"
            min={1}
            {...register('teamSize', { valueAsNumber: true, min: 1 })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Primary use case
          </label>
          <select
            {...register('useCase')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            {USE_CASES.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tool entries */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">
          AI tools you are paying for
        </p>
        <div className="space-y-3">
          {fields.map((field, index) => {
            const selectedTool = watchedTools?.[index]?.tool
            const toolConfig = TOOLS.find((t) => t.id === selectedTool)

            return (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 items-center border border-gray-200 rounded-lg p-3"
              >
                {/* Tool name */}
                <div className="col-span-4">
                  <select
                    {...register(`tools.${index}.tool`)}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    {TOOLS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan */}
                <div className="col-span-3">
                  <select
                    {...register(`tools.${index}.plan`)}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  >
                    {(toolConfig?.plans ?? []).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Monthly spend */}
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="$/mo"
                    min={0}
                    {...register(`tools.${index}.monthlySpend`, { valueAsNumber: true })}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Seats */}
                <div className="col-span-2">
                  <input
                    type="number"
                    placeholder="seats"
                    min={1}
                    {...register(`tools.${index}.seats`, { valueAsNumber: true, min: 1 })}
                    className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Remove */}
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-gray-400 hover:text-red-500 transition text-lg leading-none"
                    aria-label="Remove tool"
                  >
                    ×
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
          className="mt-3 text-sm text-gray-600 hover:text-gray-900 underline underline-offset-2"
        >
          + Add a tool
        </button>
      </div>

      {/* Column labels (small, above the tool rows for reference) */}
      {fields.length > 0 && (
        <p className="text-xs text-gray-400 -mt-3">
          Tool · Plan · Monthly spend ($) · Seats
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white rounded-lg py-3 font-medium hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Running audit...' : 'Get my free audit →'}
      </button>
    </form>
  )
}
