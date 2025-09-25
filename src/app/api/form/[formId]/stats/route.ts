// src/app/api/form/[formId]/stats/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { answers, questions } from '@/db/schema';
import { eq, inArray } from 'drizzle-orm';

export async function GET(_req: Request, { params }: { params: { formId: string } }) {
  const formId = Number(params.formId);
  if (!Number.isFinite(formId)) {
    return NextResponse.json({ error: 'Bad id' }, { status: 400 });
  }

  // Get all questions for the form
  const qs = await db.query.questions.findMany({
    where: eq(questions.formId, formId)
  });

  if (!qs.length) {
    return NextResponse.json({ stats: {}, questions: [] }, { status: 200 });
  }

  const qIds = qs.map((q) => q.id);
  const ans = await db.query.answers.findMany({
    where: inArray(answers.questionId, qIds)
  });

  // Aggregate
  const stats: Record<number, Record<string, number>> = {};
  for (const q of qs) stats[q.id] = {};

  for (const a of ans) {
    const q = qs.find((x) => x.id === a.questionId);
    if (!q) continue;

    const key =
      q.fieldType === 'Switch'
        ? a.value?.toLowerCase() === 'true'
          ? 'True'
          : 'False'
        : a.value ?? '—';

    stats[q.id][key] = (stats[q.id][key] ?? 0) + 1;
  }

  return NextResponse.json({ stats, questions: qs }, { status: 200 });
}
