'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Player = {
  id: string
  name: string | null
  description: string | null
  notes: string[]
  location: string | null
  logged_by: string
  updated_at: string
}

export default function Dashboard() {
  const [players, setPlayers] = useState<Player[]>([])
  const [search, setSearch] = useState('')
  const [filterLocation, setFilterLocation] = useState('all')
  const [filterLoggedBy, setFilterLoggedBy] = useState('all')
  const [selected, setSelected] = useState<Player | null>(null)
  const [newNote, setNewNote] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [])

  async function fetchPlayers() {
    const { data } = await supabase
      .from('poker_players')
      .select('*')
      .order('updated_at', { ascending: false })
    if (data) setPlayers(data)
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
    <div style={{
      minHeight: '100vh',
      background: '#0a0f0a',
      color: '#e8e0d0',
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0f0a; }
        ::-webkit-scrollbar-thumb { background: #2a4a2a; border-radius: 3px; }
        input, select, textarea { outline: none; }
        .player-card:hover { background: #1a2a1a !important; border-color: #3a6a3a !important; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 11px; font-family: 'Courier New', monospace; margin: 2px; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '1px solid #1a3a1a', padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 400, letterSpacing: 3, color: '#7ab87a', textTransform: 'uppercase' }}>Poker Scout</h1>
          <p style={{ fontSize: 12, color: '#4a6a4a', letterSpacing: 1, marginTop: 2 }}>villain database</p>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 400, color: '#7ab87a' }}>{players.length}</div>
            <div style={{ fontSize: 11, color: '#4a6a4a', letterSpacing: 1 }}>PLAYERS</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 400, color: '#7ab87a' }}>{players.reduce((acc, p) => acc + (p.notes?.length || 0), 0)}</div>
            <div style={{ fontSize: 11, color: '#4a6a4a', letterSpacing: 1 }}>NOTES</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 400, color: '#7ab87a' }}>{locations.length - 1}</div>
            <div style={{ fontSize: 11, color: '#4a6a4a', letterSpacing: 1 }}>LOCATIONS</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 81px)' }}>

        {/* Left panel */}
        <div style={{ width: 380, borderRight: '1px solid #1a3a1a', display: 'flex', flexDirection: 'column' }}>

          {/* Search + filters */}
          <div style={{ padding: '16px', borderBottom: '1px solid #1a3a1a' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search players, descriptions, notes..."
              style={{
                width: '100%', background: '#111811', border: '1px solid #2a4a2a',
                borderRadius: 4, padding: '8px 12px', color: '#e8e0d0',
                fontSize: 13, fontFamily: 'Georgia, serif', marginBottom: 10
              }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <select
                value={filterLocation}
                onChange={e => setFilterLocation(e.target.value)}
                style={{
                  flex: 1, background: '#111811', border: '1px solid #2a4a2a',
                  borderRadius: 4, padding: '6px 8px', color: '#e8e0d0',
                  fontSize: 12, fontFamily: 'Georgia, serif'
                }}
              >
                {locations.map(l => <option key={l} value={l}>{l === 'all' ? 'All locations' : l}</option>)}
              </select>
              <select
                value={filterLoggedBy}
                onChange={e => setFilterLoggedBy(e.target.value)}
                style={{
                  flex: 1, background: '#111811', border: '1px solid #2a4a2a',
                  borderRadius: 4, padding: '6px 8px', color: '#e8e0d0',
                  fontSize: 12, fontFamily: 'Georgia, serif'
                }}
              >
                {loggers.map(l => <option key={l} value={l}>{l === 'all' ? 'All loggers' : l}</option>)}
              </select>
            </div>
          </div>

          {/* Player list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: '#4a6a4a', fontSize: 13 }}>
                No players found
              </div>
            )}
            {filtered.map(player => (
              <div
                key={player.id}
                className="player-card"
                onClick={() => setSelected(player)}
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid #111811',
                  cursor: 'pointer',
                  background: selected?.id === player.id ? '#1a2a1a' : 'transparent',
                  border: selected?.id === player.id ? '0' : '0',
                  borderLeft: selected?.id === player.id ? '3px solid #7ab87a' : '3px solid transparent',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 14, color: '#e8e0d0', marginBottom: 3 }}>
                      {player.name || <span style={{ color: '#4a6a4a', fontStyle: 'italic' }}>Unknown</span>}
                    </div>
                    {player.description && (
                      <div style={{ fontSize: 12, color: '#6a8a6a', marginBottom: 4 }}>{player.description}</div>
                    )}
                    <div style={{ fontSize: 11, color: '#4a6a4a' }}>
                      {player.notes?.length || 0} note{(player.notes?.length || 0) !== 1 ? 's' : ''} · {player.logged_by}
                      {player.location && ` · ${player.location}`}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#3a5a3a', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {new Date(player.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {!selected ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#3a5a3a', fontSize: 14, fontStyle: 'italic' }}>
              Select a player to view their profile
            </div>
          ) : (
            <div>
              {/* Player header */}
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 400, color: '#7ab87a', letterSpacing: 1, marginBottom: 6 }}>
                  {selected.name || 'Unknown Player'}
                </h2>
                {selected.description && (
                  <p style={{ fontSize: 14, color: '#6a8a6a', marginBottom: 12 }}>{selected.description}</p>
                )}
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#4a6a4a' }}>
                  {selected.location && <span>📍 {selected.location}</span>}
                  <span>Logged by {selected.logged_by}</span>
                  <span>Last updated {new Date(selected.updated_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Notes timeline */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 12, letterSpacing: 2, color: '#4a6a4a', textTransform: 'uppercase', marginBottom: 16 }}>Notes</h3>
                {(!selected.notes || selected.notes.length === 0) ? (
                  <p style={{ color: '#3a5a3a', fontStyle: 'italic', fontSize: 13 }}>No notes yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {selected.notes.map((note, i) => (
                      <div key={i} style={{
                        background: '#111811',
                        border: '1px solid #1a3a1a',
                        borderRadius: 4,
                        padding: '12px 16px',
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: '#c8c0b0'
                      }}>
                        <span style={{ color: '#3a5a3a', fontSize: 11, fontFamily: 'Courier New', marginRight: 8 }}>#{i + 1}</span>
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add note */}
              <div>
                <h3 style={{ fontSize: 12, letterSpacing: 2, color: '#4a6a4a', textTransform: 'uppercase', marginBottom: 12 }}>Add note</h3>
                <textarea
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  placeholder="Add a new observation..."
                  rows={3}
                  style={{
                    width: '100%', background: '#111811', border: '1px solid #2a4a2a',
                    borderRadius: 4, padding: '10px 12px', color: '#e8e0d0',
                    fontSize: 13, fontFamily: 'Georgia, serif', resize: 'vertical',
                    marginBottom: 10
                  }}
                />
                <button
                  onClick={addNote}
                  disabled={adding || !newNote.trim()}
                  style={{
                    background: adding ? '#1a3a1a' : '#2a5a2a',
                    border: '1px solid #3a7a3a',
                    borderRadius: 4,
                    padding: '8px 20px',
                    color: '#7ab87a',
                    fontSize: 13,
                    fontFamily: 'Georgia, serif',
                    cursor: adding ? 'not-allowed' : 'pointer',
                    letterSpacing: 1
                  }}
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