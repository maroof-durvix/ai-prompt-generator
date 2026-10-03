'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function HowItWorksPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8 animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b pb-6" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-1">
              <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[color:var(--text-3)] hover:text-[color:var(--text-1)] transition-colors">
                <ArrowLeft size={14} /> Back to App
              </Link>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[color:var(--text-1)] flex items-center gap-2.5">
                <HelpCircle className="text-accent-teal" size={24} />
                How It Works
              </h1>
              <p className="text-xs text-[color:var(--text-3)]">
                Frictionless process for turning raw ideas into structured prompts.
              </p>
            </div>
          </div>

          {/* Hero Header */}
          <section className="space-y-4 max-w-3xl">
            <p className="text-[color:var(--text-2)] text-base md:text-lg leading-relaxed">
              We designed the process to be as frictionless as possible. You shouldn't have to learn how to write prompts; you just need to know what you want to build.
            </p>
          </section>

          {/* Steps List */}
          <section className="space-y-8 pt-4 max-w-3xl">
            <h2 className="text-xl font-medium text-[color:var(--text-1)]">The Process</h2>
            
            <div className="space-y-8">
              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-accent-teal font-semibold text-sm mb-2">1. Choose a Category</h3>
                <p className="text-[color:var(--text-2)] leading-relaxed text-xs md:text-sm">
                  Select from specialized prompt categories like Image Generation, Website Prompt, UI/UX, or Marketing. Each category is bound to formatting rules specific to its domain.
                </p>
              </div>

              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-accent-teal font-semibold text-sm mb-2">2. Describe Your Goal</h3>
                <p className="text-[color:var(--text-2)] leading-relaxed text-xs md:text-sm">
                  Write a raw, unformatted description of what you need. Don't worry about structure or keywords; just explain your core concept in plain English.
                </p>
              </div>

              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-accent-teal font-semibold text-sm mb-2">3. Structural Optimization</h3>
                <p className="text-[color:var(--text-2)] leading-relaxed text-xs md:text-sm">
                  Our engine automatically wraps your idea with pre-designed guidelines, adding necessary rules for composition, layout, demographics, and quality flags.
                </p>
              </div>

              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-accent-teal font-semibold text-sm mb-2">4. Execute</h3>
                <p className="text-[color:var(--text-2)] leading-relaxed text-xs md:text-sm">
                  Copy the formatted prompt and paste it directly into your tool of choice to receive highly professional, structured output on the first try.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
