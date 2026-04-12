import Link from 'next/link'

export const metadata = {
  title: 'Privacy Policy — Poker Scout',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <nav className="border-b border-gray-100 px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">PS</span>
          </div>
          <span className="text-gray-900 text-lg font-semibold tracking-tight">Poker Scout</span>
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 mb-10">Last updated: April 11, 2026</p>

        <div className="space-y-8 text-sm text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">1. Introduction</h2>
            <p>Poker Scout (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website at poker-scout.vercel.app and our SMS-based player notes service (collectively, &quot;the Service&quot;).</p>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">2. Information We Collect</h2>

            <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2 mt-4">Account Information</h3>
            <p className="mb-3">When you create an account, we collect your email address and a hashed password. We never store passwords in plain text.</p>

            <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">SMS Data</h3>
            <p className="mb-3">When you use our SMS service, we collect:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-500 mb-3">
              <li>Your phone number (to identify your account and respond to messages).</li>
              <li>The content of SMS messages you send to us (player notes, queries).</li>
              <li>Timestamps of messages sent and received.</li>
              <li>Carrier information provided by our SMS provider (Twilio).</li>
            </ul>

            <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Player Notes</h3>
            <p className="mb-3">We store the player observations, notes, descriptions, and locations you submit through the Service. This content is user-generated and stored in your account.</p>

            <h3 className="text-gray-700 text-xs font-semibold uppercase tracking-wider mb-2">Usage Data</h3>
            <p>We may collect standard usage data such as IP addresses, browser type, device information, and pages visited to improve the Service.</p>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-500">
              <li>To provide, operate, and maintain the Service.</li>
              <li>To process and store your player notes and observations.</li>
              <li>To respond to your SMS messages with relevant player data.</li>
              <li>To use AI processing (via Anthropic&apos;s Claude) to parse and categorize your SMS messages.</li>
              <li>To authenticate your identity and secure your account.</li>
              <li>To communicate with you about the Service, including service updates.</li>
              <li>To comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">4. SMS Data Sharing</h2>
            <p className="mb-2">We do not sell, rent, or share your phone number or SMS message content with third parties for marketing or advertising purposes. SMS data is shared only with:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-500">
              <li><strong>Twilio</strong> — our SMS delivery provider, which processes messages on our behalf.</li>
              <li><strong>Anthropic</strong> — our AI provider, which processes message content to parse player notes. Message content is sent to Anthropic&apos;s API for processing and is subject to Anthropic&apos;s data usage policies.</li>
              <li><strong>Supabase</strong> — our database provider, which stores your data securely.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">5. Data Storage and Security</h2>
            <p>Your data is stored securely using Supabase (hosted on AWS). We use encryption in transit (TLS) and at rest. Access to production databases is restricted to authorized personnel. While we implement reasonable security measures, no method of transmission or storage is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">6. Data Retention</h2>
            <p>We retain your account and player note data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where retention is required by law. SMS logs may be retained by Twilio according to their retention policies.</p>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">7. Your Rights and Choices</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-500">
              <li><strong>Opt out of SMS:</strong> Text STOP to our number at any time to stop receiving SMS messages.</li>
              <li><strong>Access your data:</strong> You can view all your stored player notes through the web dashboard.</li>
              <li><strong>Delete your data:</strong> Contact us to request deletion of your account and all associated data.</li>
              <li><strong>Correct your data:</strong> You can edit and update your player notes through the web dashboard.</li>
              <li><strong>Data portability:</strong> Contact us to request an export of your data.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">8. Children&apos;s Privacy</h2>
            <p>The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected data from a child under 18, we will promptly delete it.</p>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">9. Third-Party Services</h2>
            <p>The Service integrates with the following third-party providers. Your use of the Service is also subject to their respective privacy policies:</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-500">
              <li>Twilio (SMS delivery) — twilio.com/legal/privacy</li>
              <li>Anthropic (AI processing) — anthropic.com/privacy</li>
              <li>Supabase (data storage) — supabase.com/privacy</li>
              <li>Vercel (hosting) — vercel.com/legal/privacy-policy</li>
            </ul>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes via email or through the Service. The &quot;Last updated&quot; date at the top reflects the most recent revision.</p>
          </section>

          <section>
            <h2 className="text-gray-900 text-sm font-semibold uppercase tracking-wider mb-3">11. Contact Us</h2>
            <p>If you have questions or concerns about this Privacy Policy or your data, contact us at:</p>
            <p className="text-gray-500 mt-2">Email: support@poker-scout.com</p>
          </section>
        </div>
      </article>

      <footer className="border-t border-gray-100 px-6 py-6 text-center text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
        {' · '}
        <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
      </footer>
    </div>
  )
}
