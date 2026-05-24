// All shared TypeScript types for the audit tool

export type ToolName =
  | 'cursor'
  | 'github-copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic-api'
  | 'openai-api'
  | 'gemini'
  | 'windsurf'
  | 'figma'
  | 'notion'

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export type SavingsTier = 'high' | 'medium' | 'low' | 'optimal'

// One tool entry from the spend form
export interface ToolEntry {
  tool: ToolName
  plan: string
  monthlySpend: number
  seats: number
}

// Full input from the spend form
export interface SpendInput {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

// Recommendation for a single tool
export interface ToolRecommendation {
  tool: ToolName
  currentSpend: number
  recommendedAction: string
  estimatedMonthlySaving: number
  reasoning: string
}

// Full output from the audit engine
export interface AuditResult {
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  totalCurrentSpend: number
  savingsTier: SavingsTier
}

// Row saved to Supabase audits table
export interface AuditRecord {
  id: string
  slug: string
  spend_data: SpendInput
  audit_result: AuditResult
  ai_summary: string
  created_at: string
}

// Row saved to Supabase leads table
export interface LeadRecord {
  id: string
  audit_id: string
  email: string
  company?: string
  role?: string
  team_size?: number
  created_at: string
}

// Public-safe version of audit data (no email/company)
export interface PublicAuditData {
  auditId: string
  auditResult: AuditResult
  aiSummary: string
  useCase: UseCase
  teamSize: number
  slug: string
}
