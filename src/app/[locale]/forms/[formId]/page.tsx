import React from 'react';
import { db } from '@/db';
import { forms } from '@/db/schema';
import { eq } from 'drizzle-orm';
import FillForm from '@/components/FillForm';

type FieldType = "RadioGroup" | "Select" | "Switch" | "Input" | "Textarea" | "ShortText";

const page = async ({ params }: { params: { formId: string } }) => {
  const formId = params.formId;

  if (!formId) {
    return <div>Form not found</div>
  };

  const form = await db.query.forms.findFirst({
    where: eq(forms.id, parseInt(formId)),
    with: {
      questions: {
        with: {
          fieldOptions: true
        }
      }
    }
  })

  if (!form) {
    return <div>Form not found</div>
  }

  // All fields properly sanitized for required types.
  const sanitizedForm = {
    ...form,
    name: form.name ?? '', // <- Ensures required string
    description: form.description ?? '', // Optional, but '' for display
    questions: form.questions.map(q => ({
      ...q,
      text: q.text ?? '',
      fieldType: (q.fieldType as FieldType) ?? 'ShortText',
      formId: q.formId ?? form.id,
      fieldOptions: q.fieldOptions ?? [],
    })),
  };

  return <FillForm form={sanitizedForm} />
};

export default page;
