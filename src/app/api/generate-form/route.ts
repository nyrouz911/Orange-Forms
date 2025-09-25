import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


import { saveForm } from '@/actions/mutateForm';
import { auth } from '@/auth';

import { getUserSubscription } from '@/app/actions/userSubscriptions';
import { getUserForms } from '@/app/actions/getUserForms';
import { MAX_FREE_FROMS } from '@/lib/utils';

function extractJsonObject(text: string) {
  try { return JSON.parse(text); } catch {}
  const fenced = text.match(/```json\s*([\s\S]*?)```/i)?.[1];
  if (fenced) { try { return JSON.parse(fenced); } catch {} }
  const brace = text.match(/\{[\s\S]*\}/);
  if (brace) { try { return JSON.parse(brace[0]); } catch {} }
  throw new Error("Model did not return valid JSON");
}

export async function POST(request: NextRequest) {
  try {

        // Auth first (source of truth is server)
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Enforce free-tier limit if user isn't subscribed
    const isSubscribed = await getUserSubscription({ userId }); // boolean | undefined
    console.log("[DEBUG] subscribed?", isSubscribed, "userId:", userId);
    if (!isSubscribed) {
      const existing = await getUserForms(); // already filtered by current user
      if (existing.length >= MAX_FREE_FROMS) {
        return NextResponse.json(
          { error: 'Free plan limit reached. Please upgrade to create more forms.' },
          { status: 402 } // Payment Required
        );
      }
    }
    
    const body = await request.json();
    const schema = z.object({ description: z.string().min(1) });
    const parse = schema.safeParse(body);
    
    if (!parse.success) {
      return NextResponse.json({ error: 'Failed to parse data' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'No GROQ_API_KEY found' }, { status: 500 });
    }

    const { description } = parse.data;
    const systemPrompt =
      "You are a strict JSON API. Return ONLY a single JSON object with keys: " +
      "name (string), description (string), and questions (array of { text, fieldType, fieldOptions }). " +
      'fieldType must be one of: "RadioGroup", "Select", "Input", "Textarea", "Switch". ' +
      "For RadioGroup & Select include fieldOptions=[{text,value}], otherwise []. No extra text.";

    const userPrompt = `${description}

Return ONLY a single JSON object with keys:
- name: string
- description: string
- questions: Array<{ text: string; fieldType: "RadioGroup" | "Select" | "Input" | "Textarea" | "Switch"; fieldOptions: Array<{ text: string; value: string }> }>

Rules:
- For RadioGroup and Select, fieldOptions must be non-empty.
- For Input, Textarea, and Switch, fieldOptions must be [].
`.trim();

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "groq/compound-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: 400,
      }),
    });

    const raw = await resp.text();
    if (!resp.ok) {
      let err: any = null; 
      try { err = JSON.parse(raw); } catch {}
      return NextResponse.json({
        error: (err?.error?.message as string | undefined) ?? 
               `Groq request failed (HTTP ${resp.status})`,
      }, { status: 500 });
    }

    const json = JSON.parse(raw);
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    if (!content) {
      return NextResponse.json({ error: 'Empty response from model' }, { status: 500 });
    }

    let responseObj: any;
    try { 
      responseObj = extractJsonObject(content); 
    } catch { 
      return NextResponse.json({ error: 'Model returned invalid JSON' }, { status: 500 });
    }

    if (!responseObj?.name || !responseObj?.description || !Array.isArray(responseObj?.questions)) {
      return NextResponse.json({ error: 'Generated survey has an invalid shape' }, { status: 500 });
    }

    // Save the form to database
     const dbFormId = await saveForm({
      name: responseObj.name,
      description: responseObj.description,
      questions: responseObj.questions, 
      userId, // ensure your action uses this to populate forms.userId
    });

    return NextResponse.json({
      success: true,
      message: 'Form generated successfully!',
      data: { formId: String(dbFormId) }
    });

  } catch (e: any) {
    console.error('Generate form error:', e);
    return NextResponse.json({
      error: String(e?.message ?? 'Failed to create form')
    }, { status: 500 });
  }
}