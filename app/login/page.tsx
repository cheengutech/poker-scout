'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/app')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8e0d0] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-[#7ab87a] text-lg tracking-[3px] uppercase font-light">
            Poker Scout
          </Link>
          <p className="text-[#4a6a4a] text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-800/50 text-red-400 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs text-[#4a6a4a] uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full bg-[#111811] border border-[#2a4a2a] rounded px-3 py-2.5 text-sm text-[#e8e0d0] focus:border-[#3a7a3a] outline-none transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs text-[#4a6a4a] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-[#111811] border border-[#2a4a2a] rounded px-3 py-2.5 text-sm text-[#e8e0d0] focus:border-[#3a7a3a] outline-none transition-colors"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2a5a2a] border border-[#3a7a3a] text-[#7ab87a] py-2.5 rounded text-sm hover:bg-[#3a6a3a] transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-[#4a6a4a] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#7ab87a] hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
