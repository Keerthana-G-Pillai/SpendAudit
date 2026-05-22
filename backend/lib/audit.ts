// lib/audit.ts
// Pure audit engine — no React, no API calls, no side effects.
// Input: SpendInput. Output: AuditResult.
// Every recommendation must be defensible to a finance person with exact numbers.
// All pricing sourced from PRICING_DATA.md — verified against official vendor pages.

import type { SpendInput, AuditResult, ToolRecommendation, ToolEntry } from './types'

// ─── Pricing reference (USD/user/month unless noted) ─────────────────────────
// Keep this in sync with PRICING_DATA.md at all times.
export const PRICING = {
  cursor: { hobby: 0, pro: 20, business: 40 },
  'github-copilot': { individual: 10, business: 19, enterprise: 39 },
  claude: { free: 0, pro: 20, max: 100, team: 30 },
  chatgpt: { plus: 20, team: 30 },
  windsurf: { free: 0, pro: 15, teams: 35 },
  gemini: { pro: 0, ultra: 19.99 },
  'anthropic-api': { 'pay-as-you-go': 0 },
  'openai-api': { 'pay-as-you-go': 0 },
} as const

// ─── Credex credits discount ──────────────────────────────────────────────────
// Credex sells discounted AI credits at up to 40% off retail.
// Conservative estimate: 30% savings for audit recommendations.
const CREDEX_DISCOUNT_RATE = 0.30
const CREDEX_MIN_SPEND_THRESHOLD = 50 // Only recommend Credex for $50+/mo API spend

// ─── Thresholds ───────────────────────────────────────────────────────────────
const TEAM_SIZE_THRESHOLDS = {
  chatgptTeamJustified: 5,    // Team plan justified at 5+ users
  cursorBusinessJustified: 4, // Business plan justified at 4+ users
  windsurfTeamsJustified: 4,  // Teams plan justified at 4+ users
  copilotEnterpriseJustified: 10, // Enterprise justified at 10+ users
  claudeTeamSmall: 2,         // Team plan vs individual Pro check below this
}

// ─── Main export ─────────────────────────────────────────────────────────────
export function analyzeSpend(input: SpendInput): AuditResult {
  const recommendations: ToolRecommendation[] = input.tools.map((entry) =>
    analyzeToolEntry(entry, input)
  )

  const totalMonthlySavings = Math.round(
    recommendations.reduce((sum, r) => sum + r.estimatedMonthlySaving, 0)
  )
  const totalCurrentSpend = Math.round(
    recommendations.reduce((sum, r) => sum + r.currentSpend, 0)
  )
  const totalAnnualSavings = totalMonthlySavings * 12

  const savingsTier =
    totalMonthlySavings > 500
      ? 'high'
      : totalMonthlySavings > 100
      ? 'medium'
      : totalMonthlySavings > 0
      ? 'low'
      : 'optimal'

  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    totalCurrentSpend,
    savingsTier,
  }
}

// ─── Per-tool routing ─────────────────────────────────────────────────────────
function analyzeToolEntry(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  switch (entry.tool) {
    case 'chatgpt':      return analyzeChatGPT(entry, input)
    case 'cursor':       return analyzeCursor(entry, input)
    case 'claude':       return analyzeClaude(entry, input)
    case 'github-copilot': return analyzeGithubCopilot(entry, input)
    case 'windsurf':     return analyzeWindsurf(entry, input)
    case 'gemini':       return analyzeGemini(entry, input)
    case 'anthropic-api': return analyzeAnthropicAPI(entry, input)
    case 'openai-api':   return analyzeOpenAIAPI(entry, input)
    default:             return noSavingsFound(entry)
  }
}

// ─── Tool-specific analysis ───────────────────────────────────────────────────

function analyzeChatGPT(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  const { seats } = entry

  // Rule 1: Team plan for small teams — Plus is cheaper, same capability
  if (entry.plan === 'team' && seats < TEAM_SIZE_THRESHOLDS.chatgptTeamJustified) {
    const currentCost = PRICING.chatgpt.team * seats
    const cheaperCost = PRICING.chatgpt.plus * seats
    const saving = currentCost - cheaperCost
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: `Downgrade ${seats} seat${seats > 1 ? 's' : ''} from ChatGPT Team to ChatGPT Plus`,
      estimatedMonthlySaving: saving,
      reasoning: `ChatGPT Team ($${PRICING.chatgpt.team}/user/mo) vs Plus ($${PRICING.chatgpt.plus}/user/mo) — Team adds shared workspaces and admin controls, which are unnecessary for teams under ${TEAM_SIZE_THRESHOLDS.chatgptTeamJustified} with standard prompting usage. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: API direct for interactive use cases — subscription may be cheaper
  if (
    entry.plan === 'api-direct' &&
    entry.monthlySpend > PRICING.chatgpt.plus &&
    (input.useCase === 'writing' || input.useCase === 'research')
  ) {
    const saving = Math.round(entry.monthlySpend - PRICING.chatgpt.plus)
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Consider ChatGPT Plus subscription instead of API direct',
      estimatedMonthlySaving: saving,
      reasoning: `At $${entry.monthlySpend}/mo on API direct, a ChatGPT Plus subscription ($${PRICING.chatgpt.plus}/mo flat) may be cheaper for regular conversational use. API direct is cost-effective for high-volume automated tasks, not interactive daily use.`,
    }
  }

  // Rule 3: Paying retail API rates when Credex credits are available
  if (
    entry.plan === 'api-direct' &&
    entry.monthlySpend >= CREDEX_MIN_SPEND_THRESHOLD &&
    isCredexEligibleUseCase(input.useCase)
  ) {
    return recommendCredexCredits(entry, 'OpenAI')
  }

  return noSavingsFound(entry)
}

function analyzeCursor(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  const { seats } = entry

  // Rule 1: Business plan for small teams — Pro has identical AI features
  if (entry.plan === 'business' && seats < TEAM_SIZE_THRESHOLDS.cursorBusinessJustified) {
    const saving = (PRICING.cursor.business - PRICING.cursor.pro) * seats
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: `Downgrade ${seats} Cursor seat${seats > 1 ? 's' : ''} from Business to Pro`,
      estimatedMonthlySaving: saving,
      reasoning: `Cursor Business ($${PRICING.cursor.business}/user/mo) adds SSO, centralized billing, and an admin dashboard. For teams under ${TEAM_SIZE_THRESHOLDS.cursorBusinessJustified}, Pro ($${PRICING.cursor.pro}/user/mo) has identical AI completion features. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: Non-coding use case — Cursor is purpose-built for code, may be overkill
  if (
    entry.plan !== 'hobby' &&
    (input.useCase === 'writing' || input.useCase === 'research') &&
    entry.monthlySpend > 0
  ) {
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Evaluate whether Cursor is being actively used for your primary use case',
      estimatedMonthlySaving: 0,
      reasoning: `Cursor is an AI-first code editor. For a ${input.useCase} primary use case, tools like Claude Pro ($${PRICING.claude.pro}/mo) or ChatGPT Plus ($${PRICING.chatgpt.plus}/mo) may deliver more value per dollar. Worth auditing actual usage before next renewal.`,
    }
  }

  return noSavingsFound(entry)
}

