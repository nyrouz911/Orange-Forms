'use server';
import { db } from '@/db';
import { questions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function addQuestion(formId: number, text: string, fieldType: 'RadioGroup' | 'Select' | 'Input' | 'Textarea' | 'Switch' | 'ShortText') {
  const [question] = await db.insert(questions).values({
    text,
    fieldType,
    formId,
  }).returning();
  return question;
}
export async function updateQuestion(questionId: number, newText: string) {
  await db.update(questions).set({ text: newText }).where(eq(questions.id, questionId));
}

export async function deleteQuestion(questionId: number) {
  await db.delete(questions).where(eq(questions.id, questionId));
}
