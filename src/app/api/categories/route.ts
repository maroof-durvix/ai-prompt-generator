import { NextResponse } from 'next/server';
import { getDbCategories } from '@/lib/db';

export const fallback_categories = [
  {
    id: 1,
    name: 'Image Generation',
    slug: 'image-generation',
    description: 'Create high-quality images with detailed prompts.',
    template: 'Generate a high-quality visual representation showing [INPUT]. The style should be modern, clean, with premium aesthetics, rich composition, dynamic lighting, and cinematic atmosphere.',
    placeholder: 'Example: A futuristic floating city with neon lights and flying cars, digital art style...'
  },
  {
    id: 2,
    name: 'Graphic Design',
    slug: 'graphic-design',
    description: 'Generate prompts for logos, banners, posters, and more.',
    template: 'Create a professional graphic design concept for [INPUT]. The design must incorporate contemporary typography, balanced layout, custom visual assets, and a cohesive, premium color palette suitable for modern brands.',
    placeholder: 'Example: A minimalist logo design for a sustainable eco-friendly clothing brand...'
  },
  {
    id: 3,
    name: 'Website Prompt',
    slug: 'website-prompt',
    description: 'Create prompts for websites, landing pages, and web apps.',
    template: 'Design a premium landing page/website structure for [INPUT]. The layout must include a captivating hero section with a compelling headline, a call-to-action button, a features grid, user testimonials, pricing sections, and a clean footer. Use modern, highly-polished aesthetics and solid responsive layout guidelines.',
    placeholder: 'Example: Create a premium landing page for a fitness app with dark theme and modern UI...'
  },
  {
    id: 4,
    name: 'UI/UX Prompt',
    slug: 'ui-ux-prompt',
    description: 'Generate prompts for UI/UX designs and user interfaces.',
    template: 'Create a comprehensive UI/UX user interface design concept for [INPUT]. Focus on optimal user flows, micro-interactions, high accessibility, visual hierarchy, clean card components, consistent spacing, and an overall elegant user experience.',
    placeholder: 'Example: An intuitive mobile app dashboard for tracking daily financial transactions...'
  },
  {
    id: 5,
    name: 'Marketing Prompt',
    slug: 'marketing-prompt',
    description: 'Create prompts for ads, campaigns, and marketing strategies.',
    template: 'Write a high-converting marketing copy and campaign strategy for [INPUT]. Craft attention-grabbing headlines, persuasive body content, a strong value proposition, and an irresistible call-to-action tailored for target social platforms.',
    placeholder: 'Example: An Instagram ad campaign copy promoting a new organic coffee blend...'
  },
  {
    id: 6,
    name: 'Content Writing Prompt',
    slug: 'content-writing-prompt',
    description: 'Create prompts for blog posts, articles, and content creation.',
    template: 'Draft an engaging, structured article outline or full post about [INPUT]. Integrate a compelling hook, organized subheadings (H2, H3), well-explained key arguments, a clear writing voice, and a strong summary conclusion.',
    placeholder: 'Example: A comprehensive guide on the benefits of remote working for tech professionals...'
  }
];

export async function GET() {
  const dbCategories = await getDbCategories();
  if (dbCategories && dbCategories.length > 0) {
    return NextResponse.json(dbCategories);
  }
  return NextResponse.json(fallback_categories);
}
