'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { useRouter } from 'next/navigation'

type Player = {
  id: string
  name: string | null
  description: string | null
  notes: string[]
  location: string | null
  logged_by: string
  updated_at: string
}

const supabase = createClient()

export default function AppDashboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterLoggedBy, setFilterLoggedBy] = useState('all')
  const [selected, setSelected] = useState<Player | null>(null)
  const [newNote, setNewNote] = useState('')
  const [adding, setAdding] = useState(false)
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  const fetchPlayers = useCallback(async () => {
    const { data } = await supabase
      .from('poker_players')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setPlayers(data)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email ?? '')
    })
    fetchPlayers()
  }, [fetchPlayers])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  async function addNote() {
    if (!selected || !newNote.trim()) return
    setAdding(true)
    const updated = [...(selected.notes || []), newNote.trim()]
    await supabase
      .from('poker_players')
      .update({ notes: updated, updated_at: new Date().toISOString() })
      .eq('id', selected.id)
    setNewNote('')
    setAdding(false)
    await fetchPlayers()
    setSelected(prev => prev ? { ...prev, notes: updated } : null)
  }

  function selectPlayer(player: Player) {
    setSelected(player)
    setShowMobileDetail(true)
  }

  const locations = ['all', ...Array.from(new Set(players.map(p => p.location).filter(Boolean)))] as string[]
  const loggers = ['all', ...Array.from(new Set(players.map(p => p.logged_by).filter(Boolean)))] as string[]

  const filtered = players.filter(p => {
    const matchSearch = search === '' ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.notes?.some(n => n.toLowerCase().includes(search.toLowerCase()))
    const matchLocation = filterLocation === 'all' || p.location === filterLocation
    const matchLogger = filterLoggedBy === 'all' || p.logged_by === filterLoggedBy
    return matchSearch && matchLocation && matchLogger
  })

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8e0d0] font-serif">
      {/* Header */}
      <div className="border-b border-[#1a3a1a] px-4 md:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg text-[#7ab87a] tracking-[3px] uppercase font-light">Poker Scout</h1>
          <p className="text-[11px] text-[#4a6a4a] tracking-wider mt-0.5">villain database</p>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden md:flex gap-6">
            <div className="text-center">
              <div className="text-xl text-[#7ab87a] font-light">{players.length}</div>
              <div className="text-[11px] text-[#4a6a4a] tracking-wider">PLAYERS</div>
            </div>
            <div className="text-center">
              <div className="text-xl text-[#7ab87a] font-light">{players.reduce((acc, p) => acc + (p.notes?.length || 0), 0)}</div>
              <div className="text-[11px] text-[#4a6a4a] tracking-wider">NOTES</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-[#4a6a4a]">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-xs text-[#4a6a4a] hover:text-[#7ab87a] border border-[#1a3a1a] px-3 py-1.5 rounded transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Left panel — player list */}
        <div className={`w-full md:w-[380px] md:border-r border-[#1a3a1a] flex flex-col ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
          {/* Search + filters */}
          <div className="p-4 border-b border-[#1a3a1a]">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players, notes..."
              className="w-full bg-[#111811] border border-[#2a4a2a] rounded px-3 py-2 text-sm text-[#e8e0d0] focus:border-[#3a7a3a] outline-none mb-2.5"
            />
            <div className="flex gap-2">
              <select
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                className="flex-1 bg-[#111811] border border-[#2a4a2a] rounded px-2 py-1.5 text-xs text-[#e8e0d0] outline-none"
              >
                {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'All locations' : l}</option>)}
              </select>
              <select
                value={filterLoggedBy}
                onChange={e => setFilterLoggedBy(e.target.value)}
                className="flex-1 bg-[#111811] border border-[#2a4a2a] rounded px-2 py-1.5 text-xs text-[#e8e0d0] outline-none"
              >
                {loggers.map(l => <option key={l} value={l}>{l === 'all' ? 'All loggers' : l}</option>)}
              </select>
            </div>
          </div>

          {/* Player list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="p-8 text-center text-[#4a6a4a] text-sm">No players found</div>
            )}
            {filtered.map(player => (
              <div
                key={player.id}
                onClick={() => selectPlayer(player)}
                className={`px-4 py-3.5 border-b border-[#111811] cursor-pointer transition-all hover:bg-[#1a2a1a] ${
                  selected?.id === player.id ? 'bg-[#1a2a1a] border-l-[3px] border-l-[#7ab87a]' : 'border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="min-w-0">
                    <div className="text-sm text-[#e8e0d0] truncate">
                      {player.name || <span className="text-[#4a6a4a] italic">Unknown</span>}
                    </div>
                    {player.description && (
                      <div className="text-xs text-[#6a8a6a] mt-0.5 truncate">{player.description}</div>
                    )}
                    <div className="text-[11px] text-[#4a6a4a] mt-1">
                      {player.notes?.length || 0} note{(player.notes?.length || 0) !== 1 ? 's' : ''} · {player.logged_by}
                      {player.location && ` · ${player.location}`}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#3a5a3a] whitespace-nowrap ml-2">
                    {new Date(player.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — player detail */}
        <div className={`flex-1 overflow-y-auto ${showMobileDetail ? 'block' : 'hidden md:block'}`}>
          {!selected ? (
            <div className="flex items-center justify-center h-full text-[#3a5a3a] text-sm italic">
              Select a player to view their profile
            </div>
          ) : (
            <div className="p-6 md:p-8 max-w-2xl">
              {/* Back button — mobile only */}
              <button
                onClick={() => setShowMobileDetail(false)}
                className="md:hidden text-xs text-[#4a6a4a] hover:text-[#7ab87a] mb-4 transition-colors"
              >
                &larr; Back to list
              </button>

              {/* Player header */}
              <div className="mb-8">
                <h2 className="text-2xl md:text-[28px] text-[#7ab87a] font-light tracking-wide mb-1.5">
                  {selected.name || 'Unknown Player'}
                </h2>
                {selected.description && (
                  <p className="text-sm text-[#6a8a6a] mb-3">{selected.description}</p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4a6a4a]">
                  {selected.location && <span>📍 {selected.location}</span>}
                  <span>Logged by {selected.logged_by}</span>
                  <span>Updated {new Date(selected.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-8">
                <h3 className="text-xs tracking-[2px] text-[#4a6a4a] uppercase mb-4">Notes</h3>
                {(!selected.notes || selected.notes.length === 0) ? (
                  <p className="text-[#3a5a3a] italic text-sm">No notes yet.</p>
                ) : (
                  <div className="space-y-3">
                    {selected.notes.map((note, i) => (
                      <div key={i} className="bg-[#111811] border border-[#1a3a1a] rounded px-4 py-3 text-sm leading-relaxed text-[#c8c0b0]">
                        <span className="text-[#3a5a3a] text-[11px] font-mono mr-2">#{i + 1}</span>
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add note */}
              <div>
                <h3 className="text-xs tracking-[2px] text-[#4a6a4a] uppercase mb-3">Add note</h3>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add a new observation..."
                  rows={3}
                  className="w-full bg-[#111811] border border-[#2a4a2a] rounded px-3 py-2.5 text-sm text-[#e8e0d0] resize-y outline-none focus:border-[#3a7a3a] mb-3"
                />
                <button
                  onClick={addNote}
                  disabled={adding || !newNote.trim()}
                  className="bg-[#2a5a2a] border border-[#3a7a3a] rounded px-5 py-2 text-sm text-[#7ab87a] tracking-wide hover:bg-[#3a6a3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding ? 'Saving...' : 'Save note'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
