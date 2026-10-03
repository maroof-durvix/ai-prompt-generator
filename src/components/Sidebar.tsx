'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Plus,
  History,
  Info,
  HelpCircle,
  Tag,
  PanelLeft,
  ChevronRight,
  Settings,
  BookOpen,
  LogIn,
  LogOut,
  Shield,
  Lock
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

interface SidebarProps {
  onNewPrompt?: () => void;
  activeCategoryId?: number;
  onCategorySelect?: (id: number) => void;
  categories?: { id: number; name: string }[];
  onCollapseChange?: (collapsed: boolean) => void;
}

const navLinks = [
  { href: '/library', label: 'Profession Library', icon: BookOpen },
  { href: '/how-it-works', label: 'How It Works', icon: HelpCircle },
  { href: '/about', label: 'About', icon: Info },
  { href: '/pricing', label: 'Pricing', icon: Tag },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onNewPrompt, activeCategoryId, onCategorySelect, categories = [], onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, profile, loginWithGoogle, logout } = useAuth();

  const [isDark, setIsDark] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [credits, setCredits] = useState(3);

  // Sync plan and credits status
  useEffect(() => {
    const syncCredits = () => {
      if (user && profile) {
        setIsPremium(profile.plan !== 'free');
        setCredits(profile.credits !== undefined ? profile.credits : 3);
      } else if (typeof window !== 'undefined') {
        const plan = localStorage.getItem('yp-plan');
        setIsPremium(plan !== null && plan !== 'free');
        const savedCredits = localStorage.getItem('yp-free-credits');
        setCredits(savedCredits !== null ? Number(savedCredits) : 3);
      }
    };

    syncCredits();
    window.addEventListener('yp-credits-changed', syncCredits);
    // Also listen to theme or updates that might affect plan status
    window.addEventListener('yp-theme-changed', syncCredits);
    
    return () => {
      window.removeEventListener('yp-credits-changed', syncCredits);
      window.removeEventListener('yp-theme-changed', syncCredits);
    };
  }, [user, profile]);

  // Load saved theme on mount and keep sync
  useEffect(() => {
    const syncTheme = () => {
      const saved = localStorage.getItem('yp-theme') || 'system';
      if (saved === 'light') {
        setIsDark(false);
      } else if (saved === 'dark') {
        setIsDark(true);
      } else {
        const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(isSystemDark);
      }
    };

    syncTheme();
    window.addEventListener('yp-theme-changed', syncTheme);
    return () => window.removeEventListener('yp-theme-changed', syncTheme);
  }, []);

  const toggleCollapse = (val: boolean) => {
    setCollapsed(val);
    onCollapseChange?.(val);
  };

  const width = collapsed ? '72px' : '232px';

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-lg transition-all"
        style={{
          background: 'rgba(14,20,26,0.9)',
          border: '1px solid rgba(26,35,50,0.8)',
          backdropFilter: 'blur(8px)',
          color: '#a1a1aa',
        }}
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <PanelLeft size={16} />
      </button>

      {/* Sidebar panel */}
      <aside
        className={`fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
        style={{
          width: mobileOpen ? '232px' : width,
          background: 'rgba(7,7,8,0.98)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo + collapse button */}
        <div
          className="flex items-center justify-between px-4 h-16 border-b shrink-0"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          {/* Logo — hide text when collapsed */}
          <Link href="/" className="flex items-center gap-2.5 group overflow-hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #d5b279, #ecd2a5)', boxShadow: '0 0 12px rgba(213,178,121,0.3)' }}
            >
              <span className="text-sm font-black" style={{ color: '#070708' }}>Y</span>
            </div>
            {!collapsed && (
              <span className="text-sm font-bold tracking-tight whitespace-nowrap overflow-hidden text-zinc-100">
                yours<span style={{ color: '#d5b279' }}>prompt</span>
                <span className="text-zinc-500 font-normal">.com</span>
              </span>
            )}
          </Link>

          {/* Collapse toggle — desktop only */}
          <button
            className="hidden md:flex items-center justify-center w-7 h-7 rounded-md transition-all hover:bg-white/5 shrink-0"
            style={{ color: '#52525b' }}
            onClick={() => toggleCollapse(!collapsed)}
            aria-label="Toggle sidebar"
          >
            <PanelLeft size={15} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* New Prompt button */}
        <div className="px-3 py-3 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <button
            onClick={() => { onNewPrompt?.(); setMobileOpen(false); }}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90 group"
            style={{
              background: 'linear-gradient(135deg, rgba(213,178,121,0.15), rgba(236,210,165,0.1))',
              border: '1px solid rgba(213,178,121,0.2)',
              color: '#d5b279',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            title={collapsed ? 'New Prompt' : undefined}
          >
            <Plus size={16} className="shrink-0" />
            {!collapsed && <span>New Prompt</span>}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {!collapsed && (
            <div className="px-2 pt-1 pb-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600 flex items-center gap-1.5">
                <History size={10} /> Pages
              </span>
            </div>
          )}
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs transition-all"
                style={{
                  background: isActive ? 'rgba(213,178,121,0.08)' : 'transparent',
                  color: isActive ? '#d5b279' : '#71717a',
                  fontWeight: isActive ? 500 : 400,
                  justifyContent: collapsed ? 'center' : 'flex-start',
                }}
                title={collapsed ? label : undefined}
                onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#a1a1aa'; }}
                onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.color = '#71717a'; }}
              >
                <Icon size={15} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
                {!collapsed && isActive && <ChevronRight size={12} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Credits Panel */}
        <div className="px-3 py-3 border-t shrink-0" style={{ borderColor: 'var(--sidebar-border)' }}>
          {isPremium ? (
            <div className="p-3 rounded-xl bg-accent-teal/5 border border-accent-teal/10 flex flex-col gap-1">
              <div className="flex items-center gap-1 text-[10px] font-bold text-accent-teal uppercase tracking-wider">
                <Shield size={11} /> Premium Access
              </div>
              {!collapsed && (
                <span className="text-[11px] font-medium text-zinc-300">Unlimited Generations</span>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] flex flex-col gap-2">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                {!collapsed && <span>Credits</span>}
                <span className="text-accent-teal font-mono">{credits} / 3</span>
              </div>
              {!collapsed && (
                <>
                  <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-teal transition-all duration-300" style={{ width: `${(credits / 3) * 100}%` }} />
                  </div>
                  <Link href="/pricing" className="text-[10px] text-accent-teal hover:underline font-semibold mt-0.5 block text-center">
                    Upgrade for Unlimited
                  </Link>
                </>
              )}
              {collapsed && (
                <Link href="/pricing" title="Upgrade for Unlimited" className="flex justify-center text-zinc-500 hover:text-accent-teal transition-colors">
                  <Lock size={11} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* User Auth Section */}
        <div className="px-3 py-3 border-t shrink-0 space-y-2" style={{ borderColor: 'var(--sidebar-border)' }}>
          {user ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 px-1 py-1 overflow-hidden">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="profile" className="w-7 h-7 rounded-full shrink-0 border border-teal-500/30" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent-teal/15 text-accent-teal flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                {!collapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] font-semibold text-[color:var(--text-1)] truncate leading-tight">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <span className="text-[9px] text-[color:var(--text-3)] truncate uppercase font-bold tracking-wider mt-0.5">
                      {profile?.plan ? `${profile.plan} Plan` : 'Free Tier'}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-xs font-semibold hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                style={{ color: 'var(--text-secondary)' }}
                title={collapsed ? 'Log Out' : undefined}
              >
                <LogOut size={13} />
                {!collapsed && <span>Log Out</span>}
              </button>
            </div>
          ) : (
            <Link
              href="/register"
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-accent-teal text-bg-main hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-accent-teal/5"
              style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
              title={collapsed ? 'Sign In' : undefined}
            >
              <LogIn size={14} className="shrink-0" />
              {!collapsed && <span>Sign In</span>}
            </Link>
          )}
        </div>

        {/* Bottom — version */}
        <div
          className="px-3 py-2 border-t shrink-0"
          style={{ borderColor: 'var(--sidebar-border)' }}
        >
          {!collapsed && (
            <p className="text-[9px] px-1 text-center" style={{ color: 'var(--text-muted)' }}>YoursPrompt v1.0 • YT Automation</p>
          )}
        </div>
      </aside>
    </>
  );
}
