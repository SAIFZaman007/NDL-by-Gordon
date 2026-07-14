import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. The Short Version',
    body: `By creating an account or using Network Design Labs, you agree to these terms. We provide Cisco certification training content — video courses, practice exams, and interview prep — under the plan you choose. Be respectful, don't abuse the platform, and we'll do our best to help you get certified.`,
  },
  {
    title: '2. Accounts',
    body: `You're responsible for keeping your login credentials secure and for all activity under your account. Accounts are personal and may not be shared or resold. You must provide accurate information when registering.`,
  },
  {
    title: '3. Subscriptions & Billing',
    body: `Free accounts get limited access to course previews and practice questions. Premium subscriptions are billed monthly or yearly via Stripe and renew automatically until cancelled. You can cancel anytime from your account settings; access continues until the end of the current billing period. We don't offer prorated refunds for partial billing periods except where required by law.`,
  },
  {
    title: '4. Acceptable Use',
    body: `Course videos, practice questions, and written content are for your personal, non-commercial use. Don't redistribute, resell, scrape, or publicly republish platform content, and don't attempt to circumvent access controls on premium content.`,
  },
  {
    title: '5. Content Accuracy',
    body: `Practice exam questions and interview prep material are written to closely mirror real Cisco certification exams, but we can't guarantee 100% alignment with any specific live exam version. Use this platform as one part of a broader study plan.`,
  },
  {
    title: '6. Termination',
    body: `We may suspend or terminate accounts that violate these terms, including sharing login credentials, abusive behavior, or attempts to bypass paywalled content. You may close your account at any time by contacting support.`,
  },
  {
    title: '7. Limitation of Liability',
    body: `Network Design Labs is provided "as is." We're not liable for exam outcomes, certification results, or indirect damages arising from use of the platform, to the fullest extent permitted by law.`,
  },
  {
    title: '8. Changes to These Terms',
    body: `We may update these terms as the platform evolves. Continued use after an update means you accept the revised terms. Material changes will be reflected by updating the date below.`,
  },
];

function Terms() {
  return (
    <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <span className="badge badge-blue mx-auto">Legal</span>
        <h1 className="font-display text-4xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-slate-500 text-sm">Last updated: July 2026</p>
      </div>

      <div className="glass-card-static rounded-2xl p-6 text-sm text-slate-400 leading-relaxed">
        This is a general-purpose template, not legal advice. Review it with a lawyer before relying
        on it for a live product handling real payments.
      </div>

      <div className="space-y-8">
        {SECTIONS.map(s => (
          <div key={s.title} className="space-y-2">
            <h2 className="font-display text-lg font-bold text-white">{s.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-white/5">
        <p className="text-slate-500 text-sm">
          Questions about these terms? <Link to="/contact" className="text-blue-400 hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}

export default Terms;