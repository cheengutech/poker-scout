import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
}

function getUsers(): Record<string, string> {
  return {
    [process.env.AUDREY_PHONE!]: 'Audrey',
    [process.env.LUKA_PHONE!]: 'Luka',
  }
}

function twimlResponse(message: string) {
  return new NextResponse(
    `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${message}</Message></Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  )
}

type ParsedNote = {
  identifier?: string
  style_tags?: string[]
  tendencies?: string[]
  threat_level?: string
  raw_note: string
}

const NOTE_PARSER_PROMPT = `You are a poker player note parser for a serious cash game player. Given a raw SMS note about a poker opponent, extract and return JSON with these fields: identifier (name, seat number, or physical description), style_tags (array: nit, fish, aggro, maniac, calling-station, loose-passive, tricky, solid), tendencies (array of specific behavioral notes), threat_level (low/medium/high), raw_note (original text). Only include fields where you have clear information. Return JSON only, no other text.`

async function parseNoteWithClaude(anthropic: Anthropic, rawNote: string): Promise<ParsedNote | null> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: NOTE_PARSER_PROMPT,
      messages: [{ role: 'user', content: rawNote }]
    })
    const content = response.content[0]
    if (content.type !== 'text') return null
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned) as ParsedNote
  } catch {
    return null
  }
}

async function summarizePlayerWithClaude(
  anthropic: Anthropic,
  playerName: string,
  notes: string[],
  parsedNotes: ParsedNote[]
): Promise<string | null> {
  try {
    const context = parsedNotes.length > 0
      ? `Player: ${playerName}\n\nParsed notes:\n${JSON.stringify(parsedNotes, null, 2)}\n\nRaw notes:\n${notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}`
      : `Player: ${playerName}\n\nRaw notes:\n${notes.map((n, i) => `${i + 1}. ${n}`).join('\n')}`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 300,
      system: 'You are a poker player scouting assistant. Given stored notes about a poker opponent, return a clean 1-2 sentence summary suitable for reading at the table. Be concise and actionable. Include style, key tendencies, and threat level if available. No JSON, just plain text.',
      messages: [{ role: 'user', content: context }]
    })
    const content = response.content[0]
    if (content.type !== 'text') return null
    return content.text.trim()
  } catch {
    return null
  }
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase()
  const anthropic = getAnthropic()
  const USERS = getUsers()
  const formData = await req.formData()
  const body = Object.fromEntries(formData.entries())

  const incomingMsg = body.Body as string
  const fromNumber = body.From as string
  const loggedBy = USERS[fromNumber] || 'Unknown'

  const { data: existingPlayers } = await supabase
    .from('poker_players')
    .select('name, description, notes, parsed_notes, location, logged_by, updated_at')

  // Route the message using Opus (log vs lookup)
  let parsed
  try {
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
      return twimlResponse('Something went wrong.')
    }
    const cleaned = content.text.replace(/```json|```/g, '').trim()
    parsed = JSON.parse(cleaned)
  } catch {
    return twimlResponse('Sorry, something went wrong. Try again.')
  }

  // === LOG action ===
  if (parsed.action === 'log') {
    // Parse the note with Haiku for structured data
    const parsedNote = await parseNoteWithClaude(anthropic, parsed.note)

    const { data: existing } = await supabase
      .from('poker_players')
      .select('*')
      .ilike('name', parsed.name || '')
      .single()

    if (existing) {
      const updatedNotes = [...(existing.notes || []), parsed.note]
      const updatedParsed = [...(existing.parsed_notes || []), ...(parsedNote ? [parsedNote] : [])]
      await supabase
        .from('poker_players')
        .update({
          notes: updatedNotes,
          parsed_notes: updatedParsed,
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
          parsed_notes: parsedNote ? [parsedNote] : [],
          location: parsed.location,
          logged_by: loggedBy,
          phone: fromNumber
        })
    }

    // Build confirmation reply from parsed data
    const identifier = parsedNote?.identifier || parsed.name || 'Unknown player'
    const tags = parsedNote?.style_tags?.length
      ? parsedNote.style_tags.join(', ')
      : null
    const reply = tags
      ? `Got it. ${identifier} tagged as ${tags}. Reply LOOKUP ${parsed.name || identifier} to retrieve.`
      : `Got it. ${identifier} logged. Reply LOOKUP ${parsed.name || identifier} to retrieve.`

    return twimlResponse(reply)
  }

  // === LOOKUP action ===
  if (parsed.action === 'lookup') {
    const { data: found } = await supabase
      .from('poker_players')
      .select('*')
      .ilike('name', `%${parsed.query}%`)
      .single()

    if (!found || !found.notes?.length) {
      return twimlResponse(`No notes found for "${parsed.query}".`)
    }

    // Summarize with Haiku
    const summary = await summarizePlayerWithClaude(
      anthropic,
      found.name || parsed.query,
      found.notes || [],
      found.parsed_notes || []
    )

    return twimlResponse(summary || parsed.reply)
  }

  return twimlResponse(parsed.reply || 'Message received.')
}
