'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, ChevronDown, ArrowUp, MessageSquare, Lock, X, Sparkles, Video } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { PROFESSIONS } from '@/lib/professions';

interface Category {
  id: number; name: string; slug: string;
  description: string; template: string; placeholder: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 1, name: 'Image Generation', slug: 'image-generation', description: 'Create high-quality images.', template: 'Generate a highly detailed, professional visual prompt matching the description: [INPUT]. Style constraints: Render with cinematic photorealism, dynamic volumetric lighting, premium color grading, clean focal composition, high contrast detail ratios, and depth-of-field separation. Avoid artifacting, blurred boundaries, or chaotic shapes.', placeholder: 'e.g. A futuristic floating city with neon lights and flying cars, digital art style...' },
  { id: 2, name: 'Graphic Design',   slug: 'graphic-design',   description: 'Logos, banners, and posters.', template: 'Create a professional graphic design concept based on the theme: [INPUT]. Rules: Design must use balanced layouts, modern geometric alignment, professional color harmonies suitable for premium branding, legible minimalist typography hierarchy, and scalable layout formats. Specify color swatch palettes and layout placement guides.', placeholder: 'e.g. A minimalist logo for a sustainable eco-friendly clothing brand...' },
  { id: 3, name: 'Website Prompt',   slug: 'website-prompt',   description: 'Landing pages and web apps.', template: 'Design a highly polished landing page structure and visual design layout for: [INPUT]. Structure requirements: Define a captivating hero header with clear typography, primary/secondary Call-to-Action (CTA) buttons, a structured feature benefit grid, social proof or testimonial layouts, pricing comparison structures, and a footer navigation map. Incorporate modern CSS glassmorphism, precise grid spacings, and premium dark/light layout directions.', placeholder: 'e.g. A premium landing page for a fitness app with dark theme and modern UI...' },
  { id: 4, name: 'UI/UX Prompt',     slug: 'ui-ux-prompt',     description: 'Interfaces and user flows.', template: 'Create a detailed UI/UX architecture and functional design flow for: [INPUT]. Design rules: Focus on intuitive user interaction loops, consistent spacing grids (8px system), clear information hierarchies, accessible color contrasts, descriptive state animations (hovers, loaders, success checks), and clean card component architectures.', placeholder: 'e.g. A mobile app dashboard for tracking daily financial transactions...' },
  { id: 5, name: 'Marketing',        slug: 'marketing-prompt', description: 'Ads, campaigns, strategies.', template: 'Write highly persuasive, conversion-optimized marketing copy and social media campaign strategies for: [INPUT]. Structure: Draft an attention-grabbing hook statement, outline the core problem-solution mechanism, define clear benefit-focused value propositions, handle common customer objections, and write 3 variations of compelling Call-to-Action (CTA) buttons optimized for high CTR.', placeholder: 'e.g. An Instagram ad campaign promoting a new organic coffee blend...' },
  { id: 6, name: 'Content Writing',  slug: 'content-writing-prompt', description: 'Blog posts and articles.', template: 'Draft an engaging, search-optimized (SEO) outline and full article structure for: [INPUT]. Writing rules: Start with an interesting hook intro, formulate organized H2 and H3 logical heading sections, include well-reasoned evidence or examples, write with a professional and engaging tone, and wrap up with a strong concluding action summary.', placeholder: 'e.g. A guide on the benefits of remote working for tech professionals...' },
];

const SUGGESTIONS = [
  'Design a logo for a luxury watch brand',
  'Write a blog post about AI in healthcare',
  'Create a landing page for a SaaS tool',
  'Instagram ad for a new sneaker drop',
  'UI for a crypto portfolio tracker',
  'Generate an image of a cyberpunk cityscape',
];

const YT_TOOLS = [
  {
    id: 'yt-script',
    name: 'Video Scriptwriter',
    description: 'Generates high-retention video script outlines with pacing.',
    template: 'Act as an expert YouTube Scriptwriter and retention strategist. Write a highly engaging, viral video script about [INPUT]. Pacing structure:\n1. Hook: Hook the audience within the first 10 seconds using high curiosity spikes.\n2. Storytelling: Develop points with high pacing, transition cues, b-roll directions, and voiceover scripts.\n3. Retention: Keep explanations concise and visual. Limit sentences to under 15 words where possible.\n4. Call-to-Action: Organic integration of subscriber prompts in the final 30 seconds.',
    placeholder: 'e.g. 5 hidden secrets of space exploration that NASA keeps secret...'
  },
  {
    id: 'yt-ideas',
    name: 'Viral Idea Research',
    description: 'Generates highly clickable topics and audience angles.',
    template: 'Act as an expert YouTube Channel Growth strategist. Generate 5 highly clickable, trend-aligned video concept ideas based on: [INPUT]. For each video idea outline:\n- CTR Optimised Title: (High curiosity/fear/gain triggers under 55 chars)\n- Visual Thumbnail Concept: (3 contrasting colors, 1 clear focal element, no text clutter)\n- Search Intent & Retention: (Explain why this topic hooks the target audience immediately)\n- Viral Angle: (The exact hook mechanism that triggers algorithmic recommendation)',
    placeholder: 'e.g. Personal finance tips for Gen Z...'
  },
  {
    id: 'yt-thumbnails',
    name: 'Thumbnail Art Director',
    description: 'Creates optimized art prompts for Midjourney/DALL-E.',
    template: 'Act as a YouTube Thumbnail visual specialist. Generate 3 highly optimized graphic prompts for Midjourney v6 / DALL-E 3 based on: [INPUT]. Formatting rules:\n- Use high-contrast color palettes (complementary primary colors).\n- Prioritize one main focal subject showing strong expression or curiosity triggers.\n- Background elements must have depth-of-field blur (bokeh effect) to separate from the foreground.\n- Eliminate small unreadable details to make the image stand out at tiny mobile dimensions.',
    placeholder: 'e.g. Cyberpunk hacker coding on a glowing holographic interface...'
  },
  {
    id: 'yt-seo',
    name: 'SEO & Hook Metadata',
    description: 'Optimizes titles, tags, and click rates.',
    template: 'Act as an expert YouTube SEO and Metadata strategist. For a video about [INPUT], output:\n1. 5 High-CTR video titles targeting search query matches and curiosity clicks under 60 characters.\n2. Keyword-rich video description explaining the value proposition in the first 2 lines.\n3. 15 high-volume search tags sorted by relevance.\n4. Pinned comment copy containing a key discussion question to boost comment engagement.',
    placeholder: 'e.g. How to start a dropshipping store with zero investment...'
  },
  {
    id: 'yt-blueprint',
    name: 'Super Video Blueprint',
    description: 'Complete production framework in a single macro prompt.',
    template: 'Act as a YouTube Automation Producer. Create a complete, macro production blueprint for a video about [INPUT]. Formulate:\n- Storyboard outline and pacing guides.\n- Full hook script with voiceover pacing directives.\n- Video concept outline with specific b-roll/visual directions.\n- SEO and CTR visual strategies.',
    placeholder: 'e.g. The rise and fall of the Roman Empire explained simply...'
  }
];

