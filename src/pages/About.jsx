import React, { useState, useEffect } from 'react';
import { Award, Users, Target, BookOpen } from 'lucide-react';
import apiClient from '../api/client';

const iconMap = { Award, Users, Target, BookOpen };

function About() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/about')
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 max-w-6xl mx-auto px-4 text-center space-y-8 animate-pulse">
        <div className="h-8 bg-slate-900 w-48 mx-auto rounded-full" />
        <div className="h-12 bg-slate-900 w-96 mx-auto rounded-2xl" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <div className="h-6 bg-slate-900 rounded-xl" />
            <div className="h-6 bg-slate-900 rounded-xl" />
            <div className="h-6 bg-slate-900 rounded-xl" />
          </div>
          <div className="h-64 bg-slate-900 rounded-3xl" />
        </div>
      </div>
    );
  }

  const aboutData = data || {
    title: "About Network Design Labs",
    subTitle: "About",
    paragraphs: [
      "Network Design Labs was founded by a team of CCIE-certified Cisco networking professionals to deliver structured, practical, and exam-focused IT training.",
      "Unlike generic e-learning platforms, every course on this platform is hand-crafted by our own instructors. The focus is entirely on Cisco certifications: CCNA, CCNP, and Cybersecurity — because that's what IT professionals need to advance in their careers.",
      "The platform features high-quality video lectures, downloadable lab exercises, and a comprehensive practice exam engine. Everything you need to pass your Cisco exam on the first try."
    ],
    stats: [
      { icon: 'Award', label: 'Cisco CCIE Certified', sub: 'Enterprise Infrastructure' },
      { icon: 'Users', label: '5,000+ Students Trained', sub: 'Across 50+ countries' },
      { icon: 'Target', label: '95% First-Attempt Pass Rate', sub: 'CCNA & CCNP combined' },
      { icon: 'BookOpen', label: '40+ Video Courses', sub: 'With hands-on labs' }
    ]
  };

  return (
    <div className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      <div className="text-center space-y-4">
        <span className="badge badge-blue mx-auto">{aboutData.subTitle}</span>
        <h1 className="font-display text-5xl font-extrabold text-white">{aboutData.title}</h1>
      </div>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6 text-slate-400 leading-relaxed">
          {(aboutData.paragraphs || []).map((para, idx) => (
            <p key={idx} className={idx === 0 ? "text-lg text-slate-300" : ""}>
              {para}
            </p>
          ))}
        </div>
        <div className="glass-card rounded-3xl p-8 space-y-6">
          {(aboutData.stats || []).map((item, i) => {
            const IconComponent = iconMap[item.icon] || Award;
            return (
              <div key={i} className="flex items-center space-x-4">
                <div className="feature-icon">
                  <IconComponent className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default About;