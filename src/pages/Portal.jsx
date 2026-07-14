import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Target, BookOpen, TrendingUp, Sparkles, ExternalLink, CheckCircle2, XCircle, MessageCircleQuestion, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth, ADMIN_EMAIL } from '../context/AuthContext';
import CourseCard from '../components/ui/CourseCard';

const DASHBOARD_URL = import.meta.env.VITE_DASHBOARD_URL || 'http://localhost:3001';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="glass-card-static rounded-2xl p-5 space-y-2">
      <div className="flex items-center justify-between">
        <div className="feature-icon w-10! h-10!">
          <Icon className="h-4.5 w-4.5 text-blue-400" />
        </div>
      </div>
      <div className="font-display text-2xl font-black text-white">{value}</div>
      <p className="text-slate-500 text-xs font-medium">{label}</p>
    </div>
  );
}

function Portal() {
  const { email, membershipLevel, isPremium } = useAuth();
  const [loading, setLoading] = useState(true);
  const [coursesWithProgress, setCoursesWithProgress] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [coursesRes, attemptsRes] = await Promise.all([
          apiClient.get('/courses'),
          apiClient.get('/exams/attempts'),
        ]);

        if (cancelled) return;
        setAttempts(attemptsRes.data || []);

        // The course list doesn't carry per-user progress — only the detail
        // endpoint does. We fetch each course's detail (same endpoint the
        // course page already uses) to compute a completion percentage.
        const detailed = await Promise.all(
          (coursesRes.data || []).map(c =>
            apiClient.get(`/courses/${c.id}`).then(r => r.data).catch(() => null)
          )
        );

        if (cancelled) return;
        const withProgress = detailed
          .filter(Boolean)
          .map(c => {
            const total = c.lessons?.length || 0;
            const done = c.lessons?.filter(l => l.completed).length || 0;
            return { ...c, progressPct: total ? Math.round((done / total) * 100) : 0 };
          });
        setCoursesWithProgress(withProgress);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const startedCourses = coursesWithProgress.filter(c => c.progressPct > 0);
  const avgScore = attempts.length ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / attempts.length) : 0;
  const bestScore = attempts.length ? Math.max(...attempts.map(a => a.score)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <p className="text-slate-500 text-sm">Welcome back,</p>
          <h1 className="font-display text-3xl font-extrabold text-white">{email}</h1>
        </div>
        <span className={`badge ${isPremium ? 'badge-blue' : 'badge-green'} !text-sm`}>
          {isPremium ? 'Premium Member' : 'Free Plan'}
        </span>
      </div>

      {email === ADMIN_EMAIL && (
        <a
          href={DASHBOARD_URL}
          className="flex items-center justify-between glass-card rounded-2xl p-4 border border-purple-500/25 hover:border-purple-500/40 transition group"
        >
          <span className="text-sm text-slate-300">
            You're signed in with the admin account — manage the platform from the <span className="text-purple-300 font-semibold">Admin Dashboard</span>.
          </span>
          <ExternalLink className="h-4 w-4 text-purple-300 group-hover:translate-x-0.5 transition" />
        </a>
      )}

      {!isPremium && (
        <div className="glass-card rounded-2xl p-6 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="feature-icon"><Sparkles className="h-5 w-5 text-blue-400" /></div>
            <div>
              <p className="text-white font-semibold text-sm">Unlock every lesson and unlimited practice questions</p>
              <p className="text-slate-500 text-xs mt-0.5">You're currently on the Free plan — first lesson of every course only.</p>
            </div>
          </div>
          <Link to="/pricing" className="btn-primary text-sm px-5 py-2.5 flex-shrink-0">Upgrade to Premium</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Courses Started" value={loading ? '–' : startedCourses.length} />
        <StatCard icon={Target} label="Practice Attempts" value={loading ? '–' : attempts.length} />
        <StatCard icon={TrendingUp} label="Average Score" value={loading ? '–' : `${avgScore}%`} />
        <StatCard icon={Award} label="Best Score" value={loading ? '–' : `${bestScore}%`} />
      </div>

      {/* Interview Prep */}
<Link
  to="/interview-prep"
  className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-5 border border-purple-500/15 hover:border-purple-500/30 transition group"
>
  <div className="flex items-center space-x-4">
    <div className="feature-icon" style={{ background: 'rgba(168,85,247,0.12)', borderColor: 'rgba(168,85,247,0.2)' }}>
      <MessageCircleQuestion className="h-5 w-5 text-purple-300" />
    </div>
    <div>
      <p className="text-white font-semibold text-sm flex items-center space-x-2">
        <span>Interview Prep</span>
        {!isPremium && <span className="badge badge-purple text-[10px]! py-0.5! px-2!">Premium</span>}
      </p>
      <p className="text-slate-500 text-xs mt-0.5">Real-world Cisco interview questions with expert-written answers.</p>
    </div>
  </div>
  <span className="btn-secondary text-sm px-5 py-2.5 shrink-0 inline-flex items-center space-x-1.5 group-hover:translate-x-0.5 transition">
    <span>{isPremium ? 'Open Interview Prep' : 'Preview'}</span>
    <ChevronRight className="h-4 w-4" />
  </span>
</Link>

      {/* Continue Learning */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Continue Learning</h2>
          <Link to="/courses" className="text-blue-400 text-sm font-semibold hover:underline">Browse all courses</Link>
        </div>
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <div key={i} className="glass-card-static rounded-2xl h-72 animate-pulse" />)}
          </div>
        ) : startedCourses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {startedCourses.map(c => <CourseCard key={c.id} course={c} progress={c.progressPct} />)}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center space-y-4">
            <p className="text-slate-400">You haven't started a course yet.</p>
            <Link to="/courses" className="btn-primary inline-flex items-center space-x-2">
              <span>Browse Courses</span>
            </Link>
          </div>
        )}
      </div>

      {/* Recent Exam Attempts */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Recent Practice Exam Attempts</h2>
          <Link to="/practice-exam" className="text-blue-400 text-sm font-semibold hover:underline">Take a practice exam</Link>
        </div>
        {loading ? (
          <div className="glass-card-static rounded-2xl h-40 animate-pulse" />
        ) : attempts.length > 0 ? (
          <div className="glass-card rounded-2xl divide-y divide-white/5">
            {attempts.slice(0, 8).map(a => (
              <div key={a.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-3">
                  {a.passed ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                  <span className="text-sm text-slate-300">
                    {new Date(a.completedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`badge ${a.passed ? 'badge-green' : 'badge-orange'}`}>{a.passed ? 'Passed' : 'Failed'}</span>
                  <span className="text-sm font-bold text-white w-12 text-right">{a.score}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center space-y-4">
            <p className="text-slate-400">No practice exam attempts yet.</p>
            <Link to="/practice-exam" className="btn-primary inline-flex items-center space-x-2">
              <span>Start Practicing</span>
            </Link>
          </div>
        )}
      </div>

      {/* Account */}
      <div className="glass-card rounded-2xl p-7 space-y-4">
        <h2 className="font-display text-lg font-bold text-white">Account</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-slate-500">Email</span>
            <span className="text-slate-200 font-medium">{email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-slate-500">Membership</span>
            <span className="text-slate-200 font-medium capitalize">{membershipLevel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portal;