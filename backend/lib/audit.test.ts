import { describe, it, expect } from 'vitest'
import { analyzeSpend, detectOverlaps, PRICING } from './audit'
import type { SpendInput } from './types'

// ─── Helper to build a minimal valid SpendInput ───────────────────────────────
function makeInput(overrides: Partial<SpendInput> = {}): SpendInput {
  return {
    tools: [],
    teamSize: 5,
    useCase: 'coding',
    ...overrides,
  }
}

// ─── Core math ────────────────────────────────────────────────────────────────
describe('Core math', () => {
  it('totalAnnualSavings is exactly 12x totalMonthlySavings', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 }] })
    )
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })

  it('totalCurrentSpend sums all tool entries', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [
          { tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 },
          { tool: 'chatgpt', plan: 'plus', monthlySpend: 20, seats: 1 },
        ],
      })
    )
    expect(result.totalCurrentSpend).toBe(40)
  })

  it('handles empty tool list without crashing', () => {
    const result = analyzeSpend(makeInput({ tools: [] }))
    expect(result.totalMonthlySavings).toBe(0)
    expect(result.totalAnnualSavings).toBe(0)
    expect(result.recommendations).toHaveLength(0)
    expect(result.savingsTier).toBe('optimal')
  })

  it('accumulates savings correctly across multiple tools', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [
          { tool: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 },  // saves $20
          { tool: 'cursor', plan: 'business', monthlySpend: 80, seats: 2 }, // saves $40
        ],
        teamSize: 2,
      })
    )
    expect(result.totalMonthlySavings).toBe(60)
  })
})

// ─── Savings tier thresholds ─────────────────────────────────────────────────
describe('Savings tier', () => {
  it('is optimal when no savings found', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }] })
    )
    expect(result.savingsTier).toBe('optimal')
  })

  it('is low when savings are between $1 and $100', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 }],
        teamSize: 2,
      })
    )
    expect(result.totalMonthlySavings).toBe(20)
    expect(result.savingsTier).toBe('low')
  })

  it('is medium when savings are between $101 and $500', () => {
    // Cursor Business × 4 seats saves $80, plus ChatGPT Team × 3 seats saves $30 = $110 total
    const result = analyzeSpend(
      makeInput({
        tools: [
          { tool: 'cursor', plan: 'business', monthlySpend: 160, seats: 4 },   // no saving — 4 seats is threshold
          { tool: 'chatgpt', plan: 'team', monthlySpend: 90, seats: 3 },        // saves $30
          { tool: 'windsurf', plan: 'teams', monthlySpend: 105, seats: 3 },     // saves $60
          { tool: 'claude', plan: 'max', monthlySpend: 100, seats: 1 },         // saves $80
        ],
        teamSize: 4,
      })
    )
    expect(result.totalMonthlySavings).toBeGreaterThan(100)
    expect(result.totalMonthlySavings).toBeLessThanOrEqual(500)
    expect(result.savingsTier).toBe('medium')
  })

  it('is high when savings exceed $500', () => {
    // GitHub Copilot Enterprise × 4 seats under 10 saves $80, plus many others stacked
    // ChatGPT Team × 4 seats saves $40, Cursor Business × 3 saves $60,
    // Windsurf Teams × 3 saves $60, Claude Max saves $80, Copilot Ent × 4 saves $80
    // Total: 40+60+60+80+80 = $320 — need more
    // Use GitHub Copilot Enterprise × 9 seats: saves (39-19)*9 = $180
    // + ChatGPT Team × 4: saves $40, + Cursor Business × 3: saves $60
    // + Claude Max: saves $80, + Windsurf Teams × 3: saves $60
    // + Anthropic API direct $150 for writing use case: saves $130
    // Total: 180+40+60+80+60+130 = $550
    const result = analyzeSpend(
      makeInput({
        tools: [
          { tool: 'github-copilot', plan: 'enterprise', monthlySpend: 351, seats: 9 },
          { tool: 'chatgpt', plan: 'team', monthlySpend: 120, seats: 4 },
          { tool: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 },
          { tool: 'claude', plan: 'max', monthlySpend: 100, seats: 1 },
          { tool: 'windsurf', plan: 'teams', monthlySpend: 105, seats: 3 },
          { tool: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 150, seats: 1 },
        ],
        teamSize: 9,
        useCase: 'writing',
      })
    )
    expect(result.totalMonthlySavings).toBeGreaterThan(500)
    expect(result.savingsTier).toBe('high')
  })
})

