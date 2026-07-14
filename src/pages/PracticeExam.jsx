import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Lock, ChevronRight, RotateCcw, Sparkles, Clock } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

const PASSING_SCORE = 70;

// The exam clock is ONE running countdown for the whole attempt, not a
// per-question timer — this constant is the per-question budget used only
// to size that single clock (questions-in-category × this value).
const SECONDS_PER_QUESTION_BUDGET = 120;

// Loose comparison used only for judging correctness — trims and collapses
// whitespace and ignores case, so a stray formatting difference (not a
// meaning difference) between an option and the stored correct answer can
// never silently read as "wrong". The source of truth is still whatever
// the admin marked as correct; this just makes matching it robust. The
// backend now also refuses to save a correctOption that isn't one of the
// options at all, so this is defense-in-depth, not the only thing standing
// between a right answer and a wrong-looking result.
function normalize(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function CategoryPicker({ categories, onPick, loading }) {
  const minutesPerQuestion = SECONDS_PER_QUESTION_BUDGET / 60;
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
      <span className="badge badge-purple mx-auto">Practice Exam</span>
      <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-white">
        Test Your <span className="text-gradient">Cisco Knowledge</span>
      </h1>
      <p className="text-slate-400 text-lg">
        Pick a category to start a timed practice run — one clock for the whole exam, budgeted at
        {' '}{minutesPerQuestion} minute{minutesPerQuestion !== 1 ? 's' : ''} per question. The first 40 questions are free for everyone.
      </p>
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-900/50 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => onPick(cat)}
              className="glass-card rounded-2xl p-6 text-left hover:border-blue-500/30 transition space-y-1"
            >
              <div className="font-display font-bold text-white text-lg">{cat}</div>
              <div className="text-xs text-slate-500">Start practice run →</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PracticeExam() {
  const { token, isAuthenticated } = useAuth();
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  // Which question IDs have already been checked (answer revealed + locked).
  // This is what powers both the instant reveal and the forward-only lock.
  const [checkedIds, setCheckedIds] = useState({});
  // Seconds left on the single, whole-exam clock.
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);
  const finishingRef = useRef(false); // guards against double-submitting one attempt

  useEffect(() => {
    const params = token ? { user_token: token } : {};
    apiClient.get('/exams/questions', { params })
      .then(res => setAllQuestions(res.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  const categories = useMemo(
    () => [...new Set(allQuestions.map(q => q.category))].filter(Boolean),
    [allQuestions]
  );

  const categoryQuestions = useMemo(
    () => category ? allQuestions.filter(q => q.category === category) : [],
    [allQuestions, category]
  );

  const answerable = useMemo(() => categoryQuestions.filter(q => !q.isLocked), [categoryQuestions]);
  const lockedCount = categoryQuestions.length - answerable.length;

  const currentQuestion = answerable[currentIndex];
  const isChecked = currentQuestion ? !!checkedIds[currentQuestion.id] : false;

  // Scoring stays a straight comparison against correctOption (the source of
  // truth an admin sets) — normalize() just guards against whitespace/case
  // noise so a genuinely correct pick is never marked wrong. The extra
  // "norm !== ''" guard means an unanswered question (exam clock ran out)
  // can never accidentally register as correct against a blank correctOption.
  const score = useMemo(() => {
    if (!answerable.length) return 0;
    const correct = answerable.filter(q => {
      const norm = normalize(q.correctOption);
      return norm !== '' && normalize(answers[q.id]) === norm;
    }).length;
    return Math.round((correct / answerable.length) * 100);
  }, [answerable, answers]);
  const passed = score >= PASSING_SCORE;

  const finishQuiz = async () => {
    if (finishingRef.current) return; // already finishing/finished — never submit an attempt twice
    finishingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    setFinished(true);
    if (!isAuthenticated) return;
    setSaving(true);
    try {
      await apiClient.post('/exams/attempts', { score, passed });
      setSaved(true);
    } catch {
      // Non-fatal — the person still sees their score on screen.
    } finally {
      setSaving(false);
    }
  };

  // The single exam-wide clock: runs continuously from the moment a category
  // is chosen until the attempt finishes, independent of which question is
  // active or whether it's been checked.
  useEffect(() => {
    if (!category || finished) return undefined;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [category, finished]);

  // When the clock actually reaches zero, the attempt ends automatically —
  // whatever's answered counts, anything else scores as wrong.
  useEffect(() => {
    if (category && !finished && timeLeft === 0) {
      finishQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const startCategory = (cat) => {
    // Computed directly here (not via the `answerable` memo) so this is
    // correct on every call, including retries of the same category, where
    // `category` state wouldn't otherwise be seen as "changing".
    const count = allQuestions.filter(q => q.category === cat && !q.isLocked).length;
    finishingRef.current = false;
    setCategory(cat);
    setCurrentIndex(0);
    setAnswers({});
    setCheckedIds({});
    setFinished(false);
    setSaved(false);
    setTimeLeft(Math.max(count, 1) * SECONDS_PER_QUESTION_BUDGET);
  };

  const lockCurrentQuestion = () => {
    if (!currentQuestion) return;
    setCheckedIds(prev => (prev[currentQuestion.id] ? prev : { ...prev, [currentQuestion.id]: true }));
  };

  const selectOption = (option) => {
    if (isChecked) return; // locked — the answer for this question is already final
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
  };

  const checkAnswer = () => {
    if (!currentQuestion || isChecked || !answers[currentQuestion.id]) return;
    lockCurrentQuestion();
  };

  // Forward-only: the only way to move to the next question is through here,
  // and it refuses to advance until the current one has been checked.
  const goToNext = () => {
    if (!isChecked) return;
    setCurrentIndex(i => Math.min(answerable.length - 1, i + 1));
  };

  if (!category) {
    return <CategoryPicker categories={categories} onPick={startCategory} loading={loading} />;
  }

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-8 py-10">
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center ${passed ? 'bg-emerald-500/15 border border-emerald-500/30' : 'bg-orange-500/15 border border-orange-500/30'}`}>
          {passed ? <CheckCircle2 className="h-9 w-9 text-emerald-400" /> : <XCircle className="h-9 w-9 text-orange-400" />}
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-4xl font-extrabold text-white">{score}%</h1>
          <p className="text-slate-400">
            {passed ? `Nice work — that's a pass (${PASSING_SCORE}%+).` : `Not quite a pass yet — you need ${PASSING_SCORE}%+.`}
          </p>
        </div>

        {!isAuthenticated && (
          <p className="text-sm text-slate-500 glass-card-static rounded-xl p-4 max-w-md mx-auto">
            Sign in to save this attempt and track your score history in your Portal.
          </p>
        )}
        {isAuthenticated && saving && <p className="text-sm text-slate-500">Saving your attempt…</p>}
        {isAuthenticated && saved && <p className="text-sm text-emerald-400">Attempt saved to your Portal.</p>}

        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button onClick={() => startCategory(category)} className="btn-secondary inline-flex items-center justify-center space-x-2">
            <RotateCcw className="h-4 w-4" />
            <span>Retry this category</span>
          </button>
          <button onClick={() => setCategory(null)} className="btn-primary inline-flex items-center justify-center space-x-2">
            <span>Choose another category</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-16">
        <p className="text-slate-400">No free questions available in this category right now.</p>
        <button onClick={() => setCategory(null)} className="btn-secondary">Choose another category</button>
      </div>
    );
  }

  const selected = answers[currentQuestion.id];
  const correctNorm = normalize(currentQuestion.correctOption);
  const isCorrect = isChecked && correctNorm !== '' && normalize(selected) === correctNorm;
  const isLastQuestion = currentIndex === answerable.length - 1;
  const isUrgent = timeLeft <= 60;

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
        <span>{category} · Question {currentIndex + 1} / {answerable.length}</span>
        <div className="flex items-center space-x-4">
          {lockedCount > 0 && (
            <span className="hidden sm:flex items-center space-x-1 text-slate-600">
              <Lock className="h-3 w-3" /><span>{lockedCount} premium questions hidden</span>
            </span>
          )}
          <span className={`flex items-center space-x-1.5 font-semibold ${isUrgent ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} title="Time remaining for the whole exam">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatTime(timeLeft)}</span>
          </span>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / answerable.length) * 100}%` }} />
      </div>

      <div className="glass-card rounded-2xl p-7 space-y-6">
        <h2 className="font-display text-xl font-bold text-white leading-relaxed">{currentQuestion.questionText}</h2>
        <div className="space-y-2.5">
          {(currentQuestion.options || []).map((opt, i) => {
            const isSelected = selected === opt;
            const isRightAnswer = isChecked && correctNorm !== '' && normalize(opt) === correctNorm;
            const isWrongPick = isChecked && isSelected && !isRightAnswer;

            let stateClasses = 'border-white/8 bg-white/3 text-slate-300 hover:border-white/20';
            if (isRightAnswer) {
              stateClasses = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200';
            } else if (isWrongPick) {
              stateClasses = 'border-red-500/60 bg-red-500/10 text-red-200';
            } else if (isChecked) {
              stateClasses = 'border-white/6 bg-white/3 text-slate-500';
            } else if (isSelected) {
              stateClasses = 'border-blue-500/60 bg-blue-500/10 text-white';
            }

            return (
              <button
                key={i}
                onClick={() => selectOption(opt)}
                disabled={isChecked}
                aria-pressed={isSelected}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition flex items-center justify-between gap-3 ${stateClasses} ${isChecked ? 'cursor-default' : ''}`}
              >
                <span>{opt}</span>
                {isRightAnswer && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                {isWrongPick && <XCircle className="h-4 w-4 text-red-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {isChecked && (
          <div className={`rounded-xl p-4 text-sm space-y-1.5 border ${isCorrect ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-orange-500/8 border-orange-500/20'}`}>
            <p className={`font-semibold flex items-center space-x-1.5 ${isCorrect ? 'text-emerald-300' : 'text-orange-300'}`}>
              {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <span>{isCorrect ? 'Correct!' : selected ? 'Not quite — see the correct answer above.' : "No answer was selected."}</span>
            </p>
            {currentQuestion.explanation && (
              <p className="text-slate-400 leading-relaxed">{currentQuestion.explanation}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end">
        {!isChecked ? (
          <button
            onClick={checkAnswer}
            disabled={!selected}
            className="btn-primary text-sm px-6 py-2.5 inline-flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Check Answer</span>
          </button>
        ) : isLastQuestion ? (
          <button onClick={finishQuiz} className="btn-primary text-sm px-6 py-2.5 inline-flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4" /><span>See Results</span>
          </button>
        ) : (
          <button onClick={goToNext} className="btn-primary text-sm px-6 py-2.5 inline-flex items-center space-x-1.5">
            <span>Next</span><ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {lockedCount > 0 && (
        <p className="text-center text-xs text-slate-500">
          <Link to="/pricing" className="text-blue-400 hover:underline">Upgrade to Premium</Link> to unlock {lockedCount} more questions in this category.
        </p>
      )}
    </div>
  );
}

export default PracticeExam;