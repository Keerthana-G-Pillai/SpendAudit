import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

// In-memory rate limiter — resets on cold start, sufficient for MVP
// At scale: replace with Upstash Redis
const ipSubmissions = new Map<string, { count: number; resetAt: number }>()

export async function POST(req: NextRequest) {
  try {
    // Rate limiting: max 5 submissions per IP per hour
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
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

    // Honeypot check — bots fill hidden fields, real users do not
    // Field name is "website" — if filled, silently reject
    if (body.website) {
      return NextResponse.json({ success: true }) // Silent reject — do not tell bots they were caught
    }

    const { email, company, role, teamSize, auditId, auditSlug, totalSavings } = body

    if (!email || !auditSlug) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save lead to Supabase
    const supabase = getServiceClient()
    const { error: dbError } = await supabase.from('leads').insert({
      audit_id: auditId,
      email,
      company: company || null,
      role: role || null,
      team_size: teamSize || null,
    })

    if (dbError) throw new Error(`Lead insert failed: ${dbError.message}`)

    // Send confirmation email via Resend
    const isHighSavings = Number(totalSavings) > 500
    const appUrl = process.env.NEXT_PUBLIC_APP_URL

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'audit@yourdomain.com', // Replace with your verified Resend domain
        to: email,
        subject: 'Your AI spend audit results',
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="margin-bottom:8px">Your AI Spend Audit</h2>
            <p>Thanks for using [App Name]. Here is a link to your full audit:</p>
            <p>
              <a href="${appUrl}/audit/${auditSlug}" style="color:#000;font-weight:600">
                View your audit →
              </a>
            </p>
            <p><strong>Potential monthly savings: $${totalSavings}</strong></p>
            ${isHighSavings ? `
              <div style="background:#f4f4f4;border-radius:8px;padding:16px;margin-top:16px">
                <p style="margin:0;font-weight:600">Credex can help you save even more</p>
                <p style="margin:8px 0 0">Given your significant savings opportunity, the Credex team will be in touch about how to capture further savings through discounted AI credits.</p>
              </div>
            ` : ''}
            <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
            <p style="color:#888;font-size:12px">Credex · credex.rocks</p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead API error:', err)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }
}
