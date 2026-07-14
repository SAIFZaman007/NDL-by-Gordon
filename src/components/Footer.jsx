import React from 'react';
import { Link } from 'react-router-dom';

const SOCIAL_LINKS = [
  { icon: 'github-icon', label: 'GitHub', href: 'https://github.com' },
  { icon: 'discord-icon', label: 'Discord', href: 'https://discord.com' },
  { icon: 'x-icon', label: 'X', href: 'https://x.com' },
  { icon: 'bluesky-icon', label: 'Bluesky', href: 'https://bsky.app' },
  { icon: 'documentation-icon', label: 'Docs', href: '/about' },
];

function Footer() {
  const links = {
    Courses: [
      { label: 'CCNA 200-301', to: '/learning-paths?topic=CCNA' },
      { label: 'CCNP ENCOR', to: '/learning-paths?topic=CCNP' },
      { label: 'Cybersecurity', to: '/learning-paths?topic=Cybersecurity' },
      { label: 'Practice Exams', to: '/practice-exam' },
      { label: 'Interview Prep', to: '/interview-prep' },
    ],
    Company: [
      { label: 'About', to: '/about' },
      { label: 'Blog', to: '/blog' },
      { label: 'Pricing', to: '/pricing' },
      // No dedicated careers page yet — routes to Contact so it isn't a dead link.
      { label: 'Careers', to: '/contact' },
    ],
    Support: [
      { label: 'Contact Us', to: '/contact' },
      // No dedicated FAQ page yet — routes to Contact so it isn't a dead link.
      { label: 'Help & FAQ', to: '/contact' },
      { label: 'Student Portal', to: '/portal' },
      { label: 'All Courses', to: '/learning-paths' },
    ],
  };

  return (
    <footer className="bg-[#07080D] border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-5 gap-12 pb-12 border-b border-white/5">
          {/* Brand */}
<div className="md:col-span-2 space-y-4">
<div className="flex items-center space-x-2.5">
  <img src="/logo-mark.png" alt="Network Design Labs" className="w-20 h-8 rounded-lg shrink-0" />
  <span className="font-display font-bold text-lg text-white whitespace-nowrap">
    Network Design <span className="text-blue-400">Labs</span>
  </span>
</div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Expert-led Cisco certification training. Pass your CCNA & CCNP exams with structured video courses and hands-on labs.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              {['CCNA', 'CCNP', 'CyberSec'].map(cert => (
                <span key={cert} className="badge badge-blue">{cert}</span>
              ))}
            </div>
            <div className="flex items-center space-x-3 pt-2">
              {SOCIAL_LINKS.map(social => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/8 hover:border-blue-500/30 flex items-center justify-center transition"
                >
                  <svg className="h-3.5 w-3.5 opacity-60 hover:opacity-100 transition" style={{ filter: 'invert(1)' }}>
                    <use href={`/icons.svg#${social.icon}`} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group} className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">{group}</h4>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-slate-500 hover:text-slate-200 text-sm transition">{item.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
          <p>© 2026 Network Design Labs. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link to="/privacy" className="hover:text-slate-400 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;