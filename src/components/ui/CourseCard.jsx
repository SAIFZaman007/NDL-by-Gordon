import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, ChevronRight, BookOpen } from 'lucide-react';
import { API_BASE } from '../../api/client';

// Admin-uploaded thumbnails are stored as relative paths
// ("/uploads/courses/<file>") and served from the backend origin, while
// seeded/legacy courses hold absolute "https://..." URLs. Resolve both so
// every course's thumbnail renders correctly wherever this site is
// deployed. (Same pattern as frontend/src/pages/Blog.jsx.)
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');
const resolveImageUrl = (url) => (url && url.startsWith('/') ? `${API_ORIGIN}${url}` : url);

function difficultyBadgeClass(difficulty) {
  if (difficulty === 'Advanced') return 'badge-orange';
  if (difficulty === 'Intermediate') return 'badge-purple';
  return 'badge-green';
}

// progress: optional 0-100. When provided, shows a progress bar instead
// of the static rating row (used on the student Portal's "continue
// learning" list).
function CourseCard({ course, progress, actionLabel = 'View Course' }) {
  return (
    <Link to={`/courses/${course.id}`} className="course-card flex flex-col">
      <div className="card-accent-bar" />
      {course.thumbnailUrl && (
        <img src={resolveImageUrl(course.thumbnailUrl)} alt={course.title} loading="lazy" className="w-full h-44 object-cover opacity-80" />
      )}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="flex items-center justify-between">
          <span className={`badge ${difficultyBadgeClass(course.difficulty)}`}>
            {course.difficulty || 'Beginner'}
          </span>
          {typeof progress !== 'number' && (
            <div className="flex items-center space-x-1 text-yellow-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="text-xs font-bold text-slate-300">4.9</span>
            </div>
          )}
        </div>
        <div className="flex-grow space-y-2">
          <h3 className="font-display font-bold text-white text-lg leading-snug">{course.title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{course.description}</p>
        </div>

        {typeof progress === 'number' ? (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Progress</span>
              <span className="text-blue-400 font-bold">{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-600 border-t border-white/5 pt-3">
            <div className="flex items-center space-x-1"><BookOpen className="h-3.5 w-3.5" /><span>Cisco Certified</span></div>
            <div className="flex items-center space-x-1"><Play className="h-3.5 w-3.5" /><span>Video + Labs</span></div>
          </div>
        )}

        <span className="w-full py-2.5 bg-white/5 hover:bg-blue-600/10 border border-white/8 hover:border-blue-500/30 text-slate-300 hover:text-blue-300 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2">
          <span>{progress > 0 ? 'Continue' : actionLabel}</span>
          <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}

export default CourseCard;