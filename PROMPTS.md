# Prompts

## Audit Summary Generation Prompt
We use the Anthropic API (or fallback to Groq depending on the deployment environment) to generate a personalized 100-word summary of the audit results.

### Full Prompt String
```typescript
You are an AI spending advisor. A startup with ${input.teamSize} people primarily doing ${input.useCase} work is spending $${result.totalCurrentSpend}/month on AI tools.

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

Critical rule: Do not use the phrase "renegotiating contracts" or suggest contract renegotiation services. Credex sells discounted pre-purchased AI credits, not contract renegotiation services.
```

### Why it is written this way
1. **Explicit Formatting Constraints**: LLMs naturally drift into using standard Markdown headers (`#` or `##`) when asked to structure data. Because we are injecting this summary into a specific UI component (`AuditResults`) that uses custom styling, standard `<h1>` tags would break the CSS flow. By explicitly enforcing `**` for bolding, we ensure the output can be easily parsed by our `PdfExportButton` logic and styled gracefully in the DOM without bleeding into global header styles.
2. **Context Injection**: By providing the exact team size, use case, and calculated total spend upfront, the LLM is anchored to the reality of the mathematical audit. This prevents it from hallucinating generalized advice and forces it to synthesize the hard data.
3. **Negative Constraints (The "Critical Rule")**: During testing, the LLM frequently suggested that enterprise users should "renegotiate their contract with Anthropic." Since Credex's core business model relies on selling pre-purchased institutional credits rather than acting as a negotiation middleman, this hallucination actively undermined the GTM strategy. Adding a strict negative constraint successfully curbed this behavior.

### What didn't work
Initially, I attempted to have the LLM perform the mathematical audit itself by just passing the user's input and a list of rules. This was a catastrophic failure. The LLM would confidently hallucinate pricing tiers (inventing a "ChatGPT Starter" plan) and consistently fail basic multiplication (e.g., $20 * 4 users = $100). 
This reinforced the architectural decision to strictly separate concerns: a deterministic, hard-coded TypeScript engine (`audit.ts`) performs 100% of the math and logic, and the LLM is only used at the very end to synthesize the resulting data into a human-readable narrative.