const ONBOARDING_STEPS = [
  {
    title: "What kind of work do you do?",
    subtitle: "We will customize your prompt categories and recommendations based on your profession.",
    field: "role",
    options: [
      { label: "Designer / Creative Agency", value: "designer" },
      { label: "Developer / Software Engineer", value: "developer" },
      { label: "Marketer / Growth Strategist", value: "marketer" },
      { label: "Content Creator / Copywriter", value: "writer" },
      { label: "Business Professional / Founder", value: "business" },
      { label: "Student / Academic Researcher", value: "student" },
    ]
  },
  {
    title: "What is your primary motive or goal?",
    subtitle: "Select what you want to achieve with YoursPrompt.",
    field: "goal",
    options: [
      { label: "Generate highly photorealistic AI images", value: "images" },
      { label: "Build UI architectures and design structures", value: "code" },
      { label: "Draft high-converting ad copy and strategies", value: "copywriting" },
      { label: "Learn advanced prompt engineering guidelines", value: "learning" },
      { label: "Scale YouTube channels & content production", value: "automation" },
    ]
  },
  {
    title: "What is your main target business model or field?",
    subtitle: "This helps us optimize model compatibility percentages for your workflow.",
    field: "model",
    options: [
      { label: "YouTube Automation / Content Creator", value: "youtube" },
      { label: "SaaS Development / Web Design Agency", value: "saas" },
      { label: "Digital Marketing / E-Commerce Brand", value: "ecommerce" },
      { label: "Freelancing / Individual Consultation", value: "freelancing" },
      { label: "Personal Research & Learning Projects", value: "learning" },
    ]
  }
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [activeCategoryId, setActiveCategoryId] = useState<number>(1);
  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Workspace selection state
  const [workspace, setWorkspace] = useState<'general' | 'youtube'>('general');
  const [activeYTToolId, setActiveYTToolId] = useState<string>('yt-script');

  // Paywall & Credits States
  const [isPremium, setIsPremium] = useState(false);
  const [credits, setCredits] = useState(3);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallReason, setPaywallReason] = useState<'credits' | 'category'>('credits');

  // Active Custom Profession
  const [activeProfName, setActiveProfName] = useState<string | null>(null);
  const [activeProfTemplate, setActiveProfTemplate] = useState<string | null>(null);

  // Interactive Prompt Tuning
  const [detailLevel, setDetailLevel] = useState<'concise' | 'balanced' | 'detailed'>('balanced');
  const [tone, setTone] = useState<'professional' | 'creative' | 'technical' | 'persuasive'>('professional');

  // Onboarding Wizard States
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>({});

  // Visual feedback states
  interface Particle { id: number; x: number; y: number; dx: string; dy: string; }
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const { user, profile, updateProfile } = useAuth();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef  = useRef<HTMLDivElement>(null);
  const outputRef    = useRef<HTMLDivElement>(null);

  // Sync auth profile credits & plans
  useEffect(() => {
    if (user && profile) {
      setIsPremium(profile.plan !== 'free');
      setCredits(profile.credits !== undefined ? profile.credits : 3);
    } else if (typeof window !== 'undefined') {
      const plan = localStorage.getItem('yp-plan');
      setIsPremium(plan !== null && plan !== 'free');
      const savedCredits = localStorage.getItem('yp-free-credits');
      if (savedCredits === null) {
        localStorage.setItem('yp-free-credits', '3');
        setCredits(3);
      } else {
        setCredits(Number(savedCredits));
      }
    }
    window.dispatchEvent(new Event('yp-credits-changed'));
  }, [user, profile]);

  // Load custom configurations on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load active profession
      setActiveProfName(localStorage.getItem('yp-selected-profession-name'));
      setActiveProfTemplate(localStorage.getItem('yp-selected-profession-template'));

      // Check onboarding
      const onboarded = localStorage.getItem('yp-onboarded') === 'true';
      if (!onboarded) {
        setShowOnboarding(true);
      }
    }
  }, []);

  // Fetch updated custom categories
  useEffect(() => {
    fetch('/api/categories').then(r => r.ok ? r.json() : null).then(d => {
      if (Array.isArray(d) && d.length > 0) setCategories(d);
    }).catch(() => {});
  }, []);

  // Handle dropdown auto-close
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setCategoryDropdownOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const activeCategory = workspace === 'youtube'
    ? YT_TOOLS.find(t => t.id === activeYTToolId) || YT_TOOLS[0]
    : categories.find(c => c.id === activeCategoryId) || categories[0];

  // YT Automation Interactive Builder questions
  const [ytTopic, setYtTopic] = useState('');
  const [ytMotive, setYtMotive] = useState('');
  const [ytTone, setYtTone] = useState('engaging and energetic');
  const [ytStyle, setYtStyle] = useState('explainer');

  const handleNewPrompt = () => {
    setUserInput(''); setGeneratedPrompt(''); setActiveCategoryId(1);
    setActiveYTToolId('yt-script');
    setYtTopic(''); setYtMotive(''); setYtTone('engaging and energetic'); setYtStyle('explainer');
    localStorage.removeItem('yp-selected-profession-name');
    localStorage.removeItem('yp-selected-profession-template');
    setActiveProfName(null);
    setActiveProfTemplate(null);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleCategorySelect = (catId: number) => {
    // Intercept premium categories (3 and 4)
    if (!isPremium && (catId === 3 || catId === 4)) {
      setPaywallReason('category');
      setShowPaywall(true);
      setCategoryDropdownOpen(false);
      return;
    }
    setActiveCategoryId(catId);
    setCategoryDropdownOpen(false);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleGenerate = async () => {
    const isYtScript = workspace === 'youtube' && activeYTToolId === 'yt-script';
    const hasInput = isYtScript ? ytTopic.trim() : userInput.trim();
    if (!hasInput || isLoading) return;

    // Check credits if not premium
    if (!isPremium && credits <= 0) {
      setPaywallReason('credits');
      setShowPaywall(true);
      return;
    }

    setIsLoading(true); setGeneratedPrompt('');

    // Helper to deduct credits after successful generation
    const deductCredit = async () => {
      if (user && profile) {
        await updateProfile({ credits: Math.max(0, credits - 1) });
      } else if (!isPremium) {
        const nextCredits = Math.max(0, credits - 1);
        setCredits(nextCredits);
        localStorage.setItem('yp-free-credits', String(nextCredits));
      }
      window.dispatchEvent(new Event('yp-credits-changed'));
    };

    // If custom profession template is active, generate client-side
    if (activeProfTemplate) {
      setTimeout(async () => {
        let compiledInput = userInput.trim();
        compiledInput += `\n\n[Constraints]:\n- Detail level: ${detailLevel}\n- Output tone: ${tone}`;
        const resolved = activeProfTemplate.replace('[INPUT]', compiledInput);
        setGeneratedPrompt(resolved);
        await deductCredit();

        // Auto copy if enabled in settings
        const autoCopySetting = localStorage.getItem('yp-auto-copy') === 'true';
        if (autoCopySetting) {
          navigator.clipboard.writeText(resolved);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1500);
        }
        
        setIsLoading(false);
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }, 700);
      return;
    }

    // If YouTube Automation Workspace is active, generate client-side using YT_TOOLS templates
    if (workspace === 'youtube') {
      setTimeout(async () => {
        let compiledInput = userInput.trim();
        if (activeYTToolId === 'yt-script') {
          compiledInput = `Topic: ${ytTopic.trim() || 'General topic'}\nMotive/Goal: ${ytMotive.trim() || 'Educate and entertain'}\nTone/Pacing: ${ytTone}\nVideo Style: ${ytStyle}`;
        }
        compiledInput += `\n\n[Constraints]:\n- Detail level: ${detailLevel}\n- Output tone: ${tone}`;
        const resolved = activeCategory.template.replace('[INPUT]', compiledInput);
        setGeneratedPrompt(resolved);
        await deductCredit();

        // Auto copy if enabled in settings
        const autoCopySetting = localStorage.getItem('yp-auto-copy') === 'true';
        if (autoCopySetting) {
          navigator.clipboard.writeText(resolved);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1500);
        }
        
        setIsLoading(false);
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }, 700);
      return;
    }

    try {
      let compiledInput = userInput.trim();
      compiledInput += `\n\n[Constraints]:\n- Detail level: ${detailLevel}\n- Output tone: ${tone}`;
      const res  = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ category_id: activeCategoryId, user_input: compiledInput }) });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setGeneratedPrompt(data.generated_prompt);
        await deductCredit();

        // Auto copy if enabled in settings
        const autoCopySetting = localStorage.getItem('yp-auto-copy') === 'true';
        if (autoCopySetting) {
          navigator.clipboard.writeText(data.generated_prompt);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 1500);
        }
      } else {
        setGeneratedPrompt(data.error || 'An error occurred.');
      }
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    } catch { 
      setGeneratedPrompt('Could not connect to the backend API.'); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    });

    // Create 12 particles exploding from the click point
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;
    
    const newParticles = Array.from({ length: 12 }).map((_, i) => ({
      id: Math.random(),
      x: clickX,
      y: clickY,
      dx: `${(Math.random() - 0.5) * 80}px`,
      dy: `${(Math.random() - 0.5) * 80}px`,
    }));
    
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 600);
  };

  const handleOnboardingSelect = (value: string) => {
    const currentField = ONBOARDING_STEPS[onboardingStep].field;
    setOnboardingAnswers(prev => ({ ...prev, [currentField]: value }));
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

      if (onboardingAnswers.workArea === 'Design & Creative') {
        setActiveCategoryId(1);
      } else if (onboardingAnswers.workArea === 'Engineering / Technical') {
        setActiveCategoryId(3);
      }
      setShowOnboarding(false);
    }
  };

  const sidebarW = sidebarCollapsed ? '72px' : '232px';

  return (
    <div className="t-bg min-h-screen text-[color:var(--text-1)] flex bg-bg-main relative">
      <Sidebar
        onNewPrompt={handleNewPrompt}
        activeCategoryId={activeCategoryId}
        onCategorySelect={handleCategorySelect}
        categories={categories}
        onCollapseChange={setSidebarCollapsed}
      />

      <div className="flex flex-col flex-1 min-h-screen transition-all duration-300 overflow-x-hidden"
           style={{ marginLeft: `var(--sidebar-shift,0px)` }}>
        <style>{`@media(min-width:768px){:root{--sidebar-shift:${sidebarW}}}@media(max-width:767px){:root{--sidebar-shift:0px}}`}</style>

        <main className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-12 md:pt-[10vh] pb-24">

          {/* Headline */}
          <div className="w-full max-w-2xl text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-semibold border mb-4 t-pill cursor-pointer hover:opacity-90">
              <span>Get exclusive early pricing and access to new features</span>
              <span className="text-accent-teal font-bold">&rarr;</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2 t-text-1">
              Turn lazy prompts into{' '}
              <span className="gradient-text-animated">great ones</span>
            </h1>
            <p className="text-sm md:text-base t-text-3 font-medium">Your cheat code to AI that just works</p>
          </div>

          {/* Active Custom Profession Status */}
          {activeProfName && (
            <div className="w-full max-w-2xl mb-4 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs border bg-teal-500/10 border-teal-500/20 text-accent-teal animate-fade-in">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles size={13} /> Active Role: <strong>{activeProfName}</strong>
              </span>
              <button onClick={() => {
                localStorage.removeItem('yp-selected-profession-name');
                localStorage.removeItem('yp-selected-profession-template');
                setActiveProfName(null);
                setActiveProfTemplate(null);
              }} className="hover:text-[color:var(--text-1)] font-semibold transition-colors flex items-center gap-0.5 cursor-pointer">
                <X size={12} /> Reset Role
              </button>
            </div>
          )}

          {/* Workspace Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl border mb-6 text-xs max-w-xs w-full mx-auto animate-fade-up"
               style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
            <button
              onClick={() => { setWorkspace('general'); handleNewPrompt(); }}
              className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-center transition-all cursor-pointer ${
                workspace === 'general' ? 'bg-accent-teal/15 text-accent-teal' : 'text-[color:var(--text-2)] hover:bg-white/5'
              }`}
            >
              General Work
            </button>
            <button
              onClick={() => { setWorkspace('youtube'); handleNewPrompt(); }}
              className={`flex-1 py-1.5 px-3 rounded-lg font-semibold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                workspace === 'youtube' ? 'bg-accent-teal/15 text-accent-teal' : 'text-[color:var(--text-2)] hover:bg-white/5'
              }`}
            >
              <Video size={13} className={workspace === 'youtube' ? 'text-red-500' : 'text-[color:var(--text-3)]'} />
              YT Automation
            </button>
          </div>

          {/* Input Card */}
          <div id="prompt-builder" className="w-full max-w-2xl animate-fade-up scroll-mt-24" style={{ animationDelay: '0.1s' }}>
            <div className="text-[11px] font-bold text-[color:var(--text-3)] uppercase tracking-wider mb-2 block pl-1">
              Enter details below to generate a highly detailed prompt:
            </div>
            <div className="t-input rounded-2xl transition-all duration-300" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.2)' }}>
              {workspace === 'youtube' && activeYTToolId === 'yt-script' ? (
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-accent-teal uppercase tracking-wider">What is your video topic?</label>
                    <input
                      type="text"
                      value={ytTopic}
                      onChange={e => setYtTopic(e.target.value)}
                      placeholder="e.g., 5 Mind-Bending Space Secrets NASA Hides..."
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-accent-teal uppercase tracking-wider">What is your main motive or goal?</label>
                    <input
                      type="text"
                      value={ytMotive}
                      onChange={e => setYtMotive(e.target.value)}
                      placeholder="e.g., Maximize audience retention, explain complex topics simply..."
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-accent-teal uppercase tracking-wider">Script Tone & Pacing</label>
                      <select
                        value={ytTone}
                        onChange={e => setYtTone(e.target.value)}
                        className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                      >
                        <option value="engaging and energetic">Engaging & Energetic</option>
                        <option value="serious and dramatic">Serious & Dramatic</option>
                        <option value="mysterious and suspenseful">Mysterious & Suspenseful</option>
                        <option value="funny and conversational">Funny & Conversational</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-accent-teal uppercase tracking-wider">Video Style</label>
                      <select
                        value={ytStyle}
                        onChange={e => setYtStyle(e.target.value)}
                        className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                      >
                        <option value="explainer">Explainer Video</option>
                        <option value="storytelling">Storytelling & Biography</option>
                        <option value="top 10 compilation">Top 10 / Compilation</option>
                        <option value="case study">Detailed Case Study</option>
                      </select>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <textarea
                    ref={textareaRef}
                    maxLength={2000}
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleGenerate(); }}
                    placeholder={activeCategory?.placeholder || 'Describe what you need...'}
                    className="w-full bg-transparent border-none outline-none resize-none text-base leading-relaxed px-5 pt-5 pb-2"
                    style={{ minHeight: '160px', maxHeight: '320px', color: 'var(--text-1)' }}
                  />
                  {/* Interactive Tuning Controls */}
                  <div className="flex flex-col sm:flex-row gap-4 px-5 pb-4 pt-3 border-t border-dashed border-white/[0.04] justify-between">
                    {/* Detail Level Selector */}
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[10px] font-bold text-accent-teal uppercase tracking-wider block">Detail Level</span>
                      <div className="flex bg-bg-3 border border-white/[0.04] p-0.5 rounded-lg text-[11px]">
                        {(['concise', 'balanced', 'detailed'] as const).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setDetailLevel(lvl)}
                            className={`flex-1 py-1 rounded text-center transition-all cursor-pointer capitalize font-medium ${
                              detailLevel === lvl ? 'bg-accent-teal/15 text-accent-teal font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Output Tone Selector */}
                    <div className="flex-1 space-y-1.5">
                      <span className="text-[10px] font-bold text-accent-teal uppercase tracking-wider block">Output Tone</span>
                      <div className="flex bg-bg-3 border border-white/[0.04] p-0.5 rounded-lg text-[11px]">
                        {(['professional', 'creative', 'technical', 'persuasive'] as const).map(t => (
                          <button
                            key={t}
                            onClick={() => setTone(t)}
                            className={`flex-1 py-1 rounded text-center transition-all cursor-pointer capitalize font-medium ${
                              tone === t ? 'bg-accent-teal/15 text-accent-teal font-semibold' : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Toolbar */}
              <div className="flex items-center flex-wrap gap-3 px-4 py-3 border-t t-border">

                {/* Category dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setCategoryDropdownOpen(o => !o)}
                    data-open={categoryDropdownOpen}
                    className="t-toolbar-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer font-medium"
                  >
                    <span>Prompt type: {activeCategory?.name}</span>
                    <ChevronDown size={12} className={`transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="t-dropdown absolute bottom-full mb-2 left-0 z-50 rounded-xl overflow-hidden py-1" style={{ minWidth: '220px', backdropFilter: 'blur(20px)' }}>
                      {workspace === 'youtube' ? (
                        YT_TOOLS.map(tool => (
                          <button key={tool.id}
                            onClick={() => { setActiveYTToolId(tool.id); setCategoryDropdownOpen(false); textareaRef.current?.focus(); }}
                            className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${tool.id === activeYTToolId ? 'text-[color:var(--teal)]' : 't-text-2'}`}
                            style={{ background: tool.id === activeYTToolId ? 'rgba(15,186,158,0.08)' : 'transparent' }}
                            onMouseEnter={e => { if (tool.id !== activeYTToolId) (e.currentTarget as HTMLElement).style.background = 'rgba(128,128,128,0.07)'; }}
                            onMouseLeave={e => { if (tool.id !== activeYTToolId) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                          >
                            <span>{tool.name}</span>
                            {tool.id === activeYTToolId && <Check size={11} />}
                          </button>
                        ))
                      ) : (
                        categories.map(cat => {
                          const isLocked = !isPremium && (cat.id === 3 || cat.id === 4);
                          return (
                            <button key={cat.id}
                              onClick={() => handleCategorySelect(cat.id)}
                              className={`w-full text-left px-4 py-2.5 text-xs flex items-center justify-between transition-colors cursor-pointer ${cat.id === activeCategoryId ? 'text-[color:var(--teal)]' : 't-text-2'}`}
                              style={{ background: cat.id === activeCategoryId ? 'rgba(15,186,158,0.08)' : 'transparent' }}
                              onMouseEnter={e => { if (cat.id !== activeCategoryId) (e.currentTarget as HTMLElement).style.background = 'rgba(128,128,128,0.07)'; }}
                              onMouseLeave={e => { if (cat.id !== activeCategoryId) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                              <span className="flex items-center gap-1.5">
                                {cat.name}
                                {isLocked && <Lock size={10} className="text-zinc-500" />}
                              </span>
                              {cat.id === activeCategoryId && <Check size={11} />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>

                {/* Live Template Preview Trigger */}
                <button
                  onClick={() => setShowPreview(prev => !prev)}
                  className={`t-toolbar-btn px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-all flex items-center gap-1.5 ${
                    showPreview ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/30' : ''
                  }`}
                  title="Show Real-time Template Preview"
                >
                  <Sparkles size={11} className={showPreview ? 'animate-pulse' : ''} />
                  <span>Preview</span>
                </button>

                {/* Model Selector Emulator */}
                <div className="relative text-xs text-[color:var(--text-3)] font-medium border rounded-lg px-2 py-1.5 cursor-pointer hover:text-[color:var(--text-2)] bg-bg-3 border-white/[0.04]">
                  <span>Basic Model</span>
                </div>

                {/* Simulated utility buttons */}
                <button className="text-[color:var(--text-4)] hover:text-[color:var(--text-2)] p-1 transition-colors" title="Mic input (coming soon)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
                </button>
                <button className="text-[color:var(--text-4)] hover:text-[color:var(--text-2)] p-1 transition-colors" title="Attachment (coming soon)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>

                <div className="flex-1" />

                {/* Char count */}
                {userInput.length > 0 && (
                  <span className="text-[11px] tabular-nums t-text-4"
                        style={{ color: userInput.length >= 2000 ? '#ef4444' : userInput.length > 1800 ? '#f59e0b' : undefined }}>
                    {userInput.length}/2000
                  </span>
                )}

                {/* Send button */}
                <button
                  onClick={handleGenerate}
                  disabled={isLoading || (workspace === 'youtube' && activeYTToolId === 'yt-script' ? !ytTopic.trim() : !userInput.trim())}
                  title="Generate (Ctrl+Enter)"
                  className="flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer"
                  style={{
                    background: (workspace === 'youtube' && activeYTToolId === 'yt-script' ? ytTopic.trim() : userInput.trim()) && !isLoading ? 'linear-gradient(135deg,var(--teal),var(--cyan))' : 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {isLoading
                    ? <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--text-4)', borderTopColor: 'var(--text-2)' }} />
                    : <ArrowUp size={14} style={{ color: (workspace === 'youtube' && activeYTToolId === 'yt-script' ? ytTopic.trim() : userInput.trim()) ? 'var(--bg)' : 'var(--text-4)' }} />
                  }
                </button>
              </div>
            </div>

            {/* Real-time Template Preview Panel */}
            {showPreview && (
              <div className="mt-3 p-4 rounded-xl border text-xs leading-relaxed animate-fade-in"
                   style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-3)] mb-2 flex items-center justify-between">
                  <span>Blueprint Structure Preview</span>
                  <span className="text-accent-teal">Real-time</span>
                </div>
                <div className="t-text-2 whitespace-pre-wrap font-mono p-3 rounded-lg bg-black/10 dark:bg-white/[0.01] border" style={{ borderColor: 'var(--border)' }}>
                  {(() => {
                    const template = activeProfTemplate || activeCategory?.template || '';
                    if (!template.includes('[INPUT]')) {
                      return template;
                    }
                    const parts = template.split('[INPUT]');
                    let fillText = userInput.trim();
                    if (workspace === 'youtube' && activeYTToolId === 'yt-script') {
                      fillText = `Topic: ${ytTopic.trim() || 'General topic'}\nMotive/Goal: ${ytMotive.trim() || 'Educate and entertain'}\nTone/Pacing: ${ytTone}\nVideo Style: ${ytStyle}`;
                    }
                    if (fillText) {
                      fillText += `\n\n[Constraints]:\n- Detail level: ${detailLevel}\n- Output tone: ${tone}`;
                    }
                    const hasText = workspace === 'youtube' && activeYTToolId === 'yt-script' ? ytTopic.trim() : userInput.trim();
                    return (
                      <>
                        {parts[0]}
                        <span className={hasText ? 'text-accent-teal font-bold bg-accent-teal/10 px-1 rounded' : 'text-zinc-600 italic bg-zinc-800/10 px-1 rounded'}>
                          {fillText || '[Your description goes here]'}
                        </span>
                        {parts[1]}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}


            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 justify-center mt-5">
              {SUGGESTIONS.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => { setUserInput(s); setTimeout(() => textareaRef.current?.focus(), 50); }}
                  className="t-chip text-[11px] px-3 py-1.5 rounded-full transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Output Card */}
          {generatedPrompt && (
            <div ref={outputRef} className="t-output w-full max-w-2xl mt-5 rounded-2xl overflow-hidden animate-fade-in"
                 style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.15)' }}>
              <div className="flex items-center justify-between px-5 py-3 border-b t-border">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--teal)]">
                  YoursPrompt Output
                </span>
                <button
                  onClick={handleCopy}
                  disabled={!generatedPrompt || isLoading}
                  className={`t-action-btn flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium disabled:opacity-40 cursor-pointer ${isCopied ? 'copied' : ''}`}
                >
                  {isCopied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
              <div className="px-5 py-5 text-sm leading-relaxed min-h-[100px] flex items-start">
                {isLoading
                  ? <span className="loading-pulse t-text-4 italic text-sm">Analyzing and crafting your optimized prompt...</span>
                  : <span className="t-text-1 whitespace-pre-wrap">{generatedPrompt}</span>
                }
              </div>

              {/* Top Models Indicator */}
              {!isLoading && (
                <div className="border-t t-border px-5 py-4 bg-black/[0.02] dark:bg-white/[0.01]">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[color:var(--text-3)] mb-3 flex items-center gap-1">
                    <Sparkles size={11} className="text-accent-teal animate-pulse" /> Top 5 Recommended Models for this Prompt
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {(() => {
                      const categoryId = activeCategoryId;
                      let list = [
                        { name: 'Claude 3.5 Sonnet', score: 97, color: 'bg-teal-500' },
                        { name: 'GPT-4o (OpenAI)', score: 95, color: 'bg-cyan-500' },
                        { name: 'Gemini 1.5 Pro', score: 92, color: 'bg-emerald-500' },
                        { name: 'Llama 3 70B (Meta)', score: 88, color: 'bg-blue-500' },
                        { name: 'Command R+ (Cohere)', score: 85, color: 'bg-indigo-500' }
                      ];
                      if (categoryId === 1) { // Image
                        list = [
                          { name: 'Midjourney V6', score: 98, color: 'bg-teal-500' },
                          { name: 'DALL-E 3 (OpenAI)', score: 94, color: 'bg-cyan-500' },
                          { name: 'Stable Diffusion 3', score: 91, color: 'bg-emerald-500' },
                          { name: 'Adobe Firefly V3', score: 87, color: 'bg-blue-500' },
                          { name: 'Imagen 3 (Google)', score: 83, color: 'bg-indigo-500' }
                        ];
                      } else if (categoryId === 3 || categoryId === 4) { // Web / UI UX
                        list = [
                          { name: 'Claude 3.5 Sonnet', score: 98, color: 'bg-teal-500' },
                          { name: 'GPT-4o (OpenAI)', score: 96, color: 'bg-cyan-500' },
                          { name: 'Gemini 1.5 Pro', score: 91, color: 'bg-emerald-500' },
                          { name: 'Llama 3 70B (Meta)', score: 87, color: 'bg-blue-500' },
                          { name: 'Codestral (Mistral)', score: 83, color: 'bg-indigo-500' }
                        ];
                      }
                      return list;
                    })().map((m, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl border t-border flex flex-col justify-between bg-bg-main/30">
                        <span className="text-[11px] font-semibold text-[color:var(--text-1)] truncate">{m.name}</span>
                        <div className="mt-2 flex items-center gap-1.5">
                          {/* Mini Progress Bar */}
                          <div className="flex-grow h-1 bg-zinc-800/10 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full ${m.color}`} style={{ width: `${m.score}%` }} />
                          </div>
                          <span className="text-[10px] font-bold text-accent-teal shrink-0 tabular-nums">{m.score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Discovery Libraries Section */}
          <div className="w-full max-w-2xl mt-12 pt-8 border-t animate-fade-up" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-zinc-100 flex items-center gap-1.5">
                  <Sparkles size={15} className="text-accent-teal" /> Discover Prompt Libraries
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Quickly activate role-based instruction templates</p>
              </div>
              <Link href="/library" className="text-xs text-accent-teal hover:underline font-semibold flex items-center gap-0.5">
                Explore All &rarr;
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PROFESSIONS.slice(0, 4).map(prof => {
                const isActive = activeProfName === prof.name;
                const isLocked = prof.isPremium && !isPremium;
                return (
                  <button
                    key={prof.id}
                    onClick={() => {
                      if (isLocked) {
                        setPaywallReason('category');
                        setShowPaywall(true);
                        return;
                      }
                      localStorage.setItem('yp-selected-profession-template', prof.template);
                      localStorage.setItem('yp-selected-profession-name', prof.name);
                      setActiveProfName(prof.name);
                      setActiveProfTemplate(prof.template);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-xl border text-left transition-all hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between min-h-[92px] ${
                      isActive ? 'border-accent-teal/50 bg-accent-teal/5' : 'border-white/[0.05] bg-bg-2'
                    }`}
                    style={{
                      borderColor: isActive ? 'var(--teal)' : 'var(--border)',
                      background: isActive ? 'rgba(15,186,158,0.06)' : 'var(--bg-2)'
                    }}
                  >
                    <div>
                      <span className="text-[9px] uppercase tracking-wider font-semibold text-zinc-500">{prof.category}</span>
                      <h4 className="text-xs font-semibold mt-1 text-[color:var(--text-1)]">{prof.name}</h4>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-[9px] text-zinc-400">
                      <span>{isActive ? 'Active Role' : 'Click to load'}</span>
                      {isLocked ? (
                        <span className="text-red-400 font-semibold flex items-center gap-0.5"><Lock size={8} /> Pro</span>
                      ) : (
                        <span className="text-accent-teal font-semibold flex items-center gap-0.5"><Check size={8} /> Ready</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="t-footer w-full flex justify-center items-center gap-4 text-[11px] pb-6 pt-4">
          {[['About','/about'],['How it Works','/how-it-works'],['Pricing','/pricing']].map(([l,h],i,arr) => (
            <React.Fragment key={h}>
              <a href={h} className="hover:text-[color:var(--text-2)] transition-colors">{l}</a>
              {i < arr.length-1 && <span className="t-text-5">|</span>}
            </React.Fragment>
          ))}
          <span className="t-text-5">|</span>
          <span className="t-text-5">&copy; {new Date().getFullYear()} YoursPrompt</span>
        </footer>
      </div>

      {/* Paywall Modal overlay */}
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

            {paywallReason === 'credits' ? (
              <>
                <h3 className="text-xl font-bold text-[color:var(--text-1)]">Out of Free Credits</h3>
                <p className="text-sm text-[color:var(--text-3)] mt-2">
                  You've used all of your 3 free generations. Upgrade now to generate unlimited high-quality prompts.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[color:var(--text-1)]">Unlock Premium Category</h3>
                <p className="text-sm text-[color:var(--text-3)] mt-2">
                  Websites and UI/UX category templates are only available for premium subscribers.
                </p>
              </>
            )}

            <div className="w-full space-y-2 mt-6">
              <Link href="/pricing"
                    className="flex items-center justify-center w-full py-3 rounded-xl bg-accent-teal text-bg-main font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent-teal/15">
                View Premium Plans (Starting at ₹200)
              </Link>
              <button onClick={() => setShowPaywall(false)}
                      className="w-full py-2.5 rounded-xl border text-xs font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
                Maybe Later
              </button>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[color:var(--text-3)]">
              <span>Secure payment powered by Razorpay / Stripe</span>
            </div>
          </div>
        </div>
      )}
      {/* Onboarding Wizard Modal overlay */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-lg p-4 animate-fade-in">
          <div className="w-full max-w-lg p-6 md:p-8 rounded-3xl border flex flex-col justify-between shadow-2xl transition-all h-[560px]"
               style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
            
            {/* Top Info */}
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent-teal">
                  Step {onboardingStep + 1} of 3
                </span>
                <span className="text-xs text-[color:var(--text-3)] font-semibold">
                  {onboardingStep === 0 ? 'Who you are' : onboardingStep === 1 ? 'Your AI context' : 'What matters to you'}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden mb-6">
                <div className="h-full bg-accent-teal transition-all duration-300" style={{ width: `${((onboardingStep + 1) / 3) * 100}%` }} />
              </div>
            </div>

            {/* Form Panels */}
            <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-4">
              
              {/* Step 1: Who you are */}
              {onboardingStep === 0 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[color:var(--text-1)]">Who you are</h3>
                    <p className="text-xs text-[color:var(--text-3)]">Let's get to know you, partner</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[color:var(--text-2)]">What's your name? <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={onboardingAnswers.name || ''}
                      onChange={e => setOnboardingAnswers(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Bila Khan"
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[color:var(--text-2)]">What area do you work in? <span className="text-red-500">*</span></label>
                    <select
                      value={onboardingAnswers.workArea || ''}
                      onChange={e => setOnboardingAnswers(prev => ({ ...prev, workArea: e.target.value }))}
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
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
                    <label className="text-xs font-semibold text-[color:var(--text-2)] font-mono">What's your role title?</label>
                    <input
                      type="text"
                      value={onboardingAnswers.roleTitle || ''}
                      onChange={e => setOnboardingAnswers(prev => ({ ...prev, roleTitle: e.target.value }))}
                      placeholder="e.g. Chief Prompt Officer"
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
                    />
                    <p className="text-[10px] text-[color:var(--text-4)]">We'll use this to suggest powerful ways to use AI</p>
                  </div>
                </div>
              )}

              {/* Step 2: Your AI context */}
              {onboardingStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[color:var(--text-1)]">Your AI context</h3>
                    <p className="text-xs text-[color:var(--text-3)]">How do you wrangle AI at work?</p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-[color:var(--text-2)]">When it comes to AI at work, which best describes you? <span className="text-red-500">*</span></label>
                    <select
                      value={onboardingAnswers.context || ''}
                      onChange={e => setOnboardingAnswers(prev => ({ ...prev, context: e.target.value }))}
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
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

              {/* Step 3: What matters to you */}
              {onboardingStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-[color:var(--text-1)]">What matters to you</h3>
                    <p className="text-xs text-[color:var(--text-3)]">Help us help you</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[color:var(--text-2)]">What would make YoursPrompt 10x more valuable for you? <span className="text-red-500">*</span></label>
                    <div className="space-y-2 pt-1">
                      {[
                        "If it worked directly inside ChatGPT/Claude",
                        "If it automatically improved my prompts as I work",
                        "If I could save what works and reuse it for similar tasks",
                        "If it remembered my preferences across different AI tools",
                        "None of these — I'm just exploring"
                      ].map((item, idx) => {
                        const isChecked = onboardingAnswers.valueNeeds === item;
                        return (
                          <label key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer hover:bg-white/5 transition-colors"
                                 style={{ borderColor: isChecked ? 'var(--teal)' : 'var(--border)' }}>
                            <input
                              type="radio"
                              name="valueNeeds"
                              checked={isChecked}
                              onChange={() => setOnboardingAnswers(prev => ({ ...prev, valueNeeds: item }))}
                              className="mt-0.5 accent-teal"
                            />
                            <span className="text-xs text-[color:var(--text-2)]">{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <label className="text-xs font-semibold text-[color:var(--text-2)]">How did you hear about us? <span className="text-red-500">*</span></label>
                    <select
                      value={onboardingAnswers.referredBy || ''}
                      onChange={e => setOnboardingAnswers(prev => ({ ...prev, referredBy: e.target.value }))}
                      className="w-full bg-bg-3 rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer focus:border-accent-teal"
                      style={{ borderColor: 'var(--border)', color: 'var(--text-1)' }}
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

            {/* Bottom Actions */}
            <div className="flex items-center justify-between border-t pt-4 mt-2" style={{ borderColor: 'var(--border)' }}>
              {/* Previous button */}
              <button
                disabled={onboardingStep === 0}
                onClick={() => setOnboardingStep(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-semibold hover:text-[color:var(--text-1)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                style={{ color: 'var(--text-3)' }}
              >
                Back
              </button>

              {/* Next/Finish button */}
              <button
                onClick={handleOnboardingNext}
                disabled={
                  onboardingStep === 0 ? (!onboardingAnswers.name?.trim() || !onboardingAnswers.workArea) :
                  onboardingStep === 1 ? !onboardingAnswers.context :
                  (!onboardingAnswers.valueNeeds || !onboardingAnswers.referredBy)
                }
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-accent-teal text-bg-main hover:opacity-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {onboardingStep === 2 ? 'Continue' : 'Continue'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Feedback */}
      <a href="mailto:feedback@yoursprompt.com"
         className="t-feedback fixed bottom-6 right-6 z-40 hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-medium transition-all hover:-translate-y-0.5">
        <MessageSquare size={12} style={{ color: 'var(--teal)' }} />
        Feedback
      </a>

      {/* Copy Particles overlay */}
      {particles.map(p => (
        <span
          key={p.id}
          className="copy-particle"
          style={{
            left: p.x,
            top: p.y,
            '--dx': p.dx,
            '--dy': p.dy,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
