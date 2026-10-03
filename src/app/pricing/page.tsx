'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, Tag } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';

const plans = [
  {
    id: 'starter',
    name: 'Creator Starter',
    price: '200',
    quotas: 6,
    description: 'Perfect for individual creators starting their YouTube channel.',
    features: [
      '6 video scripts or blueprint designs',
      'All YT automation tools',
      'Copy optimized output',
      'Standard support',
    ],
    highlighted: false,
    cta: 'Get Started',
  },
  {
    id: 'builder',
    name: 'Automation Pro',
    price: '500',
    quotas: 11,
    description: 'Ideal for serious automation creators managing 1-2 channels.',
    features: [
      '11 video scripts or blueprint designs',
      'All YT automation tools',
      'Unlimited professions library',
      'Saved history logs',
      'Priority Support',
    ],
    highlighted: true,
    cta: 'Select Pro',
  },
  {
    id: 'studio',
    name: 'Channel Empire',
    price: '1000',
    quotas: 17,
    description: 'Built for automation agencies and bulk channels scaling fast.',
    features: [
      '17 video scripts or blueprints',
      'Access to all tools & roles',
      'Export files (.json & .txt)',
      'Direct account manager access',
      'Dedicated API integration',
    ],
    highlighted: false,
    cta: 'Go Empire',
  },
];

export default function PricingPage() {
  const { user, profile, updateProfile } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handlePurchase = async (planId: string) => {
    const quotaMap: Record<string, number> = { starter: 6, builder: 11, studio: 17 };
    const quotas = quotaMap[planId] || 6;

    if (user) {
      await updateProfile({ plan: planId, credits: quotas });
    } else {
      localStorage.setItem('yp-plan', planId);
      localStorage.setItem('yp-free-credits', String(quotas));
    }
    alert(`Success! You have purchased the plan. Redirecting to YoursPrompt...`);
    window.location.href = '/';
  };

  const sidebarW = sidebarCollapsed ? '72px' : '232px';

  return (
    <div className="t-bg min-h-screen text-[color:var(--text-1)] flex bg-bg-main relative">
      <Sidebar
        categories={[]}
        onCollapseChange={setSidebarCollapsed}
      />

      <div className="flex flex-col flex-1 min-h-screen transition-all duration-300 overflow-x-hidden"
           style={{ marginLeft: `var(--sidebar-shift,0px)` }}>
        <style>{`@media(min-width:768px){:root{--sidebar-shift:${sidebarW}}}@media(max-width:767px){:root{--sidebar-shift:0px}}`}</style>

        <main className="flex-grow max-w-6xl mx-auto w-full px-4 md:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-1">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-3)] hover:text-[color:var(--text-1)] transition-colors">
                <ArrowLeft size={14} /> Back to App
              </Link>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--text-1)] flex items-center gap-2.5">
                <Tag className="text-accent-teal" size={24} />
                Simple, Honest Pricing
              </h1>
              <p className="text-xs text-[color:var(--text-3)]">
                Pick the plan that fits your workflow. One-time purchases with straightforward access.
              </p>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="relative flex flex-col rounded-2xl p-6 md:p-8 transition-all duration-300"
                style={{
                  background: plan.highlighted
                    ? 'rgba(213,178,121,0.06)'
                    : 'var(--bg-2)',
                  border: plan.highlighted
                    ? '1px solid rgba(213,178,121,0.35)'
                    : '1px solid var(--border)',
                }}
              >
                {/* Popular badge */}
                {plan.highlighted && (
                  <div
                    className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest"
                    style={{
                      background: 'linear-gradient(135deg, #d5b279, #ecd2a5)',
                      color: '#070708',
                    }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Plan name & price */}
                <div className="mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[color:var(--text-3)] mb-3 block">
                    {plan.name}
                  </span>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-[color:var(--text-3)] text-xs">Rs.</span>
                    <span className="text-3xl md:text-4xl font-bold text-[color:var(--text-1)]">{plan.price}</span>
                  </div>
                  <p className="text-xs text-[color:var(--text-3)] leading-relaxed">{plan.description}</p>
                </div>

                {/* Quota highlight */}
                <div
                  className="rounded-xl px-4 py-2.5 mb-6 text-xs font-semibold text-center"
                  style={{
                    background: plan.highlighted
                      ? 'rgba(213,178,121,0.1)'
                      : 'rgba(255,255,255,0.03)',
                    color: plan.highlighted ? '#d5b279' : 'var(--text-2)',
                  }}
                >
                  {plan.quotas} prompt generations included
                </div>

                {/* Features list */}
                <ul className="space-y-3 flex-grow mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs text-[color:var(--text-2)]">
                      <Check
                        size={14}
                        className="mt-0.5 shrink-0"
                        style={{ color: plan.highlighted ? '#d5b279' : '#52525b' }}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  className="w-full py-3 rounded-xl text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                  style={
                    plan.highlighted
                      ? {
                          background: 'linear-gradient(135deg, #d5b279, #ecd2a5)',
                          color: '#070708',
                          boxShadow: '0 0 20px rgba(213,178,121,0.2)',
                        }
                      : {
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          color: 'var(--text-2)',
                        }
                  }
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </section>

          {/* Footer note */}
          <section className="border-t pt-8 max-w-2xl" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs text-[color:var(--text-3)] leading-relaxed">
              All plans are one-time purchases. Quotas are valid for 30 days from the date of purchase. For custom or team access, reach out directly.
            </p>
          </section>

        </main>
      </div>
    </div>
  );
}
