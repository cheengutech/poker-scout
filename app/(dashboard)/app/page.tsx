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
  const [showAddPlayer, setShowAddPlayer] = useState(false)
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerDesc, setNewPlayerDesc] = useState('')
  const [newPlayerLocation, setNewPlayerLocation] = useState('')
  const [newPlayerNote, setNewPlayerNote] = useState('')
  const [savingPlayer, setSavingPlayer] = useState(false)
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

  async function addPlayer() {
    if (!newPlayerName.trim() && !newPlayerNote.trim()) return
    setSavingPlayer(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('poker_players').insert({
      name: newPlayerName.trim() || null,
      description: newPlayerDesc.trim() || null,
      location: newPlayerLocation.trim() || null,
      notes: newPlayerNote.trim() ? [newPlayerNote.trim()] : [],
      logged_by: user?.email ?? 'Unknown',
      phone: '',
    })
    setNewPlayerName('')
    setNewPlayerDesc('')
    setNewPlayerLocation('')
    setNewPlayerNote('')
    setSavingPlayer(false)
    setShowAddPlayer(false)
    await fetchPlayers()
  }

  function selectPlayer(player: Player) {
    setSelected(player)
    setShowMobileDetail(true)
  }

  const locations = ['all', ...Array.from(new Set(players.map(p => p.location).filter(Boolean)))] as string[]
  const loggers = ['all', ...Array.from(new Set(players.map(p => p.logged_by).filter(Boolean)))] as string[]
  const totalNotes = players.reduce((acc, p) => acc + (p.notes?.length || 0), 0)

  const filtered = players.filter(p => {
    const matchSearch = search === '' ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.notes?.some(n => n.toLowerCase().includes(search.toLowerCase()))
    const matchLocation = filterLocation === 'all' || p.location === filterLocation
    const matchLogger = filterLoggedBy === 'all' || p.logged_by === filterLoggedBy
    return matchSearch && matchLocation && matchLogger
  })

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

  return (
    <div className="min-h-screen bg-[#060a06] text-[#e8e0d0]">
      {/* Header */}
      <header className="bg-[#0a0f0a]/80 backdrop-blur-md border-b border-[#1a3a1a] px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2a5a2a] to-[#1a3a1a] flex items-center justify-center border border-[#3a7a3a]/30">
            <span className="text-[#7ab87a] text-xs font-bold tracking-wider">PS</span>
          </div>
          <div>
            <h1 className="text-base text-[#7ab87a] tracking-[3px] uppercase font-light leading-none">Poker Scout</h1>
            <p className="text-[10px] text-[#3a5a3a] tracking-wider mt-0.5">villain database</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-5">
          {/* Stats pills */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#111811] border border-[#1a3a1a] rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7ab87a]" />
              <span className="text-xs text-[#7ab87a] font-medium">{players.length}</span>
              <span className="text-[10px] text-[#4a6a4a]">players</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#111811] border border-[#1a3a1a] rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#5a9a5a]" />
              <span className="text-xs text-[#7ab87a] font-medium">{totalNotes}</span>
              <span className="text-[10px] text-[#4a6a4a]">notes</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#111811] border border-[#1a3a1a] rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4a8a4a]" />
              <span className="text-xs text-[#7ab87a] font-medium">{locations.length - 1}</span>
              <span className="text-[10px] text-[#4a6a4a]">locations</span>
            </div>
          </div>
          <div className="w-px h-6 bg-[#1a3a1a] hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#3a7a3a] to-[#2a5a2a] flex items-center justify-center">
                <span className="text-[10px] text-[#c8eac8] font-medium">{userEmail.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs text-[#4a6a4a] max-w-[120px] truncate">{userEmail}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-[11px] text-[#4a6a4a] hover:text-[#e8e0d0] bg-[#111811] hover:bg-[#1a2a1a] border border-[#1a3a1a] px-3 py-1.5 rounded-md transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left panel — player list */}
        <div className={`w-full md:w-[360px] lg:w-[400px] md:border-r border-[#1a3a1a]/60 flex flex-col bg-[#080c08] ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
          {/* Search + filters + add */}
          <div className="p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#3a5a3a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search players, notes..."
                className="w-full bg-[#0e140e] border border-[#1a3a1a] rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#e8e0d0] placeholder:text-[#2a4a2a] focus:border-[#3a7a3a] focus:bg-[#111811] outline-none transition-all"
              />
            </div>

            {/* Filters row */}
            <div className="flex gap-2">
              <select
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                className="flex-1 bg-[#0e140e] border border-[#1a3a1a] rounded-lg px-2.5 py-2 text-xs text-[#8a9a8a] outline-none focus:border-[#3a7a3a] transition-colors appearance-none cursor-pointer"
              >
                {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'All locations' : l}</option>)}
              </select>
              <select
                value={filterLoggedBy}
                onChange={e => setFilterLoggedBy(e.target.value)}
                className="flex-1 bg-[#0e140e] border border-[#1a3a1a] rounded-lg px-2.5 py-2 text-xs text-[#8a9a8a] outline-none focus:border-[#3a7a3a] transition-colors appearance-none cursor-pointer"
              >
                {loggers.map(l => <option key={l} value={l}>{l === 'all' ? 'All loggers' : l}</option>)}
              </select>
            </div>

            {/* Add player */}
            <button
              onClick={() => setShowAddPlayer(true)}
              className="w-full bg-gradient-to-r from-[#1a3a1a] to-[#2a4a2a] hover:from-[#2a4a2a] hover:to-[#3a5a3a] border border-[#3a7a3a]/40 rounded-lg py-2.5 text-sm text-[#7ab87a] tracking-wide transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add player
            </button>
          </div>

          {/* Divider with count */}
          <div className="px-4 py-2 border-t border-b border-[#1a3a1a]/40 bg-[#0a0f0a]/50">
            <span className="text-[10px] text-[#3a5a3a] uppercase tracking-widest">
              {filtered.length} player{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </span>
          </div>

          {/* Player list */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-[#111811] border border-[#1a3a1a] flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-[#2a4a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-[#3a5a3a] text-sm">No players found</p>
                <p className="text-[#2a4a2a] text-xs mt-1">Try a different search or add a new player</p>
              </div>
            )}
            {filtered.map(player => (
              <div
                key={player.id}
                onClick={() => selectPlayer(player)}
                className={`group px-4 py-3.5 cursor-pointer transition-all relative ${
                  selected?.id === player.id
                    ? 'bg-[#0e1a0e]'
                    : 'hover:bg-[#0c120c]'
                }`}
              >
                {/* Active indicator */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r transition-all ${
                  selected?.id === player.id ? 'bg-[#7ab87a]' : 'bg-transparent group-hover:bg-[#2a4a2a]'
                }`} />

                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-xs font-medium transition-colors ${
                    selected?.id === player.id
                      ? 'bg-gradient-to-br from-[#3a7a3a] to-[#2a5a2a] text-[#c8eac8]'
                      : 'bg-[#111811] border border-[#1a3a1a] text-[#4a6a4a] group-hover:border-[#2a4a2a] group-hover:text-[#6a8a6a]'
                  }`}>
                    {(player.name?.charAt(0) ?? '?').toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-sm text-[#e8e0d0] truncate font-medium">
                        {player.name || <span className="text-[#4a6a4a] italic font-normal">Unknown</span>}
                      </span>
                      <span className="text-[10px] text-[#2a4a2a] whitespace-nowrap shrink-0">
                        {timeAgo(player.updated_at)}
                      </span>
                    </div>
                    {player.description && (
                      <div className="text-xs text-[#4a6a4a] mt-0.5 truncate">{player.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex items-center gap-1 text-[10px] text-[#3a5a3a] bg-[#0e140e] border border-[#1a3a1a]/50 rounded px-1.5 py-0.5">
                        {player.notes?.length || 0} note{(player.notes?.length || 0) !== 1 ? 's' : ''}
                      </span>
                      {player.location && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#3a5a3a] bg-[#0e140e] border border-[#1a3a1a]/50 rounded px-1.5 py-0.5 truncate max-w-[120px]">
                          {player.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="absolute bottom-0 left-14 right-4 h-px bg-[#1a3a1a]/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — player detail */}
        <div className={`flex-1 overflow-y-auto bg-[#060a06] ${showMobileDetail ? 'block' : 'hidden md:block'}`}>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-[#0e140e] border border-[#1a3a1a] flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-[#2a4a2a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-[#3a5a3a] text-sm">Select a player to view their profile</p>
              <p className="text-[#2a4a2a] text-xs mt-1">Click any player from the list on the left</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-6 md:p-10">
              {/* Back button — mobile only */}
              <button
                onClick={() => setShowMobileDetail(false)}
                className="md:hidden inline-flex items-center gap-1.5 text-xs text-[#4a6a4a] hover:text-[#7ab87a] mb-6 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to list
              </button>

              {/* Player header card */}
              <div className="bg-gradient-to-br from-[#0e140e] to-[#0a100a] border border-[#1a3a1a] rounded-xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  {/* Large avatar */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3a7a3a] to-[#1a4a1a] flex items-center justify-center shrink-0">
                    <span className="text-xl text-[#c8eac8] font-light">
                      {(selected.name?.charAt(0) ?? '?').toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-2xl md:text-3xl text-[#e8e0d0] font-light tracking-wide">
                      {selected.name || 'Unknown Player'}
                    </h2>
                    {selected.description && (
                      <p className="text-sm text-[#6a8a6a] mt-1">{selected.description}</p>
                    )}
                  </div>
                </div>

                {/* Meta tags */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {selected.location && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#6a8a6a] bg-[#0a100a] border border-[#1a3a1a] rounded-full px-3 py-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selected.location}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#4a6a4a] bg-[#0a100a] border border-[#1a3a1a] rounded-full px-3 py-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {selected.logged_by}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#4a6a4a] bg-[#0a100a] border border-[#1a3a1a] rounded-full px-3 py-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {timeAgo(selected.updated_at)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#4a6a4a] bg-[#0a100a] border border-[#1a3a1a] rounded-full px-3 py-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    {selected.notes?.length || 0} note{(selected.notes?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Notes section */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-5">
                  <h3 className="text-[11px] tracking-[2px] text-[#4a6a4a] uppercase">Notes</h3>
                  <div className="flex-1 h-px bg-[#1a3a1a]/40" />
                </div>

                {(!selected.notes || selected.notes.length === 0) ? (
                  <div className="border border-dashed border-[#1a3a1a] rounded-xl p-8 text-center">
                    <p className="text-[#3a5a3a] text-sm">No notes yet</p>
                    <p className="text-[#2a4a2a] text-xs mt-1">Add your first observation below</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selected.notes.map((note, i) => (
                      <div key={i} className="group/note bg-[#0a100a] border border-[#1a3a1a]/60 rounded-xl px-5 py-4 text-sm leading-relaxed text-[#c8c0b0] hover:border-[#2a4a2a] transition-colors">
                        <div className="flex items-start gap-3">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-[#1a3a1a]/50 text-[#3a5a3a] text-[10px] font-mono shrink-0 mt-0.5">{i + 1}</span>
                          <p className="flex-1">{note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add note */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-[11px] tracking-[2px] text-[#4a6a4a] uppercase">Add note</h3>
                  <div className="flex-1 h-px bg-[#1a3a1a]/40" />
                </div>
                <div className="bg-[#0a100a] border border-[#1a3a1a]/60 rounded-xl p-4">
                  <textarea
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    placeholder="What did you observe? Betting patterns, tells, table image..."
                    rows={3}
                    className="w-full bg-transparent text-sm text-[#e8e0d0] placeholder:text-[#2a4a2a] resize-none outline-none"
                  />
                  <div className="flex justify-end mt-3 pt-3 border-t border-[#1a3a1a]/30">
                    <button
                      onClick={addNote}
                      disabled={adding || !newNote.trim()}
                      className="bg-gradient-to-r from-[#2a5a2a] to-[#2a4a2a] hover:from-[#3a6a3a] hover:to-[#3a5a3a] border border-[#3a7a3a]/50 rounded-lg px-5 py-2 text-sm text-[#7ab87a] tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:from-[#2a5a2a] disabled:hover:to-[#2a4a2a] flex items-center gap-2"
                    >
                      {adding ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Saving...
                        </>
                      ) : 'Save note'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add player modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4" onClick={() => setShowAddPlayer(false)}>
          <div className="bg-[#0a0f0a] border border-[#2a4a2a]/60 rounded-2xl w-full max-w-md p-0 shadow-2xl shadow-black/50" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3a1a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2a5a2a] to-[#1a3a1a] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#7ab87a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <h2 className="text-sm text-[#7ab87a] tracking-wider uppercase font-medium">New player</h2>
              </div>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="w-8 h-8 rounded-lg bg-[#111811] border border-[#1a3a1a] flex items-center justify-center text-[#4a6a4a] hover:text-[#7ab87a] hover:border-[#2a4a2a] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] text-[#4a6a4a] uppercase tracking-wider mb-1.5">Name</label>
                <input
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  autoFocus
                  className="w-full bg-[#0e140e] border border-[#1a3a1a] rounded-lg px-3 py-2.5 text-sm text-[#e8e0d0] placeholder:text-[#2a4a2a] focus:border-[#3a7a3a] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#4a6a4a] uppercase tracking-wider mb-1.5">Description</label>
                <input
                  value={newPlayerDesc}
                  onChange={e => setNewPlayerDesc(e.target.value)}
                  placeholder="Physical description, table image, etc."
                  className="w-full bg-[#0e140e] border border-[#1a3a1a] rounded-lg px-3 py-2.5 text-sm text-[#e8e0d0] placeholder:text-[#2a4a2a] focus:border-[#3a7a3a] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#4a6a4a] uppercase tracking-wider mb-1.5">Location</label>
                <input
                  value={newPlayerLocation}
                  onChange={e => setNewPlayerLocation(e.target.value)}
                  placeholder="Card room or casino"
                  className="w-full bg-[#0e140e] border border-[#1a3a1a] rounded-lg px-3 py-2.5 text-sm text-[#e8e0d0] placeholder:text-[#2a4a2a] focus:border-[#3a7a3a] outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11px] text-[#4a6a4a] uppercase tracking-wider mb-1.5">First note</label>
                <textarea
                  value={newPlayerNote}
                  onChange={e => setNewPlayerNote(e.target.value)}
                  placeholder="Initial observation about this player..."
                  rows={3}
                  className="w-full bg-[#0e140e] border border-[#1a3a1a] rounded-lg px-3 py-2.5 text-sm text-[#e8e0d0] placeholder:text-[#2a4a2a] resize-none outline-none focus:border-[#3a7a3a] transition-colors"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-[#1a3a1a] bg-[#080c08] rounded-b-2xl">
              <button
                onClick={() => setShowAddPlayer(false)}
                className="flex-1 bg-[#0e140e] border border-[#1a3a1a] rounded-lg py-2.5 text-sm text-[#4a6a4a] hover:text-[#6a8a6a] hover:border-[#2a4a2a] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addPlayer}
                disabled={savingPlayer || (!newPlayerName.trim() && !newPlayerNote.trim())}
                className="flex-1 bg-gradient-to-r from-[#2a5a2a] to-[#2a4a2a] hover:from-[#3a6a3a] hover:to-[#3a5a3a] border border-[#3a7a3a]/50 rounded-lg py-2.5 text-sm text-[#7ab87a] tracking-wide transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {savingPlayer ? 'Saving...' : 'Save player'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
