import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Lock, CheckCircle2, Circle, PlayCircle, ArrowLeft, Sparkles } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function isYouTubeUrl(url) {
  return /youtube\.com|youtu\.be/.test(url || '');
}

function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    const videoId = u.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

function VideoEmbed({ url, title }) {
  if (!url) {
    return (
      <div className="aspect-video rounded-2xl bg-white/3 border border-white/8 flex items-center justify-center">
        <PlayCircle className="h-10 w-10 text-slate-700" />
      </div>
    );
  }
  if (isYouTubeUrl(url)) {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden border border-white/8">
        <iframe
          className="w-full h-full"
          src={toYouTubeEmbed(url)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="aspect-video rounded-2xl overflow-hidden border border-white/8 bg-black">
      <video className="w-full h-full" src={url} controls />
    </div>
  );
}

function CourseDetail() {
  const { courseId } = useParams();
  const { token, isAuthenticated, isPremium } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [savingProgress, setSavingProgress] = useState(false);

  const loadCourse = useCallback(() => {
    setLoading(true);
    const params = token ? { user_token: token } : {};
    apiClient.get(`/courses/${courseId}`, { params })
      .then(res => {
        setCourse(res.data);
        setActiveLessonId(prev => prev || res.data.lessons?.[0]?.id || null);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [courseId, token]);

  useEffect(() => { loadCourse(); }, [loadCourse]);

  const activeLesson = useMemo(
    () => course?.lessons?.find(l => l.id === activeLessonId) || null,
    [course, activeLessonId]
  );

  const completedCount = course?.lessons?.filter(l => l.completed).length || 0;
  const totalCount = course?.lessons?.length || 0;
  const progressPct = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleComplete = async () => {
    if (!activeLesson || !isAuthenticated) return;
    setSavingProgress(true);
    try {
      await apiClient.post(`/courses/lessons/${activeLesson.id}/progress`, {
        completed: !activeLesson.completed,
      });
      setCourse(prev => ({
        ...prev,
        lessons: prev.lessons.map(l => l.id === activeLesson.id ? { ...l, completed: !l.completed } : l),
      }));
    } catch {
      // Silently ignore — the button simply won't reflect the change.
    } finally {
      setSavingProgress(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-pulse space-y-6">
        <div className="h-8 bg-slate-900 w-48 rounded-full" />
        <div className="h-12 bg-slate-900 w-2/3 rounded-2xl" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="h-64 bg-slate-900/50 rounded-2xl md:col-span-1" />
          <div className="h-96 bg-slate-900/50 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-5">
        <h1 className="font-display text-3xl font-extrabold text-white">Course not found</h1>
        <p className="text-slate-400">This course may have been removed or the link is incorrect.</p>
        <Link to="/courses" className="btn-primary inline-flex items-center space-x-2">
          <span>Browse All Courses</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="hero-bg py-14 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link to="/courses" className="inline-flex items-center space-x-1.5 text-slate-400 hover:text-white text-sm transition">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>All Courses</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <span className={`badge ${course.difficulty === 'Advanced' ? 'badge-orange' : course.difficulty === 'Intermediate' ? 'badge-purple' : 'badge-green'}`}>
              {course.difficulty || 'Beginner'}
            </span>
            {isAuthenticated && (
              <span className="text-xs text-slate-500 font-medium">{completedCount} / {totalCount} lessons complete</span>
            )}
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white max-w-3xl">{course.title}</h1>
          <p className="text-slate-400 max-w-2xl leading-relaxed">{course.description}</p>
          {isAuthenticated && totalCount > 0 && (
            <div className="max-w-md progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-6 items-start">
        {/* Lesson list */}
        <div className="md:col-span-1 glass-card rounded-2xl p-3 space-y-1 md:sticky md:top-24">
          {course.lessons?.map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLessonId(lesson.id)}
              className={`w-full flex items-center gap-3 text-left px-3.5 py-3 rounded-xl transition ${
                activeLessonId === lesson.id ? 'bg-blue-500/10 border border-blue-500/25' : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              {lesson.isLocked ? (
                <Lock className="h-4 w-4 text-slate-600 flex-shrink-0" />
              ) : lesson.completed ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-slate-600 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${activeLessonId === lesson.id ? 'text-white' : 'text-slate-300'}`}>
                  {idx + 1}. {lesson.title}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Active lesson content */}
        <div className="md:col-span-2 space-y-6">
          {activeLesson?.isLocked ? (
            <div className="glass-card rounded-3xl p-10 text-center space-y-5 border border-blue-500/15">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto">
                <Lock className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="font-display text-2xl font-bold text-white">This lesson is Premium</h2>
              <p className="text-slate-400 max-w-md mx-auto">
                Free accounts can preview the first lesson of every course. Upgrade to Premium to unlock every lesson, lab, and practice question.
              </p>
              <Link to="/pricing" className="btn-primary inline-flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Upgrade to Premium</span>
              </Link>
            </div>
          ) : activeLesson ? (
            <>
              <VideoEmbed url={activeLesson.videoUrl} title={activeLesson.title} />
              <div className="glass-card rounded-2xl p-7 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-xl font-bold text-white">{activeLesson.title}</h2>
                  {isAuthenticated && (
                    <button
                      onClick={toggleComplete}
                      disabled={savingProgress}
                      className={`flex-shrink-0 text-xs font-bold px-4 py-2 rounded-full transition flex items-center space-x-1.5 disabled:opacity-60 ${
                        activeLesson.completed
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-300 border border-white/10 hover:border-blue-500/30'
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{activeLesson.completed ? 'Completed' : 'Mark Complete'}</span>
                    </button>
                  )}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">{activeLesson.textContent}</p>
              </div>
              {!isAuthenticated && (
                <p className="text-center text-xs text-slate-500">Sign in to track your progress across lessons.</p>
              )}
              {isAuthenticated && !isPremium && (
                <p className="text-center text-xs text-slate-500">
                  Free plan: first lesson unlocked. <Link to="/pricing" className="text-blue-400 hover:underline">Upgrade</Link> to unlock the rest of this course.
                </p>
              )}
            </>
          ) : (
            <div className="glass-card rounded-2xl p-10 text-center text-slate-500">This course has no lessons yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseDetail;
