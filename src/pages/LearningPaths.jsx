import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight, Layers, Briefcase, Search as SearchIcon } from 'lucide-react';
import apiClient from '../api/client';
import CourseCard from '../components/ui/CourseCard';

const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const SECTIONS = [
  { id: 'all', label: 'All Courses', icon: SearchIcon },
  { id: 'topic', label: 'By Topic', icon: Layers },
  { id: 'career', label: 'By Career Track', icon: Briefcase },
];

// One learning path with its ordered courses. Renders nothing if the path
// has no courses attached yet, rather than showing an empty card.
function PathGroup({ path }) {
  const courses = [...(path.courses || [])]
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(c => c.course)
    .filter(Boolean);

  if (courses.length === 0) return null;

  return (
    <div className="space-y-5">
      <div>
        <h3 className="font-display text-2xl font-bold text-white">{path.title}</h3>
        {path.description && <p className="text-slate-500 text-sm mt-1 max-w-2xl">{path.description}</p>}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => <CourseCard key={course.id} course={course} actionLabel="View Course" />)}
      </div>
    </div>
  );
}

function LearningPaths({ openLoginModal }) {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [topicPaths, setTopicPaths] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('topic') || '');
  const [difficulty, setDifficulty] = useState('All');
  const [section, setSection] = useState('all');

  useEffect(() => {
    Promise.all([
      apiClient.get('/courses'),
      apiClient.get('/learning-paths', { params: { pathType: 'TOPIC' } }),
      apiClient.get('/learning-paths', { params: { pathType: 'CAREER_TRACK' } }),
    ])
      .then(([coursesRes, topicRes, careerRes]) => {
        setCourses(coursesRes.data);
        setTopicPaths(topicRes.data);
        setCareerPaths(careerRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || '').toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficulty === 'All' || c.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="hero-bg py-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="badge badge-blue mx-auto">Learning Paths</span>
          <h1 className="font-display text-5xl font-extrabold text-white">
            Find Your <span className="text-gradient">Cisco Learning Path</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Browse every course, or follow a guided path by topic or career goal.
            Every course built by a CCIE-certified instructor.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Section switcher */}
        <div className="flex items-center justify-center flex-wrap gap-2 sticky top-16 z-10 py-3 -mt-3 bg-[#0A0B10]/80 backdrop-blur-md">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSection(s.id)}
              className={`px-4 py-1.5 text-sm font-semibold transition inline-flex items-center space-x-1.5 ${section === s.id ? 'tab-active' : 'tab-inactive'}`}
            >
              <s.icon className="h-3.5 w-3.5" />
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card-static rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* ---- A. All Courses ---- */}
            {section === 'all' && (
              <div className="space-y-8">
                <div className="max-w-lg mx-auto relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search courses (e.g. CCNA, routing, BGP...)"
                    className="w-full bg-white/5 border border-white/10 focus:border-blue-500/60 rounded-2xl pl-10 pr-4 py-3.5 text-white outline-none text-sm placeholder-slate-500 transition"
                  />
                </div>
                <div className="flex items-center justify-center flex-wrap gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter:</span>
                  <div className="flex flex-wrap gap-2">
                    {DIFFICULTIES.map(d => (
                      <button
                        key={d}
                        onClick={() => setDifficulty(d)}
                        className={`px-4 py-1.5 text-sm font-semibold transition ${difficulty === d ? 'tab-active' : 'tab-inactive'}`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-600">{filtered.length} course{filtered.length !== 1 ? 's' : ''}</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-20 space-y-4">
                    <div className="text-5xl">🔍</div>
                    <p className="text-slate-400 text-lg">No courses found{search ? ` matching "${search}"` : ''}.</p>
                    <button onClick={() => { setSearch(''); setDifficulty('All'); }} className="text-blue-400 text-sm hover:underline">Clear filters</button>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(course => <CourseCard key={course.id} course={course} actionLabel="Enroll Now" />)}
                  </div>
                )}
              </div>
            )}

            {/* ---- B. By Topic ---- */}
            {section === 'topic' && (
              <div className="space-y-14">
                {topicPaths.length === 0 ? (
                  <p className="text-center text-slate-500 py-16">No topic-based paths published yet — check back soon.</p>
                ) : (
                  topicPaths.map(path => <PathGroup key={path.id} path={path} />)
                )}
              </div>
            )}

            {/* ---- C. By Career Track ---- */}
            {section === 'career' && (
              <div className="space-y-14">
                {careerPaths.length === 0 ? (
                  <p className="text-center text-slate-500 py-16">No career-track paths published yet — check back soon.</p>
                ) : (
                  careerPaths.map(path => <PathGroup key={path.id} path={path} />)
                )}
              </div>
            )}
          </>
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

export default LearningPaths;