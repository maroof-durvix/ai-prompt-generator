import { NextResponse } from 'next/server';
import { logPromptHistory } from '@/lib/db';
import { fallback_categories } from '../categories/route';
import { getDbCategories } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { category_id, user_input } = await request.json();

    const categoryIdNum = parseInt(category_id);
    const inputClean = user_input ? user_input.trim() : '';

    if (!inputClean) {
      return NextResponse.json({ error: 'Please describe what you need.' }, { status: 400 });
    }

    if (inputClean.length > 2000) {
      return NextResponse.json({ error: 'Input exceeds maximum length of 2000 characters.' }, { status: 400 });
    }

    // Attempt to get from DB first
    let categoriesList = await getDbCategories();
    if (!categoriesList || categoriesList.length === 0) {
      categoriesList = fallback_categories;
    }

    const category = categoriesList.find((cat) => cat.id === categoryIdNum);
    if (!category) {
      return NextResponse.json({ error: 'Selected category is invalid.' }, { status: 400 });
    }

    const generatedPrompt = category.template.replace('[INPUT]', inputClean);

    // Logging to history asynchronously
    await logPromptHistory(categoryIdNum, inputClean, generatedPrompt);

    return NextResponse.json({
      success: true,
      generated_prompt: generatedPrompt,
    });
  } catch (error: any) {
    console.error('Error generating prompt:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
