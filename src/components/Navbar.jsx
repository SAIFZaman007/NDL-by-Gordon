import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, User, LogOut, MessageCircleQuestion } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Navbar({ openLoginModal }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, email, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/learning-paths', label: 'Learning Paths' },
    { to: '/practice-exam', label: 'Practice Exam' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
  ];

  const handleSignOut = () => {
    logout();
    setAccountMenuOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/40' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2.5 group">
  <img
    src="/logo-mark.png"
    alt="Network Design Labs"
    className="w-20 h-9 rounded-xl shadow-lg group-hover:shadow-blue-500/40 transition shrink-0"
  />
  <span className="font-display font-800 text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
    Network Design <span className="text-blue-400">Labs</span>
  </span>
</Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'text-white bg-white/5'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(v => !v)}
                className="flex items-center space-x-2 text-slate-300 hover:text-white text-sm font-semibold transition px-3 py-2 rounded-lg hover:bg-white/5"
              >
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                  {email?.[0]?.toUpperCase()}
                </div>
                <span className="max-w-35 truncate">{email}</span>
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-xl p-1.5 border border-white/10 shadow-2xl" onMouseLeave={() => setAccountMenuOpen(false)}>
                  <Link
                    to="/portal"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>My Portal</span>
                  </Link>

<Link
  to="/interview-prep"
  onClick={() => setAccountMenuOpen(false)}
  className="flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
>
  <MessageCircleQuestion className="h-3.5 w-3.5" />
  <span>Interview Prep</span>
</Link>

                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={openLoginModal} className="text-slate-300 hover:text-white text-sm font-semibold transition px-3 py-2">
                Sign In
              </button>
              <button
                onClick={openLoginModal}
                className="btn-primary text-sm px-5 py-2.5"
              >
                Start Free →
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-slate-400 hover:text-white">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0E16] border-t border-white/5 px-4 pb-4 pt-2 space-y-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="block py-2.5 px-3 text-slate-300 hover:text-white text-sm font-medium rounded-lg hover:bg-white/5 transition" onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-3 space-y-2">
            {isAuthenticated ? (
              <>
                <Link to="/portal" onClick={() => setMenuOpen(false)} className="w-full btn-secondary text-sm py-2.5 flex items-center justify-center">My Portal</Link>
                <Link to="/interview-prep" onClick={() => setMenuOpen(false)} className="w-full btn-secondary text-sm py-2.5 flex items-center justify-center">Interview Prep</Link>
                <button onClick={handleSignOut} className="w-full py-2.5 text-red-400 text-sm font-semibold border border-red-500/20 rounded-full hover:bg-red-500/10 transition">Sign Out</button>
              </>
            ) : (
              <>
                <button onClick={() => { openLoginModal(); setMenuOpen(false); }} className="w-full btn-secondary text-sm py-2.5">Sign In</button>
                <button onClick={() => { openLoginModal(); setMenuOpen(false); }} className="w-full btn-primary text-sm py-2.5">Start Free</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;