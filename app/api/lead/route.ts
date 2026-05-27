import { NextRequest, NextResponse } from 'next/server'
import { leadSchema } from '@/lib/schemas'
import { getServiceClient } from '@/lib/supabase'

const ipSubmissions = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0]?.trim() ?? 'unknown'
    const now = Date.now()
    const ONE_HOUR = 60 * 60 * 1000
    const record = ipSubmissions.get(ip)

    if (record && now < record.resetAt) {
      if (record.count >= 5) {
        return NextResponse.json({ error: 'Too many submissions. Try again later.' }, { status: 429 })
      }
      record.count++
    } else {
      ipSubmissions.set(ip, { count: 1, resetAt: now + ONE_HOUR })
    }

    const body = await req.json()
    const parsed = leadSchema.safeParse(body)
    if (!parsed.success) {
      console.warn('Lead validation failed:', parsed.error.flatten())
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { email, company, role, teamSize, auditId, auditSlug, totalSavings, website, bookConsultation } =
      parsed.data

    if (website) {
      return NextResponse.json({ success: true })
    }

    const supabase = getServiceClient()
    const { error: dbError } = await supabase.from('leads').insert({
      audit_id: auditId ? Number(auditId) : null,
      email,
      company: company ?? null,
      role: role ?? null,
      team_size: teamSize ?? null,
      // If book_consultation column does not exist yet, this insert might fail if we include it
      // but assuming the schema gets updated, we could include it. 
      // For now we'll handle the logic in the email.
    })

    if (dbError) throw new Error(`Lead insert failed: ${dbError.message}`)

    await sendConfirmationEmail({
      email,
      auditSlug,
      totalSavings: Number(totalSavings) || 0,
      bookConsultation,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}

async function sendConfirmationEmail({
  email,
  auditSlug,
  totalSavings,
  bookConsultation,
}: {
  email: string
  auditSlug: string
  totalSavings: number
  bookConsultation?: boolean
}) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.warn('RESEND_API_KEY not set — skipping confirmation email')
    return
  }

  const isHighSavings = totalSavings > 500
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from,
        to: email,
        subject: 'Your AI spend audit results',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="margin-bottom:8px">Your AI Spend Audit</h2>
            <p>Thanks for using Credex AI Spend Audit. Here is a link to your full results:</p>
            <p>
              <a href="${appUrl}/audit/${auditSlug}" style="color:#000;font-weight:600">
                View your audit →
              </a>
            </p>
            <p><strong>Potential monthly savings: $${totalSavings}</strong></p>
            ${isHighSavings
            ? `
              <div style="background:#f4f4f4;border-radius:8px;padding:16px;margin-top:16px">
                <p style="margin:0;font-weight:600">Credex will reach out</p>
                <p style="margin:8px 0 0">${bookConsultation ? 'Thank you for requesting a consultation! Our team will contact you shortly about capturing further savings through discounted AI credits.' : 'You have over $500/month in identified savings. The Credex team will contact you about capturing further savings through discounted AI credits.'}</p>
              </div>
            `
            : ''
          }
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
            <p style="color:#888;font-size:12px">Credex · credex.rocks</p>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const errBody = await res.text()
      console.error('Resend API error:', res.status, errBody)
    }
  } catch (err) {
    console.error('Failed to send confirmation email:', err)
  }
}
