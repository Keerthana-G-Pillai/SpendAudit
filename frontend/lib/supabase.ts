import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function getSupabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
}

let publicClient: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  const url = getSupabaseUrl()
  const key = getAnonKey()
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured')
  }
  if (!publicClient) {
    publicClient = createClient(url, key)
  }
  return publicClient
}

/** @deprecated Use getSupabase() — kept for server components */
export const supabase = {
  from: (table: string) => getSupabase().from(table),
}

export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Supabase service role environment variables are not configured')
  }
  return createClient(url, key)
}
