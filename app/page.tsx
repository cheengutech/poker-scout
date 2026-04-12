import Link from 'next/link'
import Image from 'next/image'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto w-full">
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
      <section className="px-6 pt-16 pb-24 md:pt-24 md:pb-32 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          {/* Mascot */}
          <div className="relative shrink-0 order-1 md:order-2">
            <div className="w-56 h-56 md:w-72 md:h-72">
              <Image
                src="/mascot.png"
                alt="Poker Scout mascot — a scout kitten with poker cards"
                width={288}
                height={288}
                className="w-full h-full object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

          {/* Copy */}
          <div className="text-center md:text-left order-2 md:order-1 flex-1">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-5 border border-emerald-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              SMS-powered player intelligence
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-5 leading-[1.15]">
              Scout your villains.<br />Text your reads.
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-md mb-8 leading-relaxed">
              Log player notes by SMS from the table. AI parses your reads into a searchable villain database. Look up any player with a text.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-3 md:justify-start justify-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-base font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
              >
                Start scouting free
              </Link>
              <a
                href="sms:+18442730024"
                className="w-full sm:w-auto border border-gray-200 text-gray-600 px-8 py-3.5 rounded-xl text-base font-medium hover:border-emerald-200 hover:text-emerald-700 transition-colors"
              >
                Text the number
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* How it works */}
      <section className="px-6 py-20 bg-gray-50/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold tracking-widest text-emerald-600/60 uppercase text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Text a note', desc: 'Send an SMS with a player name, description, or table read. Natural language — text like you talk.' },
              { step: '2', title: 'AI scouts it', desc: 'Our AI parses your note — tags play style, extracts tendencies, rates threat level, logs everything.' },
              { step: '3', title: 'Look up anytime', desc: 'Text LOOKUP + a name to get an instant summary. Or browse your full database on the web.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-lg font-bold border border-emerald-100">
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SMS Demo */}
      <section className="px-6 py-20">
        <div className="max-w-md mx-auto">
          <h2 className="text-xs font-semibold tracking-widest text-emerald-600/60 uppercase text-center mb-10">From the table</h2>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
            {/* Outgoing */}
            <div className="flex justify-end">
              <div className="bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[85%] leading-relaxed">
                Mike seat 3 at Bellagio, total fish, calls everything pre and post flop. Overvalues top pair.
              </div>
            </div>
            {/* Incoming */}
            <div className="flex justify-start">
              <div className="bg-white text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[85%] leading-relaxed border border-gray-100 shadow-sm">
                Got it. Mike tagged as fish, calling-station. Reply LOOKUP Mike to retrieve.
              </div>
            </div>
            {/* Outgoing */}
            <div className="flex justify-end">
              <div className="bg-emerald-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[85%]">
                LOOKUP Mike
              </div>
            </div>
            {/* Incoming */}
            <div className="flex justify-start">
              <div className="bg-white text-gray-700 text-sm px-4 py-2.5 rounded-2xl rounded-bl-md max-w-[85%] leading-relaxed border border-gray-100 shadow-sm">
                Mike (Bellagio, seat 3): Loose-passive fish. Calls too wide pre and post, overvalues top pair. Low threat — value bet relentlessly.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
      </div>

      {/* Features */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-4">
          {[
            { title: 'SMS-first', desc: 'No app to open at the table. Just text. Works on any phone, any carrier.' },
            { title: 'Web dashboard', desc: 'Search, filter, and browse your full villain database from any device.' },
            { title: 'AI-powered reads', desc: 'Natural language parsing tags play style, tendencies, and threat level automatically.' },
            { title: 'Share intel', desc: 'Share player profiles with your crew. Build a collective read on the regulars.' },
          ].map(f => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6 border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/30 transition-colors">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-emerald-600 text-center">
        <div className="max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-6">
            <Image
              src="/mascot.png"
              alt="Poker Scout mascot"
              width={80}
              height={80}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
          <h2 className="text-2xl md:text-3xl text-white font-bold mb-3">Ready to scout?</h2>
          <p className="text-emerald-100 mb-8">Build your villain database from the table. Free to use, always.</p>
          <Link
            href="/signup"
            className="inline-block bg-white text-emerald-700 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-emerald-50 transition-colors shadow-lg shadow-black/10"
          >
            Create your account
          </Link>
        </div>
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
