'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Settings,
  User,
  Database,
  Sliders,
  HelpCircle,
  ArrowLeft,
  ChevronRight,
  Shield,
  Trash2,
  Download,
  Info,
  Check,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/Sidebar';

type TabType = 'general' | 'plan' | 'data' | 'prompts';

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Settings states (persisted in localStorage)
  const [themeSetting, setThemeSetting] = useState('system'); // system, dark, light
  const [language, setLanguage] = useState('en');
  const [autoCopy, setAutoCopy] = useState(false);
  const [ctrlEnter, setCtrlEnter] = useState(true);
  const [defaultCategory, setDefaultCategory] = useState('1');
  const [isCleared, setIsCleared] = useState(false);

  // Load settings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('yp-theme') || 'system';
      setThemeSetting(savedTheme);

      const savedAutoCopy = localStorage.getItem('yp-auto-copy') === 'true';
      setAutoCopy(savedAutoCopy);

      const savedCtrlEnter = localStorage.getItem('yp-ctrl-enter') !== 'false';
      setCtrlEnter(savedCtrlEnter);

      const savedCategory = localStorage.getItem('yp-default-category') || '1';
      setDefaultCategory(savedCategory);
    }
  }, []);

  // Listen to external theme changes (like sidebar toggle)
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem('yp-theme') || 'system';
      setThemeSetting(savedTheme);
    };

    window.addEventListener('yp-theme-changed', handleThemeChange);
    return () => window.removeEventListener('yp-theme-changed', handleThemeChange);
  }, []);

  // Handle theme update
  const handleThemeUpdate = (newTheme: string) => {
    setThemeSetting(newTheme);
    localStorage.setItem('yp-theme', newTheme);

    if (newTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      // system
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', isSystemDark ? 'dark' : 'light');
    }

    // Notify other components
    window.dispatchEvent(new Event('yp-theme-changed'));
  };

  const handleToggleAutoCopy = () => {
    const next = !autoCopy;
    setAutoCopy(next);
    localStorage.setItem('yp-auto-copy', String(next));
  };

  const handleToggleCtrlEnter = () => {
    const next = !ctrlEnter;
    setCtrlEnter(next);
    localStorage.setItem('yp-ctrl-enter', String(next));
  };

  const handleDefaultCategoryChange = (val: string) => {
    setDefaultCategory(val);
    localStorage.setItem('yp-default-category', val);
  };

  const handleClearHistory = () => {
    localStorage.removeItem('yp-generated-prompts');
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 2000);
  };

  const handleExportData = () => {
    const settingsData = {
      theme: themeSetting,
      autoCopy,
      ctrlEnter,
      defaultCategory,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yoursprompt-settings.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sidebarW = sidebarCollapsed ? '72px' : '232px';

  return (
    <div className="t-bg min-h-screen text-[color:var(--text-1)] flex bg-bg-main">
      <Sidebar
        categories={[]}
        onCollapseChange={setSidebarCollapsed}
      />

      <div
        className="flex flex-col flex-1 min-h-screen transition-all duration-300 overflow-x-hidden"
        style={{ marginLeft: `var(--sidebar-shift,0px)` }}
      >
        <style>{`
          @media(min-width:768px){:root{--sidebar-shift:${sidebarW}}}
          @media(max-width:767px){:root{--sidebar-shift:0px}}
        `}</style>

        <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-5" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-3)] hover:text-[color:var(--text-1)] transition-colors">
                  <ArrowLeft size={14} /> Back to App
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--text-1)]">Settings</h1>
            </div>
            <div className="text-xs text-[color:var(--text-3)]">
              YoursPrompt v1.0
            </div>
          </div>

          {/* ChatGPT-style Settings Layout Container */}
          <div className="grid grid-cols-1 md:grid-cols-4 rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'var(--bg-2)' }}>
            
            {/* Left Tabs Column */}
            <div className="md:col-span-1 border-r p-4 space-y-1 bg-black/5 dark:bg-white/[0.01]" style={{ borderColor: 'var(--border)' }}>
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'general' ? 'bg-accent-teal/15 text-accent-teal' : 'text-[color:var(--text-2)] hover:bg-white/5'
                }`}
              >
                <Settings size={16} />
                <span>General</span>
              </button>

              <button
                onClick={() => setActiveTab('prompts')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'prompts' ? 'bg-accent-teal/15 text-accent-teal' : 'text-[color:var(--text-2)] hover:bg-white/5'
                }`}
              >
                <Sliders size={16} />
                <span>Prompt Config</span>
              </button>

              <button
                onClick={() => setActiveTab('plan')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'plan' ? 'bg-accent-teal/15 text-accent-teal' : 'text-[color:var(--text-2)] hover:bg-white/5'
                }`}
              >
                <User size={16} />
                <span>Plan & Quota</span>
              </button>

              <button
                onClick={() => setActiveTab('data')}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left cursor-pointer ${
                  activeTab === 'data' ? 'bg-accent-teal/15 text-accent-teal' : 'text-[color:var(--text-2)] hover:bg-white/5'
                }`}
              >
                <Database size={16} />
                <span>Data Controls</span>
              </button>
            </div>

            {/* Right Content Column */}
            <div className="md:col-span-3 p-6 md:p-8 min-h-[400px]">
              
              {/* TAB 1: GENERAL */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text-1)]">General Settings</h3>
                    <p className="text-xs text-[color:var(--text-3)] mt-0.5">Manage interface theme, language preferences and view details.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Theme Option */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Theme</span>
                        <p className="text-xs text-[color:var(--text-3)]">Choose light, dark, or sync with your system preferences</p>
                      </div>
                      <div className="relative">
                        <select
                          value={themeSetting}
                          onChange={(e) => handleThemeUpdate(e.target.value)}
                          className="bg-bg-3 text-sm rounded-lg px-3 py-1.5 pr-8 border select-none outline-none appearance-none cursor-pointer hover:border-accent-teal transition-colors"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                        >
                          <option value="system">System Preference</option>
                          <option value="dark">Dark Theme</option>
                          <option value="light">Light Theme</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[color:var(--text-3)]" />
                      </div>
                    </div>

                    {/* Language Option */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Interface Language</span>
                        <p className="text-xs text-[color:var(--text-3)]">Set language for navigation and alerts</p>
                      </div>
                      <div className="relative">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="bg-bg-3 text-sm rounded-lg px-3 py-1.5 pr-8 border outline-none appearance-none cursor-pointer hover:border-accent-teal transition-colors"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                        >
                          <option value="en">English (US)</option>
                          <option value="es" disabled>Español (Soon)</option>
                          <option value="fr" disabled>Français (Soon)</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[color:var(--text-3)]" />
                      </div>
                    </div>

                    {/* App Performance */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Hardware Acceleration</span>
                        <p className="text-xs text-[color:var(--text-3)]">Use GPU rendering for smoother visual animation</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-green-500/10 text-green-500 border border-green-500/20">Active</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROMPTS */}
              {activeTab === 'prompts' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text-1)]">Prompt Configuration</h3>
                    <p className="text-xs text-[color:var(--text-3)] mt-0.5">Customize generation habits and workflow triggers.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Default Category */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Default Category</span>
                        <p className="text-xs text-[color:var(--text-3)]">Selected category when starting new prompts</p>
                      </div>
                      <div className="relative">
                        <select
                          value={defaultCategory}
                          onChange={(e) => handleDefaultCategoryChange(e.target.value)}
                          className="bg-bg-3 text-sm rounded-lg px-3 py-1.5 pr-8 border outline-none appearance-none cursor-pointer hover:border-accent-teal transition-colors"
                          style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                        >
                          <option value="1">Image Generation</option>
                          <option value="2">Graphic Design</option>
                          <option value="3">Website Prompt</option>
                          <option value="4">UI/UX Prompt</option>
                          <option value="5">Marketing</option>
                          <option value="6">Content Writing</option>
                        </select>
                        <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none text-[color:var(--text-3)]" />
                      </div>
                    </div>

                    {/* Auto Copy */}
                    <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Auto-Copy on Generation</span>
                        <p className="text-xs text-[color:var(--text-3)]">Copy generated prompts to clipboard automatically</p>
                      </div>
                      <button
                        onClick={handleToggleAutoCopy}
                        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        style={{ background: autoCopy ? 'var(--teal)' : 'rgba(128,128,128,0.2)' }}
                      >
                        <span
                          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          style={{ transform: autoCopy ? 'translateX(20px)' : 'translateX(0px)' }}
                        />
                      </button>
                    </div>

                    {/* Ctrl + Enter */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Keyboard Shortcut (Ctrl+Enter)</span>
                        <p className="text-xs text-[color:var(--text-3)]">Press Ctrl+Enter keys to trigger generation immediately</p>
                      </div>
                      <button
                        onClick={handleToggleCtrlEnter}
                        className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                        style={{ background: ctrlEnter ? 'var(--teal)' : 'rgba(128,128,128,0.2)' }}
                      >
                        <span
                          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                          style={{ transform: ctrlEnter ? 'translateX(20px)' : 'translateX(0px)' }}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PLAN */}
              {activeTab === 'plan' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text-1)]">Plan & Quota</h3>
                    <p className="text-xs text-[color:var(--text-3)] mt-0.5">Manage subscription limits, bills, and options.</p>
                  </div>

                  <div className="space-y-5 pt-2">
                    {/* Current Plan visual card */}
                    <div
                      className="rounded-xl p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(15,186,158,0.06), rgba(14,165,233,0.04))',
                        borderColor: 'rgba(15,186,158,0.25)',
                      }}
                    >
                      <div className="space-y-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-accent-teal">Active Tier</span>
                        <h4 className="text-lg font-bold text-[color:var(--text-1)]">
                          {(() => {
                            const pKey = profile?.plan || 'free';
                            if (pKey === 'starter') return 'Creator Starter Plan — ₹200';
                            if (pKey === 'builder') return 'Automation Pro Plan — ₹500';
                            if (pKey === 'studio') return 'Channel Empire Plan — ₹1000';
                            return 'Free Tier';
                          })()}
                        </h4>
                        <p className="text-xs text-[color:var(--text-3)]">
                          {profile?.plan && profile.plan !== 'free' 
                            ? 'Your subscription is active. Enjoy custom templates!'
                            : 'Perfect for standard personal use and prompt generation'
                          }
                        </p>
                      </div>
                      <Link
                        href="/pricing"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-accent-teal text-bg-main hover:opacity-90 transition-all text-center"
                      >
                        Upgrade Plan
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border bg-bg-3" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs text-[color:var(--text-3)]">Quota Limit</span>
                        <div className="text-xl font-bold text-[color:var(--text-1)] mt-1">
                          {(() => {
                            const pKey = profile?.plan || 'free';
                            if (pKey === 'starter') return '6 generations';
                            if (pKey === 'builder') return '11 generations';
                            if (pKey === 'studio') return '17 generations';
                            return '3 generations';
                          })()}
                        </div>
                      </div>
                      <div className="p-4 rounded-xl border bg-bg-3" style={{ borderColor: 'var(--border)' }}>
                        <span className="text-xs text-[color:var(--text-3)]">Quota Remaining</span>
                        <div className="text-xl font-bold text-[color:var(--text-1)] mt-1">
                          {profile?.credits !== undefined ? profile.credits : 3} Left
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border flex items-start gap-3 bg-blue-500/5 text-blue-500 border-blue-500/10 text-xs">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <div>
                        Quotas reset on billing cycles. For non-subscription accounts, you can add more prompt quotas by going to the pricing layout.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATA */}
              {activeTab === 'data' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-semibold text-[color:var(--text-1)]">Data Controls</h3>
                    <p className="text-xs text-[color:var(--text-3)] mt-0.5">Export settings configuration or clear localized storage cached elements.</p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Export settings */}
                    <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Export Settings</span>
                        <p className="text-xs text-[color:var(--text-3)]">Download config data to transfer settings</p>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-white/5 active:scale-95 cursor-pointer"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                      >
                        <Download size={13} /> Export
                      </button>
                    </div>

                    {/* Clear storage cached values */}
                    <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Clear Prompt Cache</span>
                        <p className="text-xs text-[color:var(--text-3)]">Remove generated history cache from local storage</p>
                      </div>
                      <button
                        onClick={handleClearHistory}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-500 text-xs font-semibold hover:bg-red-500/10 transition-all active:scale-95 cursor-pointer"
                      >
                        {isCleared ? <Check size={13} /> : <Trash2 size={13} />}
                        {isCleared ? 'Cleared' : 'Clear Storage'}
                      </button>
                    </div>

                    {/* Delete account */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-[color:var(--text-1)]">Reset Application Details</span>
                        <p className="text-xs text-[color:var(--text-3)]">Reset application states, clean theme files, wipe out local files</p>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.clear();
                          window.location.href = '/';
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-all active:scale-95 cursor-pointer"
                      >
                        <Shield size={13} /> Hard Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