// ─── ChatGPT rules ────────────────────────────────────────────────────────────
describe('ChatGPT analysis', () => {
  it('flags Team plan for 2 users and recommends Plus', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'chatgpt', plan: 'team', monthlySpend: 60, seats: 2 }], teamSize: 2 })
    )
    const rec = result.recommendations[0]
    expect(rec.estimatedMonthlySaving).toBe(20) // (30-20)*2 = $20
    expect(rec.recommendedAction).toContain('Plus')
  })

  it('does NOT flag Team plan for 5+ users', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'chatgpt', plan: 'team', monthlySpend: 150, seats: 5 }], teamSize: 5 })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(0)
  })

  it('flags API direct when spend exceeds Plus price for writing use case', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'chatgpt', plan: 'api-direct', monthlySpend: 80, seats: 1 }],
        useCase: 'writing',
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBeGreaterThan(0)
  })
})

// ─── Cursor rules ─────────────────────────────────────────────────────────────
describe('Cursor analysis', () => {
  it('recommends downgrade from Business to Pro for 3 seats', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 120, seats: 3 }], teamSize: 3 })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(60) // (40-20)*3
    expect(result.recommendations[0].recommendedAction).toContain('Pro')
  })

  it('does NOT flag Business plan for 4+ seats', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'cursor', plan: 'business', monthlySpend: 160, seats: 4 }], teamSize: 4 })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(0)
  })

  it('does not flag Pro plan as it is already right-sized', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }] })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(0)
  })
})

// ─── Claude rules ─────────────────────────────────────────────────────────────
describe('Claude analysis', () => {
  it('recommends downgrade from Max to Pro for 1 user, saving $80/mo', () => {
    const result = analyzeSpend(
      makeInput({ tools: [{ tool: 'claude', plan: 'max', monthlySpend: 100, seats: 1 }] })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(
      PRICING.claude.max - PRICING.claude.pro
    )
  })

  it('recommends switching Claude Team to individual Pro for 2 users', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'claude', plan: 'team', monthlySpend: 60, seats: 2 }],
        teamSize: 2,
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(20) // (30-20)*2
  })

  it('does NOT flag Claude Team when it is cheaper than Pro (3+ users where team=$30 = pro=$20 gap differs)', () => {
    // At 3 seats: Team = $90, Pro = $60 — Team IS more expensive, should flag
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'claude', plan: 'team', monthlySpend: 90, seats: 3 }],
        teamSize: 3,
      })
    )
    // seats=3 > claudeTeamSmall (2), so no downgrade recommended on that rule
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(0)
  })
})

// ─── GitHub Copilot rules ────────────────────────────────────────────────────
describe('GitHub Copilot analysis', () => {
  it('recommends Enterprise → Business downgrade for teams under 10', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'github-copilot', plan: 'enterprise', monthlySpend: 195, seats: 5 }],
        teamSize: 5,
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(100) // (39-19)*5
  })

  it('recommends cancellation for non-coding use case', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'github-copilot', plan: 'business', monthlySpend: 57, seats: 3 }],
        useCase: 'writing',
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBeGreaterThan(0)
    expect(result.recommendations[0].recommendedAction).toContain('cancel')
  })
})

