import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!
})

const USERS: Record<string, string> = {
  [process.env.AUDREY_PHONE!]: 'Audrey',
  [process.env.LUKA_PHONE!]: 'Luka'
}

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const body = Object.fromEntries(formData.entries())

  const incomingMsg = body.Body as string
  const fromNumber = body.From as string
  const loggedBy = USERS[fromNumber] || 'Unknown'

  const { data: existingPlayers } = await supabase
    .from('poker_players')
    .select('name, description, notes, location, logged_by, updated_at')

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-20250514',
    max_tokens: 1000,
    system: `You are a poker player database assistant. You help two professional poker players (Audrey and Luka) log and look up notes on players they encounter at the table.

Current database:
${JSON.stringify(existingPlayers, null, 2)}

The user sending this message is: ${loggedBy}

Determine if the message is:
1. LOGGING a new player or adding a note to an existing one
2. LOOKING UP a player

CRITICAL: Respond ONLY with raw JSON. No explanation, no preamble, no markdown, no code blocks. Your entire response must be parseable by JSON.parse(). If you are unsure, default to the log action.

For logging:
{
  "action": "log",
  "name": "player name or null if unknown",
  "description": "physical description if given",
  "note": "the note to add",
  "location": "cardroom name if mentioned or null",
  "reply": "confirmation message to send back via SMS"
}

For lookup:
{
  "action": "lookup",
  "query": "who they're searching for",
  "reply": "full summary of what we know about this player based on the database, or 'No notes found' if nothing exists"
}`,
    messages: [{ role: 'user', content: incomingMsg }]
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Something went wrong.</Message></Response>', {
      headers: { 'Content-Type': 'text/xml' }
    })
  }

  let parsed
  try {
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch (e) {
    return new NextResponse('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Sorry, something went wrong. Try again.</Message></Response>', {
      headers: { 'Content-Type': 'text/xml' }
    })
  }

  if (parsed.action === 'log') {
    const { data: existing } = await supabase
      .from('poker_players')
      .select('*')
      .ilike('name', parsed.name || '')
      .single()

    if (existing) {
      await supabase
        .from('poker_players')
        .update({
          notes: [...(existing.notes || []), parsed.note],
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('poker_players')
        .insert({
          name: parsed.name,
          description: parsed.description,
          notes: [parsed.note],
          location: parsed.location,
          logged_by: loggedBy,
          phone: fromNumber
        })
    }
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${parsed.reply}</Message></Response>`

  return new NextResponse(twiml, {
    headers: { 'Content-Type': 'text/xml' }
  })
}