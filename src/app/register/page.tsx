'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, Globe, Apple, ShieldCheck, Check } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

export default function RegisterPage() {
  const { loginWithGoogle } = useAuth();
  
  // Tab states: 'email' | 'phone' | 'google' | 'apple'
  const [activeMethod, setActiveMethod] = useState<'email' | 'phone' | 'google' | 'apple'>('email');
  
  // Input fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Onboarding wizard states
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({});

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setMessage(null);
    try {
      // Simulate Firebase account creation / backend registration
      await new Promise(resolve => setTimeout(resolve, 1200));
      localStorage.setItem('yp-plan', 'free');
      localStorage.setItem('yp-free-credits', '3');
      setShowOnboarding(true);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create email account.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;
    setLoading(true);
    setMessage(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      if (!otpSent) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'Verification code sent to your phone!' });
      } else {
        if (!otpCode) return;
        localStorage.setItem('yp-plan', 'free');
        localStorage.setItem('yp-free-credits', '3');
        setShowOnboarding(true);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Failed to verify phone number.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'apple') => {
    setLoading(true);
    setMessage(null);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
        setShowOnboarding(true);
      } else {
        // Apple Simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('yp-plan', 'free');
        localStorage.setItem('yp-free-credits', '3');
        setShowOnboarding(true);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: `Failed to authenticate with ${provider}.` });
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingNext = () => {
    if (onboardingStep === 0) {
      if (!onboardingAnswers.name?.trim() || !onboardingAnswers.workArea) return;
    } else if (onboardingStep === 1) {
      if (!onboardingAnswers.context) return;
    } else if (onboardingStep === 2) {
      if (!onboardingAnswers.valueNeeds || !onboardingAnswers.referredBy) return;
    }

    if (onboardingStep < 2) {
      setOnboardingStep(prev => prev + 1);
    } else {
      localStorage.setItem('yp-onboarded', 'true');
      localStorage.setItem('yp-user-name', onboardingAnswers.name || '');
      localStorage.setItem('yp-user-role', onboardingAnswers.workArea || '');
      localStorage.setItem('yp-user-title', onboardingAnswers.roleTitle || '');
      localStorage.setItem('yp-user-goal', onboardingAnswers.context || '');
      localStorage.setItem('yp-user-needs', onboardingAnswers.valueNeeds || '');
      localStorage.setItem('yp-user-referred', onboardingAnswers.referredBy || '');
      
      window.location.href = '/';
    }
  };

  return (
    <div className="bg-[#060a0d] min-h-screen text-zinc-100 flex flex-col justify-between selection:bg-accent-teal/30 selection:text-accent-teal relative">
      
      {/* Background aurora gradient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent-teal/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

      {/* Header back bar */}
      <header className="px-6 py-6 max-w-6xl mx-auto w-full flex justify-between items-center z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Home
        </Link>
        <span className="text-xs text-zinc-600 font-bold uppercase tracking-wider">YoursPrompt Portal</span>
      </header>

      {/* Main card */}
      <main className="flex-grow flex items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-md p-6 md:p-8 rounded-3xl border border-white/[0.06] shadow-2xl transition-all relative overflow-hidden"
             style={{ background: 'rgba(14,20,26,0.85)', backdropFilter: 'blur(16px)' }}>
          
          {!showOnboarding ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Create your account</h1>
                <p className="text-xs text-zinc-500 mt-1">Get started generating elite AI instructions</p>
              </div>

              {/* Quick switcher buttons */}
              <div className="grid grid-cols-4 gap-2 mb-6 p-1 rounded-xl bg-black/25 border border-white/[0.04]">
                {[
                  { id: 'email', icon: Mail, label: 'Email' },
                  { id: 'phone', icon: Phone, label: 'Phone' },
                  { id: 'google', icon: Globe, label: 'Google' },
                  { id: 'apple', icon: Apple, label: 'Apple' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => { setActiveMethod(item.id as any); setMessage(null); }}
                    className={`py-2 px-1.5 rounded-lg flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      activeMethod === item.id 
                        ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/20 font-bold' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    <item.icon size={16} />
                    <span className="text-[9px] uppercase tracking-wider font-semibold">{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Messages */}
              {message && (
                <div className={`p-3 rounded-xl text-xs mb-4 text-center font-medium border ${
                  message.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              {/* Method panels */}
              {activeMethod === 'email' && (
                <form onSubmit={handleEmailSignup} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full bg-black/20 rounded-xl border border-white/[0.06] px-3.5 py-2.5 text-sm outline-none focus:border-accent-teal transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Choose a strong password"
                      className="w-full bg-black/20 rounded-xl border border-white/[0.06] px-3.5 py-2.5 text-sm outline-none focus:border-accent-teal transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-teal text-bg-main font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-accent-teal/10"
                  >
                    {loading ? 'Creating account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {activeMethod === 'phone' && (
                <form onSubmit={handlePhoneSignup} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-zinc-400">Phone Number</label>
                    <input
                      type="tel"
                      required
                      disabled={otpSent}
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +923001234567"
                      className="w-full bg-black/20 rounded-xl border border-white/[0.06] px-3.5 py-2.5 text-sm outline-none focus:border-accent-teal transition-colors disabled:opacity-50"
                    />
                  </div>

                  {otpSent && (
                    <div className="space-y-1 animate-fade-in">
                      <label className="text-xs font-semibold text-zinc-400">Verification OTP Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        placeholder="Enter 6-digit OTP code"
                        className="w-full bg-black/20 rounded-xl border border-white/[0.06] px-3.5 py-2.5 text-sm outline-none focus:border-accent-teal transition-colors"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-accent-teal text-bg-main font-bold text-sm transition-all hover:opacity-90 disabled:opacity-40 flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-accent-teal/10"
                  >
                    {loading ? 'Loading...' : otpSent ? 'Verify & Register' : 'Send Verification Code'}
                  </button>
                </form>
              )}

              {activeMethod === 'google' && (
                <div className="space-y-4 py-4 text-center">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Connect your account immediately using Google. Fast, secure, and passwordless authentication.
                  </p>
                  <button
                    onClick={() => handleOAuthLogin('google')}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-white text-zinc-900 font-bold text-sm transition-all hover:bg-zinc-200 disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Globe size={16} />
                    Continue with Google
                  </button>
                </div>
              )}

              {activeMethod === 'apple' && (
                <div className="space-y-4 py-4 text-center">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Connect secure and private access using Apple ID. Keep your email hidden automatically.
                  </p>
                  <button
                    onClick={() => handleOAuthLogin('apple')}
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-zinc-800 text-white hover:bg-zinc-700 transition-colors border border-white/[0.04] font-bold text-sm disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Apple size={16} />
                    Continue with Apple
                  </button>
                </div>
              )}

              {/* Secure disclaimer */}
              <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-zinc-600">
                <ShieldCheck size={12} />
                <span>Secure passwordless authorization powered by Firebase</span>
              </div>
            </>
          ) : (
            /* Onboarding Wizard inside Register Card */
            <div className="flex flex-col h-[420px] justify-between">
              <div>
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-accent-teal">
                    Step {onboardingStep + 1} of 3
                  </span>
                  <span className="text-xs text-zinc-400 font-semibold">
                    {onboardingStep === 0 ? 'Who you are' : onboardingStep === 1 ? 'Your AI context' : 'What matters to you'}
                  </span>
                </div>
                
                {/* Progress Line */}
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-5">
                  <div className="h-full bg-accent-teal transition-all duration-300" style={{ width: `${((onboardingStep + 1) / 3) * 100}%` }} />
                </div>
              </div>

              {/* Steps Body */}
              <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4">
                {onboardingStep === 0 && (
                  <div className="space-y-3.5">
                    <div>
                      <h3 className="text-base font-bold text-zinc-100">Who you are</h3>
                      <p className="text-xs text-zinc-500">Let's get to know you, partner</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">What's your name? <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        value={onboardingAnswers.name || ''}
                        onChange={e => setOnboardingAnswers(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Bilal Khan"
                        className="w-full bg-black/30 rounded-xl border border-white/[0.08] px-3.5 py-2 text-sm outline-none focus:border-accent-teal text-zinc-100"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">What area do you work in? <span className="text-red-500">*</span></label>
                      <select
                        value={onboardingAnswers.workArea || ''}
                        onChange={e => setOnboardingAnswers(prev => ({ ...prev, workArea: e.target.value }))}
                        className="w-full bg-black/30 rounded-xl border border-white/[0.08] px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal text-zinc-100"
                      >
                        <option value="">Select your work area</option>
                        <option value="Sales / Business Development">Sales / Business Development</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Founder / Executive">Founder / Executive</option>
                        <option value="Product Management">Product Management</option>
                        <option value="Operations">Operations</option>
                        <option value="Customer Success / Support">Customer Success / Support</option>
                        <option value="Engineering / Technical">Engineering / Technical</option>
                        <option value="Data / Analytics">Data / Analytics</option>
                        <option value="Finance / Accounting">Finance / Accounting</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">What's your role title?</label>
                      <input
                        type="text"
                        value={onboardingAnswers.roleTitle || ''}
                        onChange={e => setOnboardingAnswers(prev => ({ ...prev, roleTitle: e.target.value }))}
                        placeholder="e.g. Chief Prompt Officer"
                        className="w-full bg-black/30 rounded-xl border border-white/[0.08] px-3.5 py-2 text-sm outline-none focus:border-accent-teal text-zinc-100"
                      />
                    </div>
                  </div>
                )}

                {onboardingStep === 1 && (
                  <div className="space-y-3.5">
                    <div>
                      <h3 className="text-base font-bold text-zinc-100">Your AI context</h3>
                      <p className="text-xs text-zinc-500">How do you wrangle AI at work?</p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">When it comes to AI at work, which best describes you? <span className="text-red-500">*</span></label>
                      <select
                        value={onboardingAnswers.context || ''}
                        onChange={e => setOnboardingAnswers(prev => ({ ...prev, context: e.target.value }))}
                        className="w-full bg-black/30 rounded-xl border border-white/[0.08] px-3 py-2.5 text-sm outline-none cursor-pointer focus:border-accent-teal text-zinc-100"
                      >
                        <option value="">Select your AI context</option>
                        <option value="I mostly use AI on my own">I mostly use AI on my own</option>
                        <option value="I'm part of a team that uses AI">I'm part of a team that uses AI</option>
                        <option value="I help train or guide others on AI">I help train or guide others on AI</option>
                        <option value="I manage people who use AI">I manage people who use AI</option>
                      </select>
                    </div>
                  </div>
                )}

                {onboardingStep === 2 && (
                  <div className="space-y-3.5">
                    <div>
                      <h3 className="text-base font-bold text-zinc-100">What matters to you</h3>
                      <p className="text-xs text-zinc-500">Help us customize your workflow</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-zinc-400">What would make YoursPrompt 10x more valuable? <span className="text-red-500">*</span></label>
                      <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                        {[
                          "If it worked directly inside ChatGPT/Claude",
                          "If it automatically improved my prompts as I work",
                          "If I could save what works and reuse it",
                          "If it remembered my preferences",
                          "None of these — I'm just exploring"
                        ].map((item, idx) => {
                          const isChecked = onboardingAnswers.valueNeeds === item;
                          return (
                            <label key={idx} className="flex items-start gap-2 p-2 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors border-white/[0.04]"
                                   style={{ borderColor: isChecked ? 'var(--teal)' : undefined }}>
                              <input
                                type="radio"
                                name="valueNeeds"
                                checked={isChecked}
                                onChange={() => setOnboardingAnswers(prev => ({ ...prev, valueNeeds: item }))}
                                className="mt-0.5 accent-teal shrink-0"
                              />
                              <span className="text-[11px] text-zinc-300 leading-tight">{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-zinc-400">How did you hear about us? <span className="text-red-500">*</span></label>
                      <select
                        value={onboardingAnswers.referredBy || ''}
                        onChange={e => setOnboardingAnswers(prev => ({ ...prev, referredBy: e.target.value }))}
                        className="w-full bg-black/30 rounded-xl border border-white/[0.08] px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal text-zinc-100"
                      >
                        <option value="">Select source</option>
                        <option value="Google Search">Google Search</option>
                        <option value="Twitter / X">Twitter / X</option>
                        <option value="YouTube">YouTube</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Friend Referral">Friend Referral</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Onboarding Actions */}
              <div className="flex items-center justify-between border-t border-white/[0.06] pt-3.5 mt-2">
                <button
                  disabled={onboardingStep === 0}
                  onClick={() => setOnboardingStep(prev => Math.max(0, prev - 1))}
                  className="px-4 py-2 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Back
                </button>
                <button
                  onClick={handleOnboardingNext}
                  disabled={
                    onboardingStep === 0 ? (!onboardingAnswers.name?.trim() || !onboardingAnswers.workArea) :
                    onboardingStep === 1 ? !onboardingAnswers.context :
                    (!onboardingAnswers.valueNeeds || !onboardingAnswers.referredBy)
                  }
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent-teal text-bg-main hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {onboardingStep === 2 ? 'Finish Setup' : 'Continue'}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Footer support */}
      <footer className="py-6 flex items-center justify-center gap-4 text-[10px] text-zinc-700 z-10">
        <span>&copy; {new Date().getFullYear()} YoursPrompt Inc.</span>
        <span>•</span>
        <a href="mailto:support@yoursprompt.com" className="hover:text-zinc-500 transition-colors">Get Support</a>
      </footer>

    </div>
  );
}