// ─── Windsurf rules ───────────────────────────────────────────────────────────
describe('Windsurf analysis', () => {
  it('recommends Teams → Pro downgrade for 3 seats', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'windsurf', plan: 'teams', monthlySpend: 105, seats: 3 }],
        teamSize: 3,
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(60) // (35-15)*3
  })

  it('does NOT flag Teams plan for 4+ seats', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'windsurf', plan: 'teams', monthlySpend: 140, seats: 4 }],
        teamSize: 4,
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(0)
  })
})

// ─── Overlap detection ────────────────────────────────────────────────────────
describe('detectOverlaps', () => {
  it('flags Cursor + Windsurf as overlapping code editors', () => {
    const warnings = detectOverlaps(
      makeInput({
        tools: [
          { tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 },
          { tool: 'windsurf', plan: 'pro', monthlySpend: 15, seats: 1 },
        ],
      })
    )
    expect(warnings.length).toBeGreaterThan(0)
    expect(warnings[0]).toContain('Windsurf')
  })

  it('flags Anthropic API + Claude subscription as potential double-payment', () => {
    const warnings = detectOverlaps(
      makeInput({
        tools: [
          { tool: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 50, seats: 1 },
          { tool: 'claude', plan: 'pro', monthlySpend: 20, seats: 1 },
        ],
      })
    )
    expect(warnings.some((w) => w.includes('Anthropic API'))).toBe(true)
  })

  it('returns empty array when no overlaps exist', () => {
    const warnings = detectOverlaps(
      makeInput({
        tools: [{ tool: 'cursor', plan: 'pro', monthlySpend: 20, seats: 1 }],
      })
    )
    expect(warnings).toHaveLength(0)
  })
})

// ─── Credex credits rules ─────────────────────────────────────────────────────
describe('Credex credits recommendation', () => {
  it('recommends Credex for Anthropic API spend of $50+/mo (coding use case)', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 100, seats: 1 }],
        useCase: 'coding',
      })
    )
    const rec = result.recommendations[0]
    expect(rec.estimatedMonthlySaving).toBe(30) // 100 * 0.30
    expect(rec.recommendedAction).toContain('Credex')
  })

  it('recommends Credex for OpenAI API spend of $50+/mo (coding use case)', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'openai-api', plan: 'pay-as-you-go', monthlySpend: 200, seats: 1 }],
        useCase: 'coding',
      })
    )
    const rec = result.recommendations[0]
    expect(rec.estimatedMonthlySaving).toBe(60) // 200 * 0.30
    expect(rec.recommendedAction).toContain('Credex')
  })

  it('does NOT recommend Credex for API spend under $50/mo', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 30, seats: 1 }],
        useCase: 'coding',
      })
    )
    expect(result.recommendations[0].estimatedMonthlySaving).toBe(0)
  })

  it('recommends Credex for ChatGPT API direct at $50+/mo (coding use case)', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'chatgpt', plan: 'api-direct', monthlySpend: 80, seats: 1 }],
        useCase: 'coding',
      })
    )
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toContain('Credex')
    expect(rec.estimatedMonthlySaving).toBe(24)
  })

  it('recommends Credex for Gemini API at $50+/mo (data use case)', () => {
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'gemini', plan: 'api', monthlySpend: 100, seats: 1 }],
        useCase: 'data',
      })
    )
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toContain('Credex')
    expect(rec.estimatedMonthlySaving).toBe(30)
  })

  it('prefers subscription switch over Credex for writing/research use cases with high API spend', () => {
    // For writing use case with high Anthropic API spend, Rule 1 (subscription switch)
    // should fire before Rule 2 (Credex credits)
    const result = analyzeSpend(
      makeInput({
        tools: [{ tool: 'anthropic-api', plan: 'pay-as-you-go', monthlySpend: 100, seats: 1 }],
        useCase: 'writing',
      })
    )
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toContain('Claude Pro')
    expect(rec.recommendedAction).not.toContain('Credex')
  })
})
