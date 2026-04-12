import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app'

  if (code) {
    const supabase = await createClient()
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Send welcome SMS if user has a phone number in metadata
      const phone = data.user?.user_metadata?.phone
      if (phone) {
        const name = data.user?.user_metadata?.name
          || data.user?.email?.split('@')[0]
        try {
          await fetch(`${origin}/api/welcome-sms`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.WELCOME_SMS_SECRET}`,
            },
            body: JSON.stringify({ phone, name }),
          })
        } catch {
          // Don't block auth flow if SMS fails
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
