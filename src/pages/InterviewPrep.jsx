import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ChevronDown, MessageCircleQuestion, Lock } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function QuestionAccordionItem({ question, isOpen, onToggle }) {
  return (
    <div className="glass-card-static rounded-2xl overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="font-semibold text-white text-sm leading-relaxed">{question.questionText}</span>
        <ChevronDown className={`h-4 w-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5">
          <div className="border-t border-white/6 pt-4">
            <p className="text-slate-400 text-sm leading-relaxed">{question.correctAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PremiumGate() {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6 py-16">
      <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center bg-purple-500/15 border border-purple-500/30">
        <Lock className="h-7 w-7 text-purple-300" />
      </div>
      <div className="space-y-2">
        <h1 className="font-display text-2xl font-extrabold text-white">Premium Feature</h1>
        <p className="text-slate-400 leading-relaxed">
          Interview Prep — real-world mock questions with expert-written answers — is exclusively
          available to Premium members. Upgrade your account to unlock the full question bank.
        </p>
      </div>
      <Link to="/pricing" className="btn-primary inline-flex items-center space-x-2">
        <Sparkles className="h-4 w-4" />
        <span>Upgrade to Premium</span>
      </Link>
    </div>
  );
}

function InterviewPrep() {
  const { isPremium } = useAuth();
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('All');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    // Free accounts never even request the question bank — there's nothing
    // for them to see on this page, so there's no reason to pull the data.
    if (!isPremium) {
      setLoading(false);
      return;
    }
    apiClient.get('/interviews')
      .then(res => setAllQuestions(res.data || []))
      .finally(() => setLoading(false));
  }, [isPremium]);

  const topics = useMemo(
    () => ['All', ...new Set(allQuestions.map(q => q.topic))].filter(Boolean),
    [allQuestions]
  );

  const visibleQuestions = useMemo(
    () => (topic === 'All' ? allQuestions : allQuestions.filter(q => q.topic === topic)),
    [allQuestions, topic]
  );

  if (!isPremium) {
    return <PremiumGate />;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-3">
        <span className="badge badge-purple mx-auto">Interview Prep</span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
          Real Interview Questions, <span className="text-gradient">Expert Answers</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Tap a question to reveal a model answer written for real Cisco networking interviews.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-slate-900/50 animate-pulse" />)}
        </div>
      ) : allQuestions.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center space-y-3">
          <MessageCircleQuestion className="h-8 w-8 text-slate-600 mx-auto" />
          <p className="text-slate-400">No interview questions have been added yet — check back soon.</p>
        </div>
      ) : (
        <>
          {topics.length > 2 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => setTopic(t)}
                  className={`px-4 py-1.5 text-xs font-semibold transition ${topic === t ? 'tab-active' : 'tab-inactive'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {visibleQuestions.map(q => (
              <QuestionAccordionItem
                key={q.id}
                question={q}
                isOpen={openId === q.id}
                onToggle={() => setOpenId(prev => (prev === q.id ? null : q.id))}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default InterviewPrep;