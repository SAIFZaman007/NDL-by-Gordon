import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Network, BookOpen, Users, Award, ChevronRight,
  Star, Check, Play, Clock, BarChart2,
  ArrowUpRight, Zap, Target, Router as RouterIcon,
  Shield, Wifi, ServerCog, ScanLine,
} from 'lucide-react';
import apiClient from '../api/client';
import CourseCard from '../components/ui/CourseCard';

const stats = [
  { number: '5,000+', label: 'Students Trained', icon: Users },
  { number: '95%', label: 'Exam Pass Rate', icon: Award },
  { number: '40+', label: 'Video Courses', icon: Play },
  { number: '500+', label: 'Practice Questions', icon: Target },
];

const features = [
  {
    icon: Network,
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
    borderColor: 'border-blue-500/20',
    title: 'Cisco-Focused Curriculum',
    desc: 'Every course built specifically for Cisco certifications — CCNA, CCNP, and beyond. No generic content, only exam-relevant material.'
  },
  {
    icon: Target,
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
    borderColor: 'border-purple-500/20',
    title: 'Practice Exam Engine',
    desc: 'Simulate the real CCNA/CCNP exam environment with 500+ questions, timed sessions, and instant answer explanations.'
  },
  {
    icon: Zap,
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/20',
    title: 'Expert Cisco Instructor',
    desc: 'Learn directly from CCIE-certified Cisco instructors with 10+ years of enterprise networking experience.'
  },
  {
    icon: BarChart2,
    color: 'from-orange-500/20 to-orange-600/10',
    iconColor: 'text-orange-400',
    borderColor: 'border-orange-500/20',
    title: 'Progress Tracking',
    desc: 'Track lesson completion, exam scores, and certification readiness — all in your personal learning dashboard.'
  },
];

const certPaths = [
  {
    cert: 'CCNA 200-301',
    topicQuery: 'CCNA',
    badge: 'Associate',
    badgeClass: 'badge-green',
    level: 'Beginner',
    color: 'from-blue-600/20 to-indigo-600/10',
    accent: '#3B82F6',
    desc: 'The #1 entry-level networking certification. Master IP addressing, routing, switching, and basic security.',
    modules: ['Network Fundamentals', 'IP Connectivity', 'Security Fundamentals', 'Automation'],
    duration: '60+ hours',
    questions: '200+',
  },
  {
    cert: 'CCNP ENCOR 350-401',
    topicQuery: 'CCNP',
    badge: 'Professional',
    badgeClass: 'badge-blue',
    level: 'Intermediate',
    color: 'from-purple-600/20 to-blue-600/10',
    accent: '#8B5CF6',
    desc: 'Deep-dive into enterprise network architecture, advanced routing protocols, and network programmability.',
    modules: ['Advanced Routing', 'SD-Access', 'Network Assurance', 'Infrastructure Security'],
    duration: '80+ hours',
    questions: '300+',
  },
  {
    cert: 'Cybersecurity Basics',
    topicQuery: 'Cybersecurity',
    badge: 'Security',
    badgeClass: 'badge-orange',
    level: 'Intermediate',
    color: 'from-orange-600/20 to-red-600/10',
    accent: '#F97316',
    desc: 'Understand network threats, configure firewalls, VPNs, AAA security, and implement Cisco security features.',
    modules: ['Threat Landscape', 'Cisco Firepower', 'VPN Technologies', 'AAA & NAC'],
    duration: '40+ hours',
    questions: '150+',
  },
];

const labEnvironments = [
  { icon: RouterIcon, label: 'Packet Tracer' },
  { icon: ServerCog, label: 'GNS3' },
  { icon: Network, label: 'Cisco IOS-XE' },
  { icon: Shield, label: 'ASA Firewall' },
  { icon: ScanLine, label: 'Wireshark' },
  { icon: Wifi, label: 'Catalyst Switches' },
];

const TERMINAL_LINES = [
  { prompt: 'Router>', cmd: 'enable' },
  { prompt: 'Router#', cmd: 'configure terminal' },
  { prompt: 'Router(config)#', cmd: 'interface GigabitEthernet0/1' },
  { prompt: 'Router(config-if)#', cmd: 'ip address 192.168.1.1 255.255.255.0' },
  { prompt: 'Router(config-if)#', cmd: 'no shutdown' },
  { prompt: 'Router(config-if)#', cmd: 'exit' },
  { prompt: 'Router(config)#', cmd: 'router ospf 1' },
  { prompt: 'Router(config-router)#', cmd: 'network 192.168.1.0 0.0.0.255 area 0' },
];

