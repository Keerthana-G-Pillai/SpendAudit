import { z } from 'zod'

export const toolEntrySchema = z.object({
  tool: z.enum([
    'cursor',
    'github-copilot',
    'claude',
    'chatgpt',
    'anthropic-api',
    'openai-api',
    'gemini',
    'windsurf',
    'figma',
    'notion',
  ]),
  plan: z.string().min(1),
  monthlySpend: z.number().min(0, 'Spend cannot be negative'),
  seats: z.number().int().min(1, 'At least 1 seat required'),
})

export const spendInputSchema = z.object({
  tools: z.array(toolEntrySchema).min(1, 'Add at least one AI tool'),
  teamSize: z.number().int().min(1, 'Team size must be at least 1'),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
})

export const leadSchema = z.object({
  email: z.string().email(),
  company: z.string().optional(),
  role: z.string().optional(),
  teamSize: z.number().int().min(1).optional(),
  website: z.string().optional(),
  auditId: z.union([z.string(), z.number()]).optional(),
  auditSlug: z.string().min(1),
  totalSavings: z.number().min(0),
})

export type SpendInputSchema = z.infer<typeof spendInputSchema>
export type LeadSchema = z.infer<typeof leadSchema>
