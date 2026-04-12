'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-browser'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8e0d0] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-[#7ab87a] text-lg tracking-[3px] uppercase font-light">
            Poker Scout
          </Link>
          <p className="text-[#4a6a4a] text-sm mt-2">Create your account</p>
        </div>

        {success ? (
          <div className="bg-[#111811] border border-[#2a4a2a] rounded p-6 text-center">
            <h2 className="text-[#7ab87a] text-base mb-2">Check your email</h2>
            <p className="text-sm text-[#6a8a6a]">
              We sent a confirmation link to <strong className="text-[#e8e0d0]">{email}</strong>. Click it to activate your account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4">
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
                minLength={6}
                className="w-full bg-[#111811] border border-[#2a4a2a] rounded px-3 py-2.5 text-sm text-[#e8e0d0] focus:border-[#3a7a3a] outline-none transition-colors"
                placeholder="Min. 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2a5a2a] border border-[#3a7a3a] text-[#7ab87a] py-2.5 rounded text-sm hover:bg-[#3a6a3a] transition-colors tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-xs text-[#3a5a3a] text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#6a8a6a] hover:underline">Terms</Link> and{' '}
              <Link href="/privacy" className="text-[#6a8a6a] hover:underline">Privacy Policy</Link>.
            </p>
          </form>
        )}

        <p className="text-center text-sm text-[#4a6a4a] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#7ab87a] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
