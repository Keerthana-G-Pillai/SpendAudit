import type { AuditResult, SpendInput } from './types'

/** Production prompt for Groq — documented in docs/PROMPTS.md */
export function buildAuditSummaryPrompt(input: SpendInput, result: AuditResult): string {
  const toolBreakdown = result.recommendations
    .map((r) => `${r.tool}: $${r.currentSpend}/mo — ${r.recommendedAction}`)
    .join('\n')

  return `You are an AI spending advisor. A startup with ${input.teamSize} people primarily doing ${input.useCase} work is spending $${result.totalCurrentSpend}/month on AI tools.

Here is their current stack breakdown:
${toolBreakdown}

Write a 100-word personalized paragraph that:
1. Identifies their single biggest inefficiency with a specific dollar amount
2. Makes one clear top recommendation with projected annual savings
3. Ends with an encouraging note about optimizing their stack

Tone: professional but direct, like a CFO advisor talking to a founder. Use exact numbers. Flowing prose only — no bullet points, no headers.

Critical rule: Do not use the phrase "renegotiating contracts" or suggest contract renegotiation services. Credex sells discounted pre-purchased AI credits, not contract renegotiation services.`
}
