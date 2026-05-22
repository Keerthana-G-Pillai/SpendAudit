import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const savings = searchParams.get('savings') ?? '0'
  const teamSize = searchParams.get('team') ?? '1'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#111111',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: '24px',
              color: '#888888',
              textTransform: 'uppercase',
              letterSpacing: '4px',
            }}
          >
            AI Spend Audit
          </div>
          <div
            style={{
              fontSize: '80px',
              fontWeight: 700,
              lineHeight: 1,
            }}
          >
            Save ${savings}/mo
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#aaaaaa',
            }}
          >
            ${(Number(savings) * 12).toLocaleString()} per year · {teamSize}-person team
          </div>
          <div
            style={{
              marginTop: '32px',
              fontSize: '20px',
              color: '#666666',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            Powered by Credex · credex.rocks
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
