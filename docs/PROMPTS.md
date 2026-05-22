# Prompts

Source of truth for the production prompt: `backend/lib/prompts.ts` (`buildAuditSummaryPrompt`).

## AI Summary — Production Prompt

```
You are an AI spending advisor. A startup with {teamSize} people primarily doing {useCase} work
is spending ${totalSpend}/month on AI tools.

Here is their current stack breakdown:
{toolBreakdown}

Write a 100-word personalized paragraph that:
1. Identifies their single biggest inefficiency with a specific dollar amount
2. Makes one clear top recommendation with projected annual savings
3. Ends with an encouraging note about optimizing their stack

Tone: professional but direct, like a CFO advisor talking to a founder.
Use exact numbers. Flowing prose only — no bullet points, no headers.
```

## Why written this way

- Specifying "100 words" produces consistent output length suitable for the UI card. Without it, output ranged from 60 to 400 words across runs.
- "CFO advisor" grounds the tone — professional without being harsh, credible without being generic.
- Asking explicitly for "exact numbers" prevents vague outputs like "significant savings" with no figure attached.
- "Flowing prose only" is necessary because the default model behavior for structured data tends toward bullet points, which break the UI layout.

## What I tried that did not work

- **No word limit** — first version returned 400+ word essays on some inputs. Unusable in the UI card.
- **"Be concise"** — second version was still inconsistent. 80 words one run, 200 the next.
- **JSON output with a summary field** — added unnecessary complexity and the model occasionally broke the JSON format, requiring extra parsing error handling.
- **"Friendly and encouraging tone"** — output was too casual and lacked the credibility a finance-adjacent recommendation needs.
- **Asking for 3 recommendations** — confused the 100-word limit. Model tried to cram three points in and the prose became choppy.

## Fallback Template

Used automatically when the Groq API returns an error, times out, or is rate limited:

```
Based on your current AI tool stack of $[totalCurrentSpend]/month, our analysis found
[recommendationCount] optimization opportunities totaling $[totalMonthlySavings] in potential
monthly savings — $[totalAnnualSavings] annually. [If savings > 0: "Your biggest opportunity
is: [topRecommendation.recommendedAction]."] [If savings = 0: "Your current spend appears
well-optimized for your team size and use case."] Switching to our recommended configuration
could free up meaningful budget for other growth initiatives.
```
