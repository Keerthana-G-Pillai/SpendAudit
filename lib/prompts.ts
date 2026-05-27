import type { AuditResult, SpendInput } from './types'

/** Production prompt for Groq — documented in docs/PROMPTS.md */
export function buildAuditSummaryPrompt(input: SpendInput, result: AuditResult): string {
  const toolBreakdown = result.recommendations
    .map((r) => `${r.tool}: $${r.currentSpend}/mo — ${r.recommendedAction}`)
    .join('\n')

  return `You are an AI spending advisor. A startup with ${input.teamSize} people primarily doing ${input.useCase} work is spending $${result.totalCurrentSpend}/month on AI tools.

Here is their current stack breakdown:
${toolBreakdown}

Please provide an analysis structured with exactly these three bold markdown headings (use ** for bolding the text as if they were headings):
**Where you're overspending**
(Explain their single biggest inefficiency with specific dollar amounts)

**What to switch to or downgrade**
(Provide a clear top recommendation)

**Total potential monthly + annual savings**
(End with an encouraging note using exact numbers for total monthly and annual savings, projecting the impact of these changes)

Tone: professional but direct, like a CFO advisor talking to a founder. Use exact numbers. Do not include any other headings. Do not use markdown headers (like # or ##), only bold text with **.

Critical rule: Do not use the phrase "renegotiating contracts" or suggest contract renegotiation services. Credex sells discounted pre-purchased AI credits, not contract renegotiation services.`
}