function analyzeClaude(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  // Rule 1: Max plan — only justified if hitting Pro rate limits daily
  if (entry.plan === 'max' && entry.seats === 1) {
    const saving = PRICING.claude.max - PRICING.claude.pro
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Downgrade Claude Max to Claude Pro unless you hit rate limits daily',
      estimatedMonthlySaving: saving,
      reasoning: `Claude Max ($${PRICING.claude.max}/mo) is designed for power users who consistently exhaust Pro limits. Claude Pro ($${PRICING.claude.pro}/mo) covers standard daily use with generous limits. If you are not regularly seeing rate limit messages on Pro, Max is not cost-effective. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: Team plan for very small teams — individual Pro plans may be cheaper
  if (entry.plan === 'team' && entry.seats <= TEAM_SIZE_THRESHOLDS.claudeTeamSmall) {
    const teamTotal = PRICING.claude.team * entry.seats
    const proTotal = PRICING.claude.pro * entry.seats
    const saving = teamTotal - proTotal
    if (saving > 0) {
      return {
        tool: entry.tool,
        currentSpend: entry.monthlySpend,
        recommendedAction: `Switch ${entry.seats} Claude Team seats to individual Pro plans`,
        estimatedMonthlySaving: saving,
        reasoning: `Claude Team ($${PRICING.claude.team}/user/mo) adds centralized billing and admin controls. For just ${entry.seats} user${entry.seats > 1 ? 's' : ''}, individual Pro plans ($${PRICING.claude.pro}/user/mo each) provide equivalent AI access. Saves $${saving}/mo ($${saving * 12}/yr).`,
      }
    }
  }

  // Rule 3: API direct — flag if monthly spend is very high without a clear automation use case
  if (
    entry.plan === 'api-direct' &&
    entry.monthlySpend > 100 &&
    (input.useCase === 'writing' || input.useCase === 'research')
  ) {
    const saving = Math.round(entry.monthlySpend - PRICING.claude.pro)
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Evaluate Claude Pro subscription vs API direct for interactive use',
      estimatedMonthlySaving: saving,
      reasoning: `At $${entry.monthlySpend}/mo on Anthropic API direct for ${input.useCase} tasks, a Claude Pro subscription ($${PRICING.claude.pro}/mo flat) is likely more cost-efficient unless you are running high-volume automated pipelines. API pricing is optimized for programmatic workloads, not conversational use.`,
    }
  }

  return noSavingsFound(entry)
}

function analyzeGithubCopilot(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  const { seats } = entry

  // Rule 1: Enterprise for smaller teams — Business covers most needs
  if (entry.plan === 'enterprise' && seats < TEAM_SIZE_THRESHOLDS.copilotEnterpriseJustified) {
    const saving = (PRICING['github-copilot'].enterprise - PRICING['github-copilot'].business) * seats
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: `Downgrade ${seats} GitHub Copilot seats from Enterprise to Business`,
      estimatedMonthlySaving: saving,
      reasoning: `Copilot Enterprise ($${PRICING['github-copilot'].enterprise}/user/mo) adds fine-tuning on your private codebase and Copilot in GitHub.com. These features require large codebases to deliver ROI. Business ($${PRICING['github-copilot'].business}/user/mo) includes policy controls, audit logs, and all standard completions. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: Non-coding use case — Copilot is only useful for developers
  if (entry.plan !== 'individual' && input.useCase !== 'coding' && input.useCase !== 'mixed') {
    const currentCost = PRICING['github-copilot'].business * seats
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Consider cancelling GitHub Copilot — not suited to your primary use case',
      estimatedMonthlySaving: entry.monthlySpend,
      reasoning: `GitHub Copilot is a developer code completion tool. With a primary use case of ${input.useCase}, your team is unlikely to be getting full value. Cancelling saves $${entry.monthlySpend}/mo ($${entry.monthlySpend * 12}/yr) — reinvest in tools built for ${input.useCase}.`,
    }
  }

  return noSavingsFound(entry)
}

