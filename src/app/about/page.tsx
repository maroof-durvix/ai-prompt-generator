'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Info, Sparkles } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function AboutPage() {
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
                <Info className="text-accent-teal" size={24} />
                About YoursPrompt
              </h1>
              <p className="text-xs text-[color:var(--text-3)]">
                Bridging the gap between human creativity and AI execution.
              </p>
            </div>
          </div>

          {/* Hero Header */}
          <section className="space-y-4 max-w-3xl">
            <p className="text-[color:var(--text-2)] text-base md:text-lg leading-relaxed">
              We believe that the best ideas shouldn't be lost in translation. YoursPrompt was built to bridge the gap between human creativity and technical execution, providing a clean interface to structure thoughts into precise instructions.
            </p>
            <p className="text-[color:var(--text-2)] text-base md:text-lg leading-relaxed">
              Whether you are designing a brand identity, structuring a web application, or drafting marketing copy, clarity is everything. We focus on providing professional templates that enforce clean structure and visual richness without requiring you to study complex formatting methods.
            </p>
          </section>

          {/* Core Principles */}
          <section className="space-y-6 pt-4 border-t border-zinc-800/50 max-w-3xl">
            <h2 className="text-xl font-medium text-[color:var(--text-1)]">Our Principles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-zinc-100 font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent-teal" /> Precision
                </h3>
                <p className="text-[color:var(--text-3)] leading-relaxed text-xs">
                  Every category relies on carefully formulated structures that guide the output toward highly-polished and professional results.
                </p>
              </div>

              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-zinc-100 font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent-teal" /> Simplicity
                </h3>
                <p className="text-[color:var(--text-3)] leading-relaxed text-xs">
                  No complex configurations. State your basic idea, and the optimizer formats the ideal structure instantly in the background.
                </p>
              </div>

              <div className="p-5 rounded-2xl border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <h3 className="text-zinc-100 font-semibold mb-2 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-accent-teal" /> Privacy
                </h3>
                <p className="text-[color:var(--text-3)] leading-relaxed text-xs">
                  Built with respect for your workflow. No invasive tracking, just a straightforward tool that stays out of your way.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
