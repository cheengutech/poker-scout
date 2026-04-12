import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Image from 'next/image'

type Player = {
  id: string
  name: string | null
  description: string | null
  notes: string[]
  location: string | null
  logged_by: string
  updated_at: string
  photo_url: string | null
  aggression: string | null
  ethnicity: string | null
  last_hand: string | null
}

const AGGRESSION_COLORS: Record<string, string> = {
  Passive: 'bg-blue-50 text-blue-600 border border-blue-100',
  Moderate: 'bg-amber-50 text-amber-600 border border-amber-100',
  Aggressive: 'bg-orange-50 text-orange-600 border border-orange-100',
  Maniac: 'bg-red-50 text-red-600 border border-red-100',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default async function SharedPlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: player } = await supabase
    .from('poker_players')
    .select('*')
    .eq('id', id)
    .single()

  if (!player) notFound()

  const p = player as Player

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Image src="/mascot.png" alt="Poker Scout" width={32} height={32} className="w-8 h-8 object-contain" />
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-none">Poker Scout</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">shared player notes</p>
          </div>
        </div>
        <a
          href="/signup"
          className="text-xs text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-all border border-emerald-100"
        >
          Sign up free
        </a>
      </header>

      <div className="max-w-2xl mx-auto p-5 md:p-8 mt-4">
        {/* Player header */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            {p.photo_url ? (
              <img src={p.photo_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <span className="text-2xl text-emerald-300 font-semibold">
                  {(p.name?.charAt(0) ?? '?').toUpperCase()}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                {p.name || 'Unknown Player'}
              </h2>
              {p.description && (
                <p className="text-sm text-gray-500 mt-0.5">{p.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {p.aggression && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${AGGRESSION_COLORS[p.aggression] || 'bg-gray-100 text-gray-500'}`}>
                    {p.aggression}
                  </span>
                )}
                {p.location && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">{p.location}</span>
                )}
                {p.ethnicity && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">{p.ethnicity}</span>
                )}
                <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">Updated {timeAgo(p.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile fields */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 divide-y divide-gray-100">
          <h3 className="text-xs font-semibold text-emerald-600/60 uppercase tracking-wider px-6 pt-5 pb-3">Profile</h3>
          {p.aggression && (
            <div className="px-6 py-3.5 flex items-center justify-between">
              <span className="text-sm text-gray-500">Aggression</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded ${AGGRESSION_COLORS[p.aggression]}`}>{p.aggression}</span>
            </div>
          )}
          {p.ethnicity && (
            <div className="px-6 py-3.5 flex items-center justify-between">
              <span className="text-sm text-gray-500">Ethnicity</span>
              <span className="text-sm text-gray-900">{p.ethnicity}</span>
            </div>
          )}
          {p.last_hand && (
            <div className="px-6 py-3.5 flex items-center justify-between">
              <span className="text-sm text-gray-500">Last hand</span>
              <span className="text-sm text-gray-900">{p.last_hand}</span>
            </div>
          )}
          <div className="px-6 py-3.5 flex items-center justify-between">
            <span className="text-sm text-gray-500">Logged by</span>
            <span className="text-sm text-gray-900">{p.logged_by}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <h3 className="text-xs font-semibold text-emerald-600/60 uppercase tracking-wider">Notes</h3>
            <span className="text-xs text-gray-300">{p.notes?.length || 0} total</span>
          </div>

          {(!p.notes || p.notes.length === 0) ? (
            <div className="px-6 pb-6">
              <div className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center">
                <p className="text-gray-300 text-sm">No notes yet</p>
              </div>
            </div>
          ) : (
            <div className="px-6 pb-6 space-y-2">
              {p.notes.map((note, i) => (
                <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-sm leading-relaxed text-gray-700 border border-gray-100">
                  <div className="flex items-start gap-2.5">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold shrink-0 mt-0.5 border border-emerald-100">{i + 1}</span>
                    <p className="flex-1">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 mb-3">Want to build your own villain database?</p>
          <a
            href="/signup"
            className="inline-block bg-emerald-600 hover:bg-emerald-700 rounded-lg px-6 py-2.5 text-sm text-white font-medium transition-colors"
          >
            Get started free
          </a>
        </div>
      </div>
    </div>
  )
}