function analyzeWindsurf(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  const { seats } = entry

  // Rule 1: Teams plan for small teams — Pro is sufficient
  if (entry.plan === 'teams' && seats < TEAM_SIZE_THRESHOLDS.windsurfTeamsJustified) {
    const saving = (PRICING.windsurf.teams - PRICING.windsurf.pro) * seats
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: `Downgrade ${seats} Windsurf seat${seats > 1 ? 's' : ''} from Teams to Pro`,
      estimatedMonthlySaving: saving,
      reasoning: `Windsurf Teams ($${PRICING.windsurf.teams}/user/mo) adds team management and centralized billing — not needed for teams under ${TEAM_SIZE_THRESHOLDS.windsurfTeamsJustified}. Pro ($${PRICING.windsurf.pro}/user/mo) provides the same AI coding features. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: Paying for both Windsurf and Cursor — overlapping tools
  return noSavingsFound(entry)
}

function analyzeGemini(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  // Rule 1: Ultra for coding use case — Cursor is purpose-built and similarly priced
  if (entry.plan === 'ultra' && input.useCase === 'coding') {
    const saving = Math.round(PRICING.gemini.ultra - PRICING.cursor.pro)
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Evaluate switching from Gemini Ultra to Cursor Pro for coding tasks',
      estimatedMonthlySaving: saving > 0 ? saving : 0,
      reasoning: `Gemini Ultra ($${PRICING.gemini.ultra}/mo) is a general-purpose model. For a coding-first team, Cursor Pro ($${PRICING.cursor.pro}/user/mo) provides IDE-integrated completions, inline editing, and codebase context that Gemini alone cannot match. ${saving > 0 ? `Saves $${saving}/mo and improves coding workflow.` : 'Similar price point but better fit for coding workflows.'}`,
    }
  }

  // Rule 2: API direct with high spend — flag for review
  if (entry.plan === 'api' && entry.monthlySpend > 50 && input.useCase !== 'data') {
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Review Gemini API usage — consider Gemini Pro (free) for interactive use',
      estimatedMonthlySaving: 0,
      reasoning: `Gemini API charges per token. For non-data use cases, Gemini Pro (free tier) handles interactive use. API costs are justified for automated, high-volume pipelines — if this is manual usage, the free tier may cover it.`,
    }
  }

  // Rule 3: Paying retail Gemini API rates when Credex credits are available
  if (
    entry.plan === 'api' &&
    entry.monthlySpend >= CREDEX_MIN_SPEND_THRESHOLD &&
    isCredexEligibleUseCase(input.useCase)
  ) {
    return recommendCredexCredits(entry, 'Google AI')
  }

  return noSavingsFound(entry)
}

function analyzeAnthropicAPI(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  // Rule 1: High spend on API direct for non-automated use case
  if (
    entry.monthlySpend > PRICING.claude.pro &&
    (input.useCase === 'writing' || input.useCase === 'research')
  ) {
    const saving = Math.round(entry.monthlySpend - PRICING.claude.pro)
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Switch from Anthropic API Direct to Claude Pro subscription',
      estimatedMonthlySaving: saving,
      reasoning: `At $${entry.monthlySpend}/mo on Anthropic API for ${input.useCase} tasks, a Claude Pro subscription ($${PRICING.claude.pro}/mo flat) delivers the same model access at a fixed cost. API billing is optimized for programmatic pipelines — for interactive daily use, the subscription is almost always cheaper. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: Paying retail API rates when Credex credits are available
  if (entry.monthlySpend >= CREDEX_MIN_SPEND_THRESHOLD) {
    return recommendCredexCredits(entry, 'Anthropic')
  }

  return noSavingsFound(entry)
}

function analyzeOpenAIAPI(entry: ToolEntry, input: SpendInput): ToolRecommendation {
  // Rule 1: High API spend for interactive use — ChatGPT subscription may be cheaper
  if (
    entry.monthlySpend > PRICING.chatgpt.plus &&
    (input.useCase === 'writing' || input.useCase === 'research')
  ) {
    const saving = Math.round(entry.monthlySpend - PRICING.chatgpt.plus)
    return {
      tool: entry.tool,
      currentSpend: entry.monthlySpend,
      recommendedAction: 'Switch from OpenAI API Direct to ChatGPT Plus subscription',
      estimatedMonthlySaving: saving,
      reasoning: `At $${entry.monthlySpend}/mo on OpenAI API for ${input.useCase} tasks, a ChatGPT Plus subscription ($${PRICING.chatgpt.plus}/mo flat) delivers GPT-4o access at a fixed predictable cost. API pricing scales with volume — for human interactive use, the Plus plan is almost always cheaper. Saves $${saving}/mo ($${saving * 12}/yr).`,
    }
  }

  // Rule 2: Paying retail API rates when Credex credits are available
  if (entry.monthlySpend >= CREDEX_MIN_SPEND_THRESHOLD) {
    return recommendCredexCredits(entry, 'OpenAI')
  }

  return noSavingsFound(entry)
}

// ─── Overlap detection ────────────────────────────────────────────────────────
// Exported so it can be called separately from the main analyzeSpend if needed
export function detectOverlaps(input: SpendInput): string[] {
  const tools = input.tools.map((t) => t.tool)
  const warnings: string[] = []

  const hasCursor = tools.includes('cursor')
  const hasCopilot = tools.includes('github-copilot')
  const hasWindsurf = tools.includes('windsurf')
  const hasChatGPT = tools.includes('chatgpt')
  const hasAnthropicAPI = tools.includes('anthropic-api')
  const hasClaude = tools.includes('claude')
  const hasOpenAIAPI = tools.includes('openai-api')

  // Coding tool overlap
  if (hasCursor && hasWindsurf) {
    warnings.push(
      'You are paying for both Cursor and Windsurf — these are direct substitutes. Consolidate to one AI code editor and save one full subscription.'
    )
  }

  if (hasCursor && hasCopilot) {
    warnings.push(
      'You are paying for both Cursor and GitHub Copilot. Cursor includes its own AI completions — many teams find Copilot redundant once Cursor is in use. Review actual usage before renewing Copilot.'
    )
  }

  // API + subscription overlap
  if (hasAnthropicAPI && hasClaude) {
    warnings.push(
      'You have both Anthropic API Direct and a Claude subscription. Ensure these serve different use cases (API for automated pipelines, subscription for interactive use) or you may be double-paying for the same model.'
    )
  }

  if (hasOpenAIAPI && hasChatGPT) {
    warnings.push(
      'You have both OpenAI API Direct and a ChatGPT subscription. Confirm they serve distinct use cases to avoid paying twice for GPT-4o access.'
    )
  }

  return warnings
}

// ─── Credex credits (4th evaluation criterion) ───────────────────────────────
// Paying retail API rates when discounted Credex credits are available.
function recommendCredexCredits(
  entry: ToolEntry,
  providerLabel: string
): ToolRecommendation {
  const saving = Math.round(entry.monthlySpend * CREDEX_DISCOUNT_RATE)
  return {
    tool: entry.tool,
    currentSpend: entry.monthlySpend,
    recommendedAction: `Purchase ${providerLabel} API credits through Credex at up to 30% off retail`,
    estimatedMonthlySaving: saving,
    reasoning: `You are spending $${entry.monthlySpend}/mo on ${providerLabel} at retail pay-as-you-go rates. Credex sells discounted AI credits sourced from companies that overforecast — same API access, up to 30% cheaper. At your current usage, that is ~$${saving}/mo ($${saving * 12}/yr) with no workflow changes.`,
  }
}

function isCredexEligibleUseCase(useCase: SpendInput['useCase']): boolean {
  return useCase === 'coding' || useCase === 'data' || useCase === 'mixed'
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function noSavingsFound(entry: ToolEntry): ToolRecommendation {
  return {
    tool: entry.tool,
    currentSpend: entry.monthlySpend,
    recommendedAction: 'No change recommended',
    estimatedMonthlySaving: 0,
    reasoning: 'Current plan appears well-matched to your team size and use case.',
  }
}
