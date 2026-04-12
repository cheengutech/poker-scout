import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8e0d0]">
      {/* Nav */}
      <nav className="border-b border-[#1a3a1a] px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div>
          <span className="text-[#7ab87a] text-lg tracking-[3px] uppercase font-light">Poker Scout</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[#6a8a6a] hover:text-[#7ab87a] transition-colors">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-[#2a5a2a] border border-[#3a7a3a] text-[#7ab87a] px-4 py-2 rounded hover:bg-[#3a6a3a] transition-colors"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-light text-[#7ab87a] tracking-wide mb-6 leading-tight">
          Your villain database,<br />one text away.
        </h1>
        <p className="text-base md:text-lg text-[#8a9a8a] max-w-xl mx-auto mb-10 leading-relaxed">
          Poker Scout lets you log and look up player notes by SMS. Text your observations from the table, query your database anytime. Never forget a read again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-[#2a5a2a] border border-[#3a7a3a] text-[#7ab87a] px-8 py-3 rounded text-base hover:bg-[#3a6a3a] transition-colors tracking-wide"
          >
            Get started free
          </Link>
          <a
            href="sms:+18442730024"
            className="w-full sm:w-auto border border-[#2a4a2a] text-[#6a8a6a] px-8 py-3 rounded text-base hover:border-[#3a6a3a] hover:text-[#7ab87a] transition-colors tracking-wide"
          >
            Text the number
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 border-t border-[#1a3a1a]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs tracking-[3px] text-[#4a6a4a] uppercase text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-2xl text-[#7ab87a] mb-3 font-light">1</div>
              <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">Text a note</h3>
              <p className="text-sm text-[#6a8a6a] leading-relaxed">
                Send an SMS to our number with a player description, table read, or betting pattern.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#7ab87a] mb-3 font-light">2</div>
              <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">AI parses it</h3>
              <p className="text-sm text-[#6a8a6a] leading-relaxed">
                Our AI understands your message — logs new players, adds notes to existing ones, or looks up your history.
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl text-[#7ab87a] mb-3 font-light">3</div>
              <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">Query anytime</h3>
              <p className="text-sm text-[#6a8a6a] leading-relaxed">
                Text back to look up a player, or browse your full database from the web dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 border-t border-[#1a3a1a]">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="border border-[#1a3a1a] rounded p-6">
            <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">SMS-first</h3>
            <p className="text-sm text-[#6a8a6a] leading-relaxed">
              No app to open at the table. Just text. Works on any phone, any carrier.
            </p>
          </div>
          <div className="border border-[#1a3a1a] rounded p-6">
            <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">Web dashboard</h3>
            <p className="text-sm text-[#6a8a6a] leading-relaxed">
              Search, filter, and review all your notes from a clean mobile-friendly interface.
            </p>
          </div>
          <div className="border border-[#1a3a1a] rounded p-6">
            <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">AI-powered</h3>
            <p className="text-sm text-[#6a8a6a] leading-relaxed">
              Natural language processing means you text like you talk. No rigid formats or commands.
            </p>
          </div>
          <div className="border border-[#1a3a1a] rounded p-6">
            <h3 className="text-sm text-[#7ab87a] uppercase tracking-wider mb-2">Private & secure</h3>
            <p className="text-sm text-[#6a8a6a] leading-relaxed">
              Your notes are encrypted and only visible to you. We never share or sell your data.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 border-t border-[#1a3a1a] text-center">
        <h2 className="text-xl md:text-2xl text-[#7ab87a] font-light mb-4">Ready to build your edge?</h2>
        <p className="text-sm text-[#6a8a6a] mb-8">Start logging player notes today. Free to use.</p>
        <Link
          href="/signup"
          className="bg-[#2a5a2a] border border-[#3a7a3a] text-[#7ab87a] px-8 py-3 rounded text-base hover:bg-[#3a6a3a] transition-colors tracking-wide"
        >
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a3a1a] px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#3a5a3a]">
          <span>&copy; {new Date().getFullYear()} Poker Scout. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-[#6a8a6a] transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-[#6a8a6a] transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
