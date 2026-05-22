import { notFound } from 'next/navigation'
import { getSupabase } from '@/lib/supabase'
import AuditResults from '@/components/AuditResults'
import type { Metadata } from 'next'
import type { PublicAuditData } from '@backend/lib/types'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data } = await getSupabase()
    .from('audits')
    .select('audit_result, spend_data')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Audit not found' }

  const savings = data.audit_result?.totalMonthlySavings ?? 0
  const teamSize = data.spend_data?.teamSize ?? 0
  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const ogImage = `${appUrl}/api/og?savings=${savings}&team=${teamSize}`

  return {
    title: `I could save $${savings}/month on AI tools — free audit`,
    description: `This ${teamSize}-person team found $${savings * 12} in annual AI tool savings in under 2 minutes. Get your free audit.`,
    openGraph: {
      title: `I could save $${savings}/month on AI tools`,
      description: `Free AI spend audit — find out if you are overpaying for Cursor, ChatGPT, Claude and more. Takes 2 minutes.`,
      url: `${appUrl}/audit/${params.slug}`,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Save $${savings}/month on AI tools` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `I could save $${savings}/month on AI tools`,
      description: 'Get your free AI spend audit in 2 minutes.',
      images: [ogImage],
    },
  }
}

export default async function AuditPage({ params }: Props) {
  const { data, error } = await getSupabase()
    .from('audits')
    .select('id, audit_result, ai_summary, spend_data')
    .eq('slug', params.slug)
    .single()

  if (error || !data) notFound()

  const publicData: PublicAuditData = {
    auditId: data.id,
    auditResult: data.audit_result,
    aiSummary: data.ai_summary,
    useCase: data.spend_data?.useCase,
    teamSize: data.spend_data?.teamSize,
    slug: params.slug,
  }

  return <AuditResults data={publicData} />
}