function HeroVisual() {
  // A gently looping countdown — purely decorative, not tied to a real
  // session — so the hero mockup reads as a live product rather than a
  // static screenshot. Resets to 8:00 whenever it reaches zero.
  const [demoSeconds, setDemoSeconds] = useState(8 * 60);
  useEffect(() => {
    const id = setInterval(() => {
      setDemoSeconds(s => (s <= 1 ? 8 * 60 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const demoMinutes = Math.floor(demoSeconds / 60);
  const demoSecondsPart = (demoSeconds % 60).toString().padStart(2, '0');

  return (
    <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mt-14 text-left">
      {/* Practice question preview card */}
      <div className="glass-card rounded-2xl p-5 space-y-4 animate-fade-up">
        <div className="flex items-center justify-between">
          <span className="badge badge-purple">Practice Question</span>
          <span className="flex items-center space-x-1 text-xs text-slate-500 font-mono">
            <Clock className="h-3 w-3" />
            <span>{demoMinutes}:{demoSecondsPart}</span>
          </span>
        </div>
        <p className="text-sm text-slate-200 font-medium leading-relaxed">
          Which command enables OSPF routing process 1 on a Cisco router?
        </p>
        <div className="space-y-2">
          {[
            { label: 'A', text: 'router ospf 1', correct: true },
            { label: 'B', text: 'ospf enable 1' },
            { label: 'C', text: 'ip ospf process 1' },
          ].map(opt => (
            <div
              key={opt.label}
              className={`flex items-center space-x-2.5 text-xs rounded-lg px-3 py-2 border ${
                opt.correct
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-white/8 bg-white/3 text-slate-400'
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${opt.correct ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                {opt.correct ? <Check className="h-2.5 w-2.5" /> : opt.label}
              </span>
              <span className="font-mono">{opt.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal mockup card */}
      <div className="glass-card rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center space-x-1.5 px-4 py-3 border-b border-white/8 bg-white/3">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
          <span className="flex-1 text-center text-[11px] text-slate-500 font-mono">ndl-lab — ios-xe</span>
        </div>
        <div className="p-4 font-mono text-[11px] leading-relaxed space-y-1 h-full">
          {TERMINAL_LINES.map((line, i) => (
            <div key={i}>
              <span className="text-emerald-400">{line.prompt}</span>{' '}
              <span className="text-slate-300">{line.cmd}</span>
            </div>
          ))}
          <div className="flex items-center space-x-1 pt-1">
            <span className="text-emerald-400">Router(config-router)#</span>
            <span className="w-1.5 h-3.5 bg-slate-400 animate-pulse-glow inline-block" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Home({ openLoginModal }) {
  const [courses, setCourses] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    // This section is a curated highlight, not a browse view — ask the API
    // for popular courses directly rather than fetching everything and
    // trimming client-side. Full browsing lives on /learning-paths now.
    apiClient.get('/courses', { params: { isPopular: true } })
      .then(res => setCourses(res.data))
      .catch(() => {});

    apiClient.get('/testimonials')
      .then(res => setTestimonials(res.data))
      .catch(() => {});
  }, []);

  // Hard cap at 3 regardless of how many courses end up flagged popular.
  const featuredCourses = courses.slice(0, 3);

  return (
    <div>
      {/* ---- HERO ---- */}
      <section className="hero-bg dot-grid-bg min-h-screen flex items-center relative overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            {/* Announcement badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm font-semibold text-blue-400">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span>New: Guided Learning Paths by Career Track</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-white">
              Master Cisco.<br />
              <span className="text-gradient">Get Certified.</span>
            </h1>

            {/* Sub headline */}
            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Structured CCNA, CCNP, and Cybersecurity video courses by a CCIE-certified instructor.
              High-quality labs, practice exams, and everything you need to pass on your first try.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <button
                onClick={openLoginModal}
                className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center text-base"
              >
                <span>Start Learning Free</span>
                <ChevronRight className="h-4 w-4" />
              </button>
              <Link
                to="/practice-exam"
                className="btn-secondary flex items-center space-x-2 w-full sm:w-auto justify-center text-base"
              >
                <Play className="h-4 w-4" />
                <span>Try Practice Exam</span>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
              {['No credit card required', 'Instant access', 'Free plan forever'].map(label => (
                <span key={label} className="flex items-center space-x-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{label}</span>
                </span>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <div className="flex items-center space-x-2 text-slate-400 text-sm">
                <div className="flex -space-x-2">
                  {['A', 'B', 'C', 'D'].map((l, i) => (
                    <div key={l} className="w-7 h-7 rounded-full border-2 border-[#0A0B10] flex items-center justify-center text-[10px] font-bold text-white" style={{ background: ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B'][i] }}>{l}</div>
                  ))}
                </div>
                <span>5,000+ students enrolled</span>
              </div>
              <div className="flex items-center space-x-1.5 text-sm text-slate-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                <span className="font-semibold text-white">4.9</span>
                <span>average rating</span>
              </div>
              <div className="flex items-center space-x-1.5 text-sm text-slate-400">
                <Check className="h-4 w-4 text-green-400" />
                <span>95% first-try pass rate</span>
              </div>
            </div>
          </div>

          <HeroVisual />
        </div>
      </section>

      {/* ---- CERT LOGOS STRIP ---- */}
      <div className="section-bg-alt py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs font-bold text-slate-600 tracking-widest uppercase mb-5">
            Certification Paths Covered
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {['CCNA 200-301', 'CCNP ENCOR 350-401', 'CCNP ENARSI 300-410', 'CyberOps Associate', 'Cisco DevNet', 'Network+'].map(cert => (
              <span key={cert} className="text-slate-400 text-sm font-semibold border border-slate-800 rounded-full px-4 py-1.5 hover:border-blue-500/40 hover:text-slate-200 transition">
                {cert}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ---- STATS ---- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="glass-card-static rounded-2xl p-6 text-center space-y-2">
              <div className="stat-number">{s.number}</div>
              <p className="text-slate-500 text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- CERTIFICATION PATHS ---- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <span className="badge badge-blue mx-auto">Learning Paths</span>
          <h2 className="font-display text-4xl font-extrabold text-white">
            Choose Your Cisco Certification Path
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Structured from beginner to expert. Each path includes video courses, lab exercises, and a targeted practice exam engine.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {certPaths.map((path, i) => (
            <div key={i} className={`course-card bg-linear-to-b ${path.color} rounded-2xl`}>
              <div className="card-accent-bar" style={{ background: `linear-gradient(90deg, ${path.accent}, transparent)` }} />
              <div className="p-7 space-y-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <span className={`badge ${path.badgeClass}`}>{path.badge}</span>
                    <h3 className="font-display text-xl font-bold text-white leading-tight">{path.cert}</h3>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-900/50 px-2 py-1 rounded-lg">{path.level}</span>
                </div>

                <p className="text-slate-400 text-sm leading-relaxed">{path.desc}</p>

                <div className="space-y-2">
                  {path.modules.map(mod => (
                    <div key={mod} className="flex items-center space-x-2 text-sm text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                      <span>{mod}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-4">
                  <div className="flex items-center space-x-1.5"><Clock className="h-3.5 w-3.5" /><span>{path.duration}</span></div>
                  <div className="flex items-center space-x-1.5"><BookOpen className="h-3.5 w-3.5" /><span>{path.questions} questions</span></div>
                </div>

                <Link
                  to={`/learning-paths?topic=${encodeURIComponent(path.topicQuery)}`}
                  className="w-full py-3 rounded-xl font-bold text-sm transition flex items-center justify-center space-x-2"
                  style={{ background: `${path.accent}20`, color: path.accent, border: `1px solid ${path.accent}30` }}
                  onMouseOver={e => e.currentTarget.style.background = `${path.accent}30`}
                  onMouseOut={e => e.currentTarget.style.background = `${path.accent}20`}
                >
                  <span>Explore Path</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- HANDS-ON LAB ENVIRONMENTS ---- */}
      <section className="py-20 section-bg-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-14">
            <span className="badge badge-orange mx-auto">Hands-On</span>
            <h2 className="font-display text-4xl font-extrabold text-white">
              Practice on Real Cisco Environments
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Every module pairs video theory with lab exercises across the same tools you'll use on the job — and on exam day.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {labEnvironments.map((lab) => (
              <div key={lab.label} className="glass-card-static rounded-2xl p-5 flex flex-col items-center justify-center space-y-3 text-center hover:border-blue-500/25 transition">
                <div className="feature-icon">
                  <lab.icon className="h-5 w-5 text-blue-400" strokeWidth={1.8} />
                </div>
                <span className="text-xs font-semibold text-slate-300">{lab.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- POPULAR COURSES ---- */}
      {featuredCourses.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <span className="badge badge-green mx-auto">Most Popular</span>
              <h2 className="font-display text-4xl font-extrabold text-white">
                Start Your Journey Today
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">Our most popular courses. Free access to the first lesson of every course.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/learning-paths" className="btn-primary inline-flex items-center space-x-2">
                <span>View All Courses</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ---- WHY NETWORK DESIGN LABS ---- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <span className="badge badge-purple mx-auto">Why Us?</span>
          <h2 className="font-display text-4xl font-extrabold text-white">
            Built for Cisco Students. By Cisco Instructors.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Not a generic platform. Every course, question, and lab is hand-crafted by our CCIE-certified instructors with real enterprise networking experience.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className={`glass-card rounded-2xl p-7 flex items-start space-x-5 border ${f.borderColor}`} style={{ background: `linear-gradient(135deg, ${f.color})` }}>
              <div className={`feature-icon bg-linear-to-br ${f.color} border ${f.borderColor}`}>
                <f.icon className={`h-5 w-5 ${f.iconColor}`} strokeWidth={1.8} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-lg">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- INSTRUCTOR SPOTLIGHT ---- */}
      <section className="py-20 section-bg-alt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-3xl overflow-hidden border border-white/8">
            <div className="flex flex-col md:flex-row">
              {/* Instructor Visual */}
              <div className="md:w-80 bg-linear-to-br from-blue-600/20 to-indigo-700/10 p-10 flex flex-col items-center justify-center space-y-4 text-center border-b md:border-b-0 md:border-r border-white/5">
                <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl">
                  <span className="text-3xl font-display font-black text-white">G</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-xl text-white"> Our Instructor Team</h3>
                  <p className="text-blue-400 text-sm font-semibold">CCIE Certified • Cisco Instructor</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="badge badge-blue">CCNA</span>
                  <span className="badge badge-purple">CCNP</span>
                  <span className="badge badge-orange">CCIE</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                  <span className="text-slate-300 text-sm ml-1">4.9 / 5.0</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex-1 p-8 md:p-12 space-y-6">
                <h2 className="font-display text-3xl font-extrabold text-white">
                  Learn from a Real <span className="text-gradient">Cisco Professional</span>
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  Our instructors are CCIE-certified networking professionals with over 10 years of enterprise networking experience. 
                  As Cisco Certified Instructors, they've helped thousands of engineers pass their CCNA and CCNP exams through focused, practical, and exam-targeted study material.
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[{ n: '10+', l: 'Years Experience' }, { n: '5K+', l: 'Students Trained' }, { n: '95%', l: 'Pass Rate' }].map((s, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-white/3 border border-white/5">
                      <div className="text-2xl font-display font-black text-blue-400">{s.n}</div>
                      <div className="text-xs text-slate-500 font-medium mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
                <button onClick={openLoginModal} className="btn-primary inline-flex items-center space-x-2">
                  <span>Start Learning Today</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- TESTIMONIALS ---- */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <span className="badge badge-green mx-auto">Student Success</span>
          <h2 className="font-display text-4xl font-extrabold text-white">Trust Network Design Labs</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Real results from real students who passed their Cisco exams.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card rounded-2xl p-7 space-y-5">
              <div className="flex items-center space-x-1 text-yellow-400">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex items-center space-x-3 pt-2 border-t border-white/5">
                <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role} · {t.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---- PRICING CTA ---- */}
      <section className="py-20 section-bg-alt">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="font-display text-4xl font-extrabold text-white">
            Ready to Get <span className="text-gradient">Cisco Certified?</span>
          </h2>
          <p className="text-slate-400 text-lg">
            Join 5,000+ engineers already learning on Network Design Labs. Start for free — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={openLoginModal} className="btn-primary text-base px-8 py-4 flex items-center justify-center space-x-2">
              <span>Get Started Free</span>
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link to="/pricing" className="btn-secondary text-base px-8 py-4 inline-flex items-center justify-center space-x-2">
              <span>View Pricing</span>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center space-x-1.5"><Check className="h-4 w-4 text-green-400" /><span>Free tier available</span></div>
            <div className="flex items-center space-x-1.5"><Check className="h-4 w-4 text-green-400" /><span>Cancel anytime</span></div>
            <div className="flex items-center space-x-1.5"><Check className="h-4 w-4 text-green-400" /><span>Instant access</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;