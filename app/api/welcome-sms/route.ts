import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.WELCOME_SMS_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { phone, name } = await req.json()
  if (!phone) {
    return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  )

  const greeting = name ? `Hey ${name}!` : 'Hey!'
  const pokerScoutNumber = process.env.POKER_SCOUT_PHONE || 'this number'

  const welcomeMessage = `${greeting} Welcome to Poker Scout. Here's how to build your villain database by text:

LOG A PLAYER — Just text a note naturally:
"Mike in seat 3 at Bellagio, total fish, calls everything"
"Old guy white hat, super nit, only plays premiums"

We'll parse it automatically — name, style tags, tendencies, threat level.

LOOK UP A PLAYER — Text:
"LOOKUP Mike"
You'll get a quick summary of everything you've logged.

TIPS:
- Include the player's name or a description
- Mention the casino/card room
- Note betting patterns, tells, style
- The more detail, the better your reads

Save this number (${pokerScoutNumber}) and text your first note from the table. Good luck out there.`

  try {
    await client.messages.create({
      body: welcomeMessage,
      messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID!,
      to: phone,
    })
    return NextResponse.json({ sent: true })
  } catch (error) {
    console.error('Welcome SMS failed:', error)
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 })
  }
}
