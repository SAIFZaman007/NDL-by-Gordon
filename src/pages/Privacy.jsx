import React from 'react';
import { Link } from 'react-router-dom';

const SECTIONS = [
  {
    title: '1. What We Collect',
    body: `Account details you provide (email, password — stored as a salted hash, never in plain text), your course progress and practice exam history, and payment metadata from Stripe (we never see or store your card number directly).`,
  },
  {
    title: '2. How We Use It',
    body: `To run your account, track lesson and exam progress, process subscription payments, and send occasional product updates. We don't sell your personal data to third parties.`,
  },
  {
    title: '3. Third-Party Services',
    body: `We rely on a small number of processors to run the platform: Stripe for payment processing, Cloudinary for video and image hosting, and standard email delivery infrastructure for transactional emails. Each handles data under its own privacy policy.`,
  },
  {
    title: '4. Cookies & Local Storage',
    body: `We use browser local storage to keep you signed in between visits. We don't use third-party advertising or tracking cookies.`,
  },
  {
    title: '5. Data Retention',
    body: `We keep your account and progress data for as long as your account is active. You can request full account deletion at any time by contacting support.`,
  },
  {
    title: '6. Your Rights',
    body: `You can request a copy of your data, ask us to correct inaccurate information, or request deletion of your account and associated data at any time.`,
  },
  {
    title: '7. Security',
    body: `Passwords are hashed and salted before storage. Access to premium content and admin functions is protected by authenticated, role-checked API endpoints.`,
  },
  {
    title: '8. Changes to This Policy',
    body: `We may update this policy as the platform evolves. Material changes will be reflected by updating the date below.`,
  },
];

function Privacy() {
  return (
    <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center space-y-3">
        <span className="badge badge-blue mx-auto">Legal</span>
        <h1 className="font-display text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-slate-500 text-sm">Last updated: July 2026</p>
      </div>

      <div className="glass-card-static rounded-2xl p-6 text-sm text-slate-400 leading-relaxed">
        This is a general-purpose template, not legal advice. Review it with a lawyer — and confirm it
        matches what the platform actually does — before relying on it for a live product.
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
          Questions about your data? <Link to="/contact" className="text-blue-400 hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}

export default Privacy;