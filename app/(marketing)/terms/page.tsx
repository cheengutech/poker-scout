import Link from 'next/link'

export const metadata = {
  title: 'Terms of Service — Poker Scout',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0f0a] text-[#e8e0d0]">
      <nav className="border-b border-[#1a3a1a] px-6 py-4 max-w-3xl mx-auto">
        <Link href="/" className="text-[#7ab87a] text-lg tracking-[3px] uppercase font-light">
          Poker Scout
        </Link>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl text-[#7ab87a] font-light tracking-wide mb-2">Terms of Service</h1>
        <p className="text-xs text-[#4a6a4a] mb-10">Last updated: April 11, 2026</p>

        <div className="space-y-8 text-sm text-[#8a9a8a] leading-relaxed">
          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using Poker Scout (&quot;the Service&quot;), including our website at poker-scout.vercel.app and our SMS-based player notes service, you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">2. Description of Service</h2>
            <p>Poker Scout provides an SMS-based and web-based platform for poker players to log, store, and retrieve notes about other players encountered at poker tables. The Service uses AI to process natural-language SMS messages and maintain a structured database of player observations.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">3. SMS Service Terms</h2>
            <p className="mb-2">By opting into our SMS service, you agree to the following:</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#6a8a6a]">
              <li>You consent to receive SMS messages from Poker Scout in response to your messages.</li>
              <li>Message and data rates may apply depending on your carrier and plan.</li>
              <li>Message frequency varies based on your usage.</li>
              <li>You can opt out at any time by texting STOP to our number.</li>
              <li>You can request help by texting HELP to our number.</li>
              <li>We will not share your phone number or SMS data with third parties for marketing purposes.</li>
              <li>SMS data, including message content, is collected and stored to provide the Service.</li>
              <li>Carriers are not liable for delayed or undelivered messages.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">4. Account Registration</h2>
            <p>To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your credentials and for all activities under your account. You must provide accurate and complete information when creating your account.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">5. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-1.5 text-[#6a8a6a]">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws.</li>
              <li>Store content that is defamatory, threatening, or harassing.</li>
              <li>Attempt to gain unauthorized access to the Service or its systems.</li>
              <li>Use the Service to send spam or unsolicited messages.</li>
              <li>Interfere with or disrupt the Service or servers.</li>
              <li>Reverse-engineer, decompile, or disassemble any part of the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">6. User Content</h2>
            <p>You retain ownership of the player notes and observations you submit. By using the Service, you grant Poker Scout a limited license to store, process, and display your content solely to provide and improve the Service. We do not claim ownership of your content.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">7. AI Processing</h2>
            <p>The Service uses artificial intelligence to parse and categorize your SMS messages. While we strive for accuracy, AI processing may occasionally misinterpret messages. You are responsible for reviewing and correcting any errors in your stored data.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">8. Disclaimer of Warranties</h2>
            <p>The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not guarantee uninterrupted or error-free operation. We do not warrant that AI processing will be accurate in all cases.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">9. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, Poker Scout shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including loss of data, profits, or goodwill.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">10. Termination</h2>
            <p>We reserve the right to suspend or terminate your access to the Service at our discretion, with or without cause. You may terminate your account at any time by contacting us. Upon termination, your data will be deleted within 30 days unless retention is required by law.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">11. Changes to Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes via email or through the Service. Continued use of the Service after changes constitutes acceptance of the revised Terms.</p>
          </section>

          <section>
            <h2 className="text-[#7ab87a] text-sm uppercase tracking-wider mb-3">12. Contact</h2>
            <p>For questions about these Terms, contact us at support@poker-scout.com.</p>
          </section>
        </div>
      </article>

      <footer className="border-t border-[#1a3a1a] px-6 py-6 text-center text-xs text-[#3a5a3a]">
        <Link href="/" className="hover:text-[#6a8a6a] transition-colors">Home</Link>
        {' · '}
        <Link href="/privacy" className="hover:text-[#6a8a6a] transition-colors">Privacy Policy</Link>
      </footer>
    </div>
  )
}
