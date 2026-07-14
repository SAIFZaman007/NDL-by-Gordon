import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, ShieldCheck } from 'lucide-react';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';

function Pricing({ openLoginModal }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState('');
  const { isAuthenticated, isPremium } = useAuth();

  useEffect(() => {
    apiClient.get('/subscriptions')
      .then(res => {
        setPlans(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handlePlanClick = async (plan) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (plan.planType === 'free') {
      window.location.href = '/portal';
      return;
    }
    if (isPremium) return; // already premium — button is disabled below

    setCheckoutError('');
    setCheckoutPlan(plan.planType);
    try {
      const res = await apiClient.post('/payments/create-checkout-session', {
        plan_type: plan.planType,
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: `${window.location.origin}/payment/cancel`,
      });
      window.location.href = res.data.checkout_url;
    } catch (err) {
      setCheckoutError(err.response?.data?.detail || 'Could not start checkout. Please try again.');
      setCheckoutPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16 animate-pulse">
        <div className="space-y-4">
          <div className="h-8 bg-slate-900 w-24 mx-auto rounded-full" />
          <div className="h-12 bg-slate-900 w-96 mx-auto rounded-2xl" />
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card rounded-3xl h-96 bg-slate-900/50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-4 mb-16">
        <span className="badge badge-blue mx-auto">Pricing</span>
        <h1 className="font-display text-5xl font-extrabold text-white">Simple, Transparent Pricing</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">
          Start free. Upgrade when you're ready to unlock all Cisco certification content.
        </p>
        {isAuthenticated && isPremium && (
          <div className="inline-flex items-center space-x-2 badge badge-green !text-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>You're on Premium — enjoy full access!</span>
          </div>
        )}
        {checkoutError && (
          <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-xl">
            {checkoutError}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => {
          const isCurrentPlan = isAuthenticated && ((plan.planType === 'free' && !isPremium) || (plan.planType !== 'free' && isPremium));
          return (
            <div
              key={i}
              className={`glass-card rounded-3xl p-8 flex flex-col justify-between border relative ${
                plan.featured
                  ? 'border-blue-500/40 ring-1 ring-blue-500/40'
                  : 'border-white/10'
              }`}
            >
              {plan.badge && (
                <div className={`absolute -top-3 right-6 badge ${plan.featured ? 'badge-blue' : 'badge-green'}`}>
                  {plan.badge}
                </div>
              )}
              <div className="space-y-6">
                <div className="space-y-1">
                  <h2 className={`font-display text-xl font-bold ${plan.featured ? 'text-blue-400' : 'text-white'}`}>{plan.name}</h2>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="font-display text-5xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-500 text-sm">
                    {plan.price === 0 ? 'forever' : `/${plan.billingPeriod}`}
                  </span>
                </div>
                <ul className="space-y-3">
                  {(plan.features || []).map((f, j) => (
                    <li key={j} className="flex items-center space-x-3 text-sm text-slate-300">
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => handlePlanClick(plan)}
                disabled={isCurrentPlan || checkoutPlan === plan.planType}
                className={`mt-8 w-full py-3.5 rounded-2xl font-bold text-sm transition disabled:opacity-60 disabled:cursor-not-allowed ${plan.featured ? 'btn-primary' : 'btn-secondary'}`}
              >
                {checkoutPlan === plan.planType ? 'Redirecting…' : isCurrentPlan ? 'Current Plan' : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-12 text-sm text-slate-500">
        <p>All plans include a 7-day refund guarantee. Questions? <Link to="/contact" className="text-blue-400 hover:underline">Contact support</Link></p>
      </div>
    </div>
  );
}

export default Pricing;
