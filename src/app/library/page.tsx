'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Lock, ArrowLeft, Check, Sparkles, X, Filter } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import { PROFESSIONS, Profession } from '@/lib/professions';

export default function LibraryPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal Paywall states
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedLockedProf, setSelectedLockedProf] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const plan = localStorage.getItem('yp-plan');
      if (plan && plan !== 'free') {
        setIsPremium(true);
      }
    }
  }, []);

  // Filter categories
  const categories = ['All', 'Tech & Software Development', 'Design & Creative', 'Marketing & Writing', 'Business & Management', 'Healthcare & Science', 'Education & Law & Specialized'];

  // Filtered lists
  const filteredProfessions = PROFESSIONS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectProfession = (prof: Profession) => {
    if (prof.isPremium && !isPremium) {
      setSelectedLockedProf(prof.name);
      setShowPaywall(true);
      return;
    }

    // Save selected template to local storage to be picked up by the homepage
    localStorage.setItem('yp-selected-profession-template', prof.template);
    localStorage.setItem('yp-selected-profession-name', prof.name);
    
    // Redirect to homepage
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

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-1">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-3)] hover:text-[color:var(--text-1)] transition-colors">
                <ArrowLeft size={14} /> Back to App
              </Link>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--text-1)] flex items-center gap-2.5">
                <Sparkles className="text-accent-teal" size={24} />
                Profession Prompt Library
              </h1>
              <p className="text-xs text-[color:var(--text-3)]">
                Select from {PROFESSIONS.length} professions to generate highly customized prompts. Free accounts access 100 core roles.
              </p>
            </div>
            {!isPremium && (
              <Link href="/pricing" className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold bg-accent-teal text-bg-main hover:opacity-90 transition-all shadow-md shadow-accent-teal/10">
                Unlock 300+ Professions 🚀
              </Link>
            )}
          </div>

          {/* Search and Category Filters Panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search 300+ professions (e.g. Frontend Developer, Chef)..."
                className="w-full bg-bg-2 text-sm rounded-xl pl-10 pr-4 py-3 border outline-none focus:border-accent-teal transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[color:var(--text-3)]" size={16} />
            </div>

            {/* Category Filter Dropdown */}
            <div className="md:col-span-2 relative">
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full bg-bg-2 text-sm rounded-xl px-4 py-3 border outline-none appearance-none cursor-pointer focus:border-accent-teal transition-colors"
                style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
              >
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat === 'All' ? 'All Industries & Fields' : cat}</option>
                ))}
              </select>
              <Filter className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[color:var(--text-3)]" size={15} />
            </div>
          </div>

          {/* Professions Grid list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {filteredProfessions.length > 0 ? (
              filteredProfessions.map(prof => {
                const isLocked = prof.isPremium && !isPremium;
                return (
                  <button
                    key={prof.id}
                    onClick={() => handleSelectProfession(prof)}
                    className="group relative text-left p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between h-[120px]"
                    style={{
                      background: 'var(--bg-2)',
                      borderColor: 'var(--border)',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = isLocked ? 'rgba(239, 68, 68, 0.25)' : 'var(--teal)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                    }}
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[color:var(--text-3)]">{prof.category}</span>
                      <h4 className="text-sm font-semibold mt-1 text-[color:var(--text-1)] group-hover:text-accent-teal transition-colors">
                        {prof.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-[10px] text-[color:var(--text-3)]">Click to activate</span>
                      {isLocked ? (
                        <div className="flex items-center gap-1 text-[10px] text-red-400 font-medium">
                          <Lock size={10} /> Lock (Premium)
                        </div>
                      ) : (
                        <span className="text-[10px] text-accent-teal font-medium flex items-center gap-0.5">
                          <Check size={10} /> Free
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center text-sm text-[color:var(--text-3)]">
                No professions found matching "{searchQuery}" under {selectedCategory} category.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Paywall Overlay */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md p-6 md:p-8 rounded-2xl border flex flex-col items-center text-center shadow-2xl transition-all"
               style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
            
            <button onClick={() => setShowPaywall(false)}
                    className="absolute top-4 right-4 text-[color:var(--text-3)] hover:text-[color:var(--text-1)] transition-colors cursor-pointer">
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-accent-teal/10 flex items-center justify-center text-accent-teal mb-4">
              <Lock size={22} />
            </div>

            <h3 className="text-xl font-bold text-[color:var(--text-1)]">Unlock "{selectedLockedProf}" role! 🔒</h3>
            <p className="text-sm text-[color:var(--text-3)] mt-2">
              This profession profile is locked under the free tier. Purchase any plan to get immediate access to all 300+ professional templates.
            </p>

            <div className="w-full space-y-2 mt-6">
              <Link href="/pricing"
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-accent-teal text-bg-main font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent-teal/15">
                Upgrade to Premium (₹200)
              </Link>
              <button onClick={() => setShowPaywall(false)}
                      className="w-full py-2.5 rounded-xl border text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
