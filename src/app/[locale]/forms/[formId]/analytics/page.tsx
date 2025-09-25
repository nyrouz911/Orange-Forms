// src/app/[locale]/forms/[formId]/analytics/page.tsx
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Charts from './charts';

export default async function Page({ params }: { params: { formId: string } }) {
  const id = Number(params.formId);
  const form = await db.query.forms.findFirst({ where: eq(forms.id, id) });
  if (!form) return <div className="p-6">Form not found</div>;

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Analytics: {form.name ?? `Form ${id}`}
      </h1>
      <Charts formId={id} />
    </main>
  );
}
