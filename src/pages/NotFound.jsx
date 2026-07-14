import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-center mx-auto">
          <Compass className="h-7 w-7 text-blue-400" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-extrabold text-white">Page not found</h1>
          <p className="text-slate-400">The page you're looking for doesn't exist or may have moved.</p>
        </div>
        <Link to="/" className="btn-primary inline-flex items-center space-x-2">
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
