import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { analyzeSpend } from '@backend/lib/audit'
import { buildAuditSummaryPrompt } from '@backend/lib/prompts'
import { getServiceClient } from '@/lib/supabase'
import { spendInputSchema } from '@/lib/schemas'
import { spendInputSchema } from '@/lib/schemas'
import type { AuditResult, SpendInput } from '@backend/lib/types'

export async function POST(req: NextRequest) {
  try {
    const parsed = spendInputSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }
    const body = parsed.data

    const auditResult: AuditResult = analyzeSpend(body)
    const aiSummary = await generateSummary(body, auditResult)

    const slug = nanoid(10)
    const supabase = getServiceClient()

    const { error } = await supabase.from('audits').insert({
      slug,
      spend_data: body,
      audit_result: auditResult,
      ai_summary: aiSummary,
    })

    if (error) throw new Error(`Supabase insert failed: ${error.message}`)

    return NextResponse.json({ slug })
  } catch (err) {
    console.error('Audit API error:', err)
    return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 })
  }
}

async function generateSummary(input: SpendInput, result: AuditResult): Promise<string> {
  try {
    const prompt = buildAuditSummaryPrompt(input, result)

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) throw new Error(`Groq API returned ${response.status}`)

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }
    const content = data.choices?.[0]?.message?.content

    if (!content) throw new Error('Empty response from Groq')

    return content
  } catch (err) {
    console.warn('AI summary failed, using fallback:', err)
    return buildFallbackSummary(result)
  }
}

function buildFallbackSummary(result: AuditResult): string {
  const topRec = result.recommendations.find((r) => r.estimatedMonthlySaving > 0)
  const count = result.recommendations.filter((r) => r.estimatedMonthlySaving > 0).length

  if (result.totalMonthlySavings === 0) {
    return `Based on your current AI tool stack of $${result.totalCurrentSpend}/month, our analysis found no significant optimization opportunities. Your current plan selections appear well-matched to your team size and use case. We will notify you as pricing changes or new alternatives emerge that could benefit your stack.`
  }

  return `Based on your current AI tool stack of $${result.totalCurrentSpend}/month, our analysis found ${count} optimization ${count === 1 ? 'opportunity' : 'opportunities'} totaling $${result.totalMonthlySavings} in potential monthly savings — $${result.totalAnnualSavings} annually. ${topRec ? `Your biggest opportunity is: ${topRec.recommendedAction}.` : ''} Switching to the recommended configuration is straightforward and could free up meaningful budget for other growth initiatives.`
}
