import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function PaymentResult({ status }) {
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();
  const [state, setState] = useState(status === 'cancel' ? 'cancelled' : 'verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    if (status !== 'success') return;
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setState('error');
      setError('Missing checkout session reference.');
      return;
    }
    apiClient.post('/payments/verify-session', { session_id: sessionId })
      .then(async () => {
        await refreshUser().catch(() => {});
        setState('success');
      })
      .catch(err => {
        setState('error');
        setError(err.response?.data?.detail || 'We could not verify this payment.');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (state === 'verifying') {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-5">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin mx-auto" />
        <p className="text-slate-400">Confirming your payment…</p>
      </div>
    );
  }

  if (state === 'cancelled') {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
          <XCircle className="h-7 w-7 text-slate-500" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Checkout Cancelled</h1>
        <p className="text-slate-400">No charge was made. You can upgrade anytime.</p>
        <Link to="/pricing" className="btn-primary inline-flex items-center space-x-2">
          <span>Back to Pricing</span>
        </Link>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="max-w-md mx-auto text-center py-24 space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/25 flex items-center justify-center mx-auto">
          <XCircle className="h-7 w-7 text-red-400" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Something went wrong</h1>
        <p className="text-slate-400">{error}</p>
        <Link to="/pricing" className="btn-primary inline-flex items-center space-x-2">
          <span>Back to Pricing</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto text-center py-24 space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-7 w-7 text-emerald-400" />
      </div>
      <h1 className="font-display text-2xl font-bold text-white">You're Premium!</h1>
      <p className="text-slate-400">Every lesson and every practice question is now unlocked.</p>
      <Link to="/portal" className="btn-primary inline-flex items-center space-x-2">
        <span>Go to My Portal</span>
      </Link>
    </div>
  );
}

export default PaymentResult;
