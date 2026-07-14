import React from 'react';

function Contact() {
  return (
    <div className="py-20 max-w-2xl mx-auto px-4 sm:px-6 space-y-12">
      <div className="text-center space-y-4">
        <span className="badge badge-green mx-auto">Contact</span>
        <h1 className="font-display text-5xl font-extrabold text-white">Get In Touch</h1>
        <p className="text-slate-400">Have a question about a course or need support? We usually respond within 24 hours.</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-6">
        <form onSubmit={(e) => { e.preventDefault(); alert('Message sent! We\'ll respond within 24 hours.'); }} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">First Name</label>
              <input type="text" required className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm placeholder-slate-600" placeholder="Alex" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400">Last Name</label>
              <input type="text" required className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm placeholder-slate-600" placeholder="Johnson" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Email Address</label>
            <input type="email" required className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm placeholder-slate-600" placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Topic</label>
            <select className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm">
              <option>General Question</option>
              <option>Course Content Help</option>
              <option>Billing & Subscription</option>
              <option>Technical Issue</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400">Message</label>
            <textarea rows="4" required className="w-full bg-white/5 border border-white/8 focus:border-blue-500/60 rounded-xl px-4 py-3 text-slate-100 outline-none transition text-sm resize-none placeholder-slate-600" placeholder="Describe your question or issue..."></textarea>
          </div>
          <button type="submit" className="btn-primary w-full justify-center text-sm">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
