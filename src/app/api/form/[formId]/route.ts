import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { forms, questions, fieldOptions } from "@/db/schema";
import { eq, and, inArray } from "drizzle-orm";

type Params = { params: { formId: string } };

export async function GET(_req: Request, { params }: Params) {
  const id = Number(params.formId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, id),
    with: { questions: { with: { fieldOptions: true } } }
  });
  if (!form) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ form });
}

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.formId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  // (optional ownership check) ensure the form belongs to user
  const owner = await db.query.forms.findFirst({ where: eq(forms.id, id) });
  if (!owner || owner.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { name, description, questions: qList } = body;

  if (name !== undefined || description !== undefined) {
    await db.update(forms).set({ name, description }).where(eq(forms.id, id));
  }

  if (Array.isArray(qList)) {
    const existing = await db.query.questions.findMany({ where: eq(questions.formId, id) });
    const existingIds = new Set(existing.map(q => q.id));
    const keepIds: number[] = [];

    // Upsert
    for (const q of qList) {
      if (q.id && existingIds.has(q.id)) {
        keepIds.push(q.id);
        await db.update(questions).set({
          text: q.text,
          fieldType: q.fieldType
        }).where(eq(questions.id, q.id));

        // Replace options (simpler and safe)
        await db.delete(fieldOptions).where(eq(fieldOptions.questionId, q.id));
        if (Array.isArray(q.fieldOptions) && q.fieldOptions.length) {
          await db.insert(fieldOptions).values(
            q.fieldOptions.map((o: any) => ({
              questionId: q.id,
              text: o.text,
              value: o.value
            }))
          );
        }
      } else {
        const [created] = await db.insert(questions).values({
          formId: id,
          text: q.text,
          fieldType: q.fieldType
        }).returning();
        keepIds.push(created.id);
        if (Array.isArray(q.fieldOptions) && q.fieldOptions.length) {
          await db.insert(fieldOptions).values(
            q.fieldOptions.map((o: any) => ({
              questionId: created.id,
              text: o.text,
              value: o.value
            }))
          );
        }
      }
    }

    // Delete removed questions
    const toDelete = existing.filter(q => !keepIds.includes(q.id)).map(q => q.id);
    if (toDelete.length) {
      await db.delete(fieldOptions).where(inArray(fieldOptions.questionId, toDelete));
      await db.delete(questions).where(inArray(questions.id, toDelete));
    }
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.formId);
  if (!Number.isFinite(id)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const owner = await db.query.forms.findFirst({ where: eq(forms.id, id) });
  if (!owner || owner.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await db.delete(forms).where(eq(forms.id, id));
  return NextResponse.json({ success: true });
}
