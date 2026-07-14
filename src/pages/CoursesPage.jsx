import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import apiClient from '../api/client';
import CourseCard from '../components/ui/CourseCard';

function CoursesPage({ openLoginModal }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');

  useEffect(() => {
    apiClient.get('/courses')
      .then(res => { setCourses(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === 'All' || c.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  const coursePaths = [
    { label: 'CCNA', desc: '200-301', color: 'badge-green', count: courses.filter(c => c.title.toLowerCase().includes('ccna')).length || '–' },
    { label: 'CCNP', desc: '350-401', color: 'badge-blue', count: courses.filter(c => c.title.toLowerCase().includes('ccnp')).length || '–' },
    { label: 'Cybersecurity', desc: 'CyberOps', color: 'badge-orange', count: courses.filter(c => c.title.toLowerCase().includes('security') || c.title.toLowerCase().includes('cyber')).length || '–' },
    { label: 'Automation', desc: 'DevNet', color: 'badge-purple', count: courses.filter(c => c.title.toLowerCase().includes('auto') || c.title.toLowerCase().includes('python')).length || '–' },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="hero-bg py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="badge badge-blue mx-auto">Course Library</span>
          <h1 className="font-display text-5xl font-extrabold text-white">
            All Cisco <span className="text-gradient">IT Courses</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Structured video courses for CCNA, CCNP, Cybersecurity and Network Automation.
            Every course built by a CCIE-certified instructor.
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses (e.g. CCNA, routing, BGP...)"
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500/60 rounded-2xl pl-10 pr-4 py-3.5 text-white outline-none text-sm placeholder-slate-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Cert Path Quick Filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {coursePaths.map((p, i) => (
            <button
              key={i}
              onClick={() => setSearch(p.label)}
              className="glass-card rounded-2xl p-4 text-left space-y-2 hover:border-blue-500/30 transition"
            >
              <span className={`badge ${p.color}`}>{p.label}</span>
              <div className="text-xs text-slate-500">{p.desc}</div>
              <div className="text-2xl font-display font-black text-white">{p.count}<span className="text-sm text-slate-500 font-normal ml-1">courses</span></div>
            </button>
          ))}
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {difficulties.map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-4 py-1.5 text-sm font-semibold transition ${difficulty === d ? 'tab-active' : 'tab-inactive'}`}
              >
                {d}
              </button>
            ))}
          </div>
          <span className="ml-auto text-xs text-slate-600">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card-static rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="text-5xl">🔍</div>
            <p className="text-slate-400 text-lg">No courses found matching "{search}"</p>
            <button onClick={() => { setSearch(''); setDifficulty('All'); }} className="text-blue-400 text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} actionLabel="Enroll Now" />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="glass-card rounded-3xl p-10 text-center space-y-5 border border-blue-500/15">
          <h2 className="font-display text-3xl font-extrabold text-white">Can't find what you're looking for?</h2>
          <p className="text-slate-400 max-w-lg mx-auto">New courses are added regularly. Sign up free to get notified when new Cisco certification content launches.</p>
          <button onClick={openLoginModal} className="btn-primary inline-flex items-center space-x-2">
            <span>Create Free Account</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoursesPage;
