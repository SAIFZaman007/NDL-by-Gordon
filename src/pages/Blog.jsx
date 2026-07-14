import React, { useState, useEffect } from 'react';
import { X, ChevronRight } from 'lucide-react';
import apiClient from '../api/client';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    apiClient.get('/blog')
      .then(res => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4">
        <span className="badge badge-purple mx-auto">Blog</span>
        <h1 className="font-display text-5xl font-extrabold text-white">Networking Insights & Study Guides</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Expert articles on Cisco certifications, networking concepts, and career advice.
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-64 bg-slate-900/50" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          No articles published yet. Stay tuned!
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post.id} className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between">
              <div>
                <div className="card-accent-bar" />
                {post.coverImage && (
                  <img src={post.coverImage} alt={post.title} className="w-full h-40 object-cover opacity-75" />
                )}
                <div className="p-7 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge badge-blue">{post.category}</span>
                    <span className="text-xs text-slate-500">{post.readTime}</span>
                  </div>
                  <h2 className="font-display font-bold text-white text-xl leading-snug">{post.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                </div>
              </div>
              <div className="p-7 pt-0 flex items-center justify-between text-xs text-slate-600 border-t border-white/5 pt-4">
                <span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="text-blue-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <span>Read More</span><ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Details Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="glass-card w-full max-w-3xl rounded-3xl p-8 relative space-y-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-300 transition">
              <X className="h-5 w-5" />
            </button>

            {selectedPost.coverImage && (
              <img src={selectedPost.coverImage} alt={selectedPost.title} className="w-full h-64 object-cover rounded-2xl opacity-80" />
            )}

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-xs text-slate-500">
                <span className="badge badge-blue">{selectedPost.category}</span>
                <span>•</span>
                <span>{selectedPost.readTime}</span>
                <span>•</span>
                <span>{new Date(selectedPost.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <h1 className="font-display text-3xl font-extrabold text-white">{selectedPost.title}</h1>
            </div>

            <div className="divider" />

            <div className="text-slate-300 leading-relaxed text-sm whitespace-pre-line space-y-4">
              {selectedPost.content}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="btn-secondary text-xs px-5 py-2.5"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blog;