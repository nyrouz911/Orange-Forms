// src/app/[locale]/forms/edit/[formId]/page.tsx
import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Form from '../../../../forms/Form';
import { Button } from '@/components/ui/button';
import PublishButton from '@/components/PublishButton';

type PageProps = { params: { formId: string } };

const Page = async ({ params }: PageProps) => {
  const formId = params.formId;
  if (!formId) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <EmptyState title="Form not found" />
      </main>
    );
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parseInt(formId, 10)),
    with: {
      questions: {
        with: { fieldOptions: true },
      },
    },
  });

  if (!form) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <EmptyState title="Form not found" />
      </main>
    );
  }

  if (!userId || userId !== form.userId) {
    return (
      <main className="max-w-5xl mx-auto p-6">
        <EmptyState
          title="You are not authorized to view this page"
          description="Log in with the owner account or contact the form owner."
          action={
            <Link href="/api/auth/signin">
              <Button className="bg-[var(--brand-orange-500)] hover:opacity-90">Sign in</Button>
            </Link>
          }
        />
      </main>
    );
  }

  const sanitizedForm = {
    ...form,
    name: form.name ?? '',
    description: form.description ?? '',
    userId: form.userId ?? undefined,
    published: form.published ?? false,
    questions: form.questions.map((q) => ({
      ...q,
      text: q.text ?? '',
      fieldType: (q.fieldType as any) ?? 'Input',
      formId: q.formId ?? form.id,
      fieldOptions: q.fieldOptions ?? [],
    })),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/en/view-forms`}>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-[var(--brand-black)]">
              ← Back
            </Button>
          </Link>

          <h1 className="text-2xl font-semibold tracking-tight">
            Edit: <span className="text-[var(--brand-orange-600)]">{sanitizedForm.name || `Form #${form.id}`}</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <StatusPill published={sanitizedForm.published} />
          <PublishButton initialPublished={sanitizedForm.published} formId={form.id} />
          <Link href={`/en/forms/${form.id}`}>
            <Button className="bg-[var(--brand-orange-500)] hover:opacity-90">Preview</Button>
          </Link>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h2 className="text-base font-medium">Form builder</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Update fields, choices and settings. Changes are saved when you submit within the editor.
          </p>
        </div>
        <div className="px-5 py-5">
          <Form form={sanitizedForm} />
        </div>
      </div>
    </main>
  );
};

export default Page;

function StatusPill({ published }: { published: boolean }) {
  return published ? (
    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
      <span className="h-2 w-2 rounded-full bg-green-500" />
      Published
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
      <span className="h-2 w-2 rounded-full bg-yellow-500" />
      Draft
    </span>
  );
}

function EmptyState({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description ? <p className="mt-2 text-sm text-neutral-600">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
