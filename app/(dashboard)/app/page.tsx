'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
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
  photo_url: string | null
  aggression: string | null
  ethnicity: string | null
  last_hand: string | null
}

const AGGRESSION_LEVELS = ['Passive', 'Moderate', 'Aggressive', 'Maniac']
const ETHNICITY_OPTIONS = ['Asian', 'Black', 'Hispanic', 'White', 'Middle Eastern', 'Other']

const AGGRESSION_COLORS: Record<string, string> = {
  Passive: 'bg-blue-100 text-blue-700',
  Moderate: 'bg-amber-100 text-amber-700',
  Aggressive: 'bg-orange-100 text-orange-700',
  Maniac: 'bg-red-100 text-red-700',
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
  const [newPlayerAggression, setNewPlayerAggression] = useState('')
  const [newPlayerEthnicity, setNewPlayerEthnicity] = useState('')
  const [newPlayerLastHand, setNewPlayerLastHand] = useState('')
  const [newPlayerPhoto, setNewPlayerPhoto] = useState<File | null>(null)
  const [newPlayerPhotoPreview, setNewPlayerPhotoPreview] = useState('')
  const [savingPlayer, setSavingPlayer] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editAggression, setEditAggression] = useState('')
  const [editEthnicity, setEditEthnicity] = useState('')
  const [editLastHand, setEditLastHand] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)
  const editPhotoRef = useRef<HTMLInputElement>(null)
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

  async function uploadPhoto(file: File): Promise<string | null> {
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage
      .from('player-photos')
      .upload(fileName, file, { contentType: file.type })
    if (error) {
      console.error('Upload error:', error)
      return null
    }
    const { data } = supabase.storage.from('player-photos').getPublicUrl(fileName)
    return data.publicUrl
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

    let photoUrl: string | null = null
    if (newPlayerPhoto) {
      photoUrl = await uploadPhoto(newPlayerPhoto)
    }

    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('poker_players').insert({
      name: newPlayerName.trim() || null,
      description: newPlayerDesc.trim() || null,
      location: newPlayerLocation.trim() || null,
      notes: newPlayerNote.trim() ? [newPlayerNote.trim()] : [],
      logged_by: user?.email ?? 'Unknown',
      phone: '',
      photo_url: photoUrl,
      aggression: newPlayerAggression || null,
      ethnicity: newPlayerEthnicity || null,
      last_hand: newPlayerLastHand.trim() || null,
    })
    setNewPlayerName('')
    setNewPlayerDesc('')
    setNewPlayerLocation('')
    setNewPlayerNote('')
    setNewPlayerAggression('')
    setNewPlayerEthnicity('')
    setNewPlayerLastHand('')
    setNewPlayerPhoto(null)
    setNewPlayerPhotoPreview('')
    setSavingPlayer(false)
    setShowAddPlayer(false)
    await fetchPlayers()
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewPlayerPhoto(file)
    const reader = new FileReader()
    reader.onload = () => setNewPlayerPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  async function handleEditPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selected) return
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPhoto(true)
    const url = await uploadPhoto(file)
    if (url) {
      await supabase.from('poker_players').update({ photo_url: url, updated_at: new Date().toISOString() }).eq('id', selected.id)
      setSelected(prev => prev ? { ...prev, photo_url: url } : null)
      await fetchPlayers()
    }
    setUploadingPhoto(false)
  }

  async function updatePlayerField(field: string, value: string | null) {
    if (!selected) return
    await supabase.from('poker_players').update({ [field]: value, updated_at: new Date().toISOString() }).eq('id', selected.id)
    setSelected(prev => prev ? { ...prev, [field]: value } : null)
    setEditingField(null)
    await fetchPlayers()
  }

  function selectPlayer(player: Player) {
    setSelected(player)
    setEditAggression(player.aggression || '')
    setEditEthnicity(player.ethnicity || '')
    setEditLastHand(player.last_hand || '')
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
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PS</span>
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-none">Poker Scout</h1>
            <p className="text-[10px] text-gray-400 mt-0.5">villain database</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {/* Stats */}
          <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
            <span><strong className="text-gray-900 font-semibold">{players.length}</strong> players</span>
            <span className="text-gray-200">|</span>
            <span><strong className="text-gray-900 font-semibold">{totalNotes}</strong> notes</span>
            <span className="text-gray-200">|</span>
            <span><strong className="text-gray-900 font-semibold">{locations.length - 1}</strong> locations</span>
          </div>
          <div className="w-px h-5 bg-gray-200 hidden md:block" />
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-xs text-emerald-700 font-semibold">{userEmail.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-xs text-gray-500 max-w-[120px] truncate">{userEmail}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-xs text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-57px)]">
        {/* Left panel */}
        <div className={`w-full md:w-[340px] lg:w-[380px] md:border-r border-gray-200 flex flex-col bg-white ${showMobileDetail ? 'hidden md:flex' : 'flex'}`}>
          {/* Search + filters */}
          <div className="p-3 space-y-2 border-b border-gray-100">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search players, notes..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-600 outline-none focus:border-emerald-500 transition-colors"
              >
                {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'All locations' : l}</option>)}
              </select>
              <select
                value={filterLoggedBy}
                onChange={e => setFilterLoggedBy(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs text-gray-600 outline-none focus:border-emerald-500 transition-colors"
              >
                {loggers.map(l => <option key={l} value={l}>{l === 'all' ? 'All loggers' : l}</option>)}
              </select>
            </div>
            <button
              onClick={() => setShowAddPlayer(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-lg py-2.5 text-sm text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add player
            </button>
          </div>

          {/* Count */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
            <span className="text-[11px] text-gray-400 font-medium">
              {filtered.length} player{filtered.length !== 1 ? 's' : ''}
              {search && ` matching "${search}"`}
            </span>
          </div>

          {/* Player list */}
          <div className="overflow-y-auto flex-1 custom-scroll">
            {filtered.length === 0 && (
              <div className="p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No players found</p>
              </div>
            )}
            {filtered.map(player => (
              <div
                key={player.id}
                onClick={() => selectPlayer(player)}
                className={`group px-4 py-3 cursor-pointer transition-all border-b border-gray-50 ${
                  selected?.id === player.id
                    ? 'bg-emerald-50 border-l-[3px] border-l-emerald-500'
                    : 'hover:bg-gray-50 border-l-[3px] border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar / Photo */}
                  {player.photo_url ? (
                    <img src={player.photo_url} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold ${
                      selected?.id === player.id
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}>
                      {(player.name?.charAt(0) ?? '?').toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {player.name || <span className="text-gray-300 italic font-normal">Unknown</span>}
                      </span>
                      <span className="text-[10px] text-gray-300 whitespace-nowrap shrink-0">
                        {timeAgo(player.updated_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {player.aggression && (
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${AGGRESSION_COLORS[player.aggression] || 'bg-gray-100 text-gray-500'}`}>
                          {player.aggression}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {player.notes?.length || 0} notes
                      </span>
                      {player.location && (
                        <span className="text-[10px] text-gray-300 truncate max-w-[100px]">
                          {player.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — player detail */}
        <div className={`flex-1 overflow-y-auto custom-scroll ${showMobileDetail ? 'block' : 'hidden md:block'}`}>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Select a player to view their profile</p>
              <p className="text-gray-300 text-xs mt-1">Click any player from the list</p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto p-5 md:p-8">
              {/* Back — mobile */}
              <button
                onClick={() => setShowMobileDetail(false)}
                className="md:hidden inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mb-5 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to list
              </button>

              {/* Player header */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  <div className="relative group/photo">
                    {selected.photo_url ? (
                      <img src={selected.photo_url} alt="" className="w-20 h-20 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center">
                        <span className="text-2xl text-gray-300 font-semibold">
                          {(selected.name?.charAt(0) ?? '?').toUpperCase()}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => editPhotoRef.current?.click()}
                      disabled={uploadingPhoto}
                      className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <input ref={editPhotoRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleEditPhoto} />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 rounded-2xl bg-white/80 flex items-center justify-center">
                        <svg className="w-5 h-5 animate-spin text-emerald-600" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                      {selected.name || 'Unknown Player'}
                    </h2>
                    {selected.description && (
                      <p className="text-sm text-gray-500 mt-0.5">{selected.description}</p>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {selected.aggression && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${AGGRESSION_COLORS[selected.aggression] || 'bg-gray-100 text-gray-500'}`}>
                          {selected.aggression}
                        </span>
                      )}
                      {selected.location && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{selected.location}</span>
                      )}
                      {selected.ethnicity && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">{selected.ethnicity}</span>
                      )}
                      <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{timeAgo(selected.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile fields */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6 divide-y divide-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-6 pt-5 pb-3">Profile</h3>

                {/* Aggression */}
                <div className="px-6 py-3.5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Aggression</span>
                  {editingField === 'aggression' ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editAggression}
                        onChange={e => setEditAggression(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-900 outline-none focus:border-emerald-500"
                      >
                        <option value="">None</option>
                        {AGGRESSION_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <button onClick={() => updatePlayerField('aggression', editAggression || null)} className="text-xs text-emerald-600 font-medium hover:underline">Save</button>
                      <button onClick={() => setEditingField(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditAggression(selected.aggression || ''); setEditingField('aggression') }} className="text-sm text-gray-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                      {selected.aggression ? (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${AGGRESSION_COLORS[selected.aggression]}`}>{selected.aggression}</span>
                      ) : (
                        <span className="text-gray-300">Set</span>
                      )}
                      <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  )}
                </div>

                {/* Ethnicity */}
                <div className="px-6 py-3.5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Ethnicity</span>
                  {editingField === 'ethnicity' ? (
                    <div className="flex items-center gap-2">
                      <select
                        value={editEthnicity}
                        onChange={e => setEditEthnicity(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-900 outline-none focus:border-emerald-500"
                      >
                        <option value="">None</option>
                        {ETHNICITY_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                      </select>
                      <button onClick={() => updatePlayerField('ethnicity', editEthnicity || null)} className="text-xs text-emerald-600 font-medium hover:underline">Save</button>
                      <button onClick={() => setEditingField(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditEthnicity(selected.ethnicity || ''); setEditingField('ethnicity') }} className="text-sm text-gray-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                      {selected.ethnicity || <span className="text-gray-300">Set</span>}
                      <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  )}
                </div>

                {/* Last hand */}
                <div className="px-6 py-3.5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last hand</span>
                  {editingField === 'last_hand' ? (
                    <div className="flex items-center gap-2">
                      <input
                        value={editLastHand}
                        onChange={e => setEditLastHand(e.target.value)}
                        placeholder="e.g. Lost with AA vs KK"
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-sm text-gray-900 outline-none focus:border-emerald-500 w-48"
                      />
                      <button onClick={() => updatePlayerField('last_hand', editLastHand.trim() || null)} className="text-xs text-emerald-600 font-medium hover:underline">Save</button>
                      <button onClick={() => setEditingField(null)} className="text-xs text-gray-400 hover:underline">Cancel</button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditLastHand(selected.last_hand || ''); setEditingField('last_hand') }} className="text-sm text-gray-900 hover:text-emerald-600 transition-colors flex items-center gap-1.5 text-right max-w-[60%]">
                      <span className="truncate">{selected.last_hand || <span className="text-gray-300">Set</span>}</span>
                      <svg className="w-3 h-3 text-gray-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  )}
                </div>

                {/* Logged by */}
                <div className="px-6 py-3.5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Logged by</span>
                  <span className="text-sm text-gray-900">{selected.logged_by}</span>
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
                <div className="px-6 pt-5 pb-3 flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes</h3>
                  <span className="text-xs text-gray-300">{selected.notes?.length || 0} total</span>
                </div>

                {(!selected.notes || selected.notes.length === 0) ? (
                  <div className="px-6 pb-6">
                    <div className="border-2 border-dashed border-gray-100 rounded-xl p-8 text-center">
                      <p className="text-gray-300 text-sm">No notes yet</p>
                    </div>
                  </div>
                ) : (
                  <div className="px-6 pb-4 space-y-2">
                    {selected.notes.map((note, i) => (
                      <div key={i} className="bg-gray-50 rounded-xl px-4 py-3 text-sm leading-relaxed text-gray-700">
                        <div className="flex items-start gap-2.5">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-gray-200 text-gray-500 text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                          <p className="flex-1">{note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add note inline */}
                <div className="px-6 pb-5">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <textarea
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      placeholder="Add a note — betting patterns, tells, reads..."
                      rows={2}
                      className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-300 resize-none outline-none"
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={addNote}
                        disabled={adding || !newNote.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-1.5 text-xs text-white font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                      >
                        {adding ? (
                          <>
                            <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving
                          </>
                        ) : 'Add note'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add player modal */}
      {showAddPlayer && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-start md:items-center justify-center z-50 px-4 pt-16 md:pt-0" onClick={() => setShowAddPlayer(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <h2 className="text-base font-semibold text-gray-900">Add new player</h2>
              <button
                onClick={() => setShowAddPlayer(false)}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="p-6 space-y-4">
              {/* Photo upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="flex items-center gap-4">
                  {newPlayerPhotoPreview ? (
                    <img src={newPlayerPhotoPreview} alt="" className="w-16 h-16 rounded-xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="text-xs font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors"
                    >
                      Upload photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (photoInputRef.current) {
                          photoInputRef.current.setAttribute('capture', 'environment')
                          photoInputRef.current.click()
                          photoInputRef.current.removeAttribute('capture')
                        }
                      }}
                      className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                    >
                      Take photo
                    </button>
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  value={newPlayerName}
                  onChange={e => setNewPlayerName(e.target.value)}
                  placeholder="Player name"
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <input
                  value={newPlayerDesc}
                  onChange={e => setNewPlayerDesc(e.target.value)}
                  placeholder="Physical description, table image, etc."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Aggression</label>
                  <select
                    value={newPlayerAggression}
                    onChange={e => setNewPlayerAggression(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500"
                  >
                    <option value="">Select...</option>
                    {AGGRESSION_LEVELS.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ethnicity</label>
                  <select
                    value={newPlayerEthnicity}
                    onChange={e => setNewPlayerEthnicity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-emerald-500"
                  >
                    <option value="">Select...</option>
                    {ETHNICITY_OPTIONS.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input
                  value={newPlayerLocation}
                  onChange={e => setNewPlayerLocation(e.target.value)}
                  placeholder="Card room or casino"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last hand played</label>
                <input
                  value={newPlayerLastHand}
                  onChange={e => setNewPlayerLastHand(e.target.value)}
                  placeholder="e.g. Bluffed river with 7-2o for $200"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First note</label>
                <textarea
                  value={newPlayerNote}
                  onChange={e => setNewPlayerNote(e.target.value)}
                  placeholder="Initial observation about this player..."
                  rows={3}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 resize-none outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 sticky bottom-0 bg-white rounded-b-2xl">
              <button
                onClick={() => setShowAddPlayer(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-lg py-2.5 text-sm text-gray-600 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addPlayer}
                disabled={savingPlayer || (!newPlayerName.trim() && !newPlayerNote.trim())}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-lg py-2.5 text-sm text-white font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
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
