import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PS</span>
          </div>
          <span className="text-gray-900 text-lg font-semibold tracking-tight">Poker Scout</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-3 py-2">
            Log in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 md:py-32 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          SMS-powered player intelligence
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
          Your villain database,<br />one text away.
        </h1>
        <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Log and look up player notes by SMS. Text your observations from the table, query your database anytime. Never forget a read.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/signup"
            className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
          >
            Get started free
          </Link>
          <a
            href="sms:+18442730024"
            className="w-full sm:w-auto border border-gray-200 text-gray-600 px-8 py-3.5 rounded-xl text-base font-medium hover:border-gray-300 hover:text-gray-900 transition-colors"
          >
            Text the number
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold tracking-widest text-gray-400 uppercase text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Text a note', desc: 'Send an SMS with a player description, table read, or betting pattern.' },
              { step: '2', title: 'AI parses it', desc: 'Our AI logs new players, adds notes to existing ones, or looks up your history.' },
              { step: '3', title: 'Query anytime', desc: 'Text back to look up a player, or browse your full database on the web.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 text-sm font-bold">{item.step}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
          {[
            { title: 'SMS-first', desc: 'No app to open at the table. Just text. Works on any phone, any carrier.' },
            { title: 'Web dashboard', desc: 'Search, filter, and review all your notes from a clean mobile-friendly interface.' },
            { title: 'AI-powered', desc: 'Natural language processing means you text like you talk. No rigid formats.' },
            { title: 'Private & secure', desc: 'Your notes are encrypted and only visible to you. We never share your data.' },
          ].map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-emerald-600 text-center">
        <h2 className="text-2xl md:text-3xl text-white font-bold mb-3">Ready to build your edge?</h2>
        <p className="text-emerald-100 mb-8">Start logging player notes today. Free to use.</p>
        <Link
          href="/signup"
          className="bg-white text-emerald-700 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10"
        >
          Create your account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} Poker Scout. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
