'use client';

import React from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {Button} from '@/components/ui/button';
import FormField from '@/forms/FormField';

type FieldType = 'RadioGroup' | 'Select' | 'Switch' | 'Input' | 'Textarea' | 'ShortText';

type FieldOption = {
  id: number;
  text: string | null;
  value: string | null;
  questionId: number | null;
};

type QuestionWithOptionsModel = {
  id: number;
  text: string;
  fieldType: FieldType;
  formId: number;
  fieldOptions: FieldOption[];
};

interface FillFormProps {
  form: {
    id: number;
    name: string;
    description?: string;
    questions: QuestionWithOptionsModel[];
  };
}

export default function FillForm({ form }: FillFormProps) {
  // Better defaults: Switch => false, others => ''
  const defaultValues = form.questions.reduce((acc, q) => {
    acc[`question_${q.id}`] = q.fieldType === 'Switch' ? false : '';
    return acc;
  }, {} as Record<string, any>);

  const methods = useForm({ defaultValues });
  const {setValue, watch, handleSubmit} = methods;

  // Universal setter that works for DOM events, Radix onValueChange, and toggles
  const setAnswer = (key: string, incoming: any) => {
    let next: any = incoming;

    // DOM events (e.g. <input/textarea onChange>)
    if (incoming && typeof incoming === 'object' && 'target' in incoming) {
      const t = (incoming as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>).target;
      next = t.type === 'checkbox' ? (t as HTMLInputElement).checked : t.value;
    }

    // Coerce undefined/null to ''
    if (next === undefined || next === null) next = '';

    setValue(key, next, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  const onSubmit = async (data: Record<string, any>) => {
    // Build payload: if value looks like "answerId_123" treat it as a selected option,
    // otherwise send the raw text/boolean value.
    const answers = Object.entries(data).map(([key, value]) => {
      const questionId = parseInt(key.replace('question_', ''), 10);

      if (typeof value === 'string' && value.startsWith('answerId_')) {
        return {
          questionId,
          fieldOptionsId: parseInt(value.replace('answerId_', ''), 10),
          value: null as string | null
        };
      }

      // For booleans and free text
      return {
        questionId,
        fieldOptionsId: null as number | null,
        value: typeof value === 'boolean' ? String(value) : (value ?? '')
      };
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/form/new`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ formId: form.id, answers })
    });

    if (res.ok) {
      alert('Form submitted successfully!');
    } else {
      alert('Error submitting form. Please try again later.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">{form.name}</h1>
      {form.description ? <p className="text-neutral-600 mb-4">{form.description}</p> : null}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {form.questions.map((question) => {
            const key = `question_${question.id}`;
            const value = watch(key);

            return (
              <div key={question.id}>
                <label className="block font-semibold mb-1">{question.text}</label>

                <FormField
                  element={question}
                  // Always pass a defined value for controlled inputs
                  value={value ?? (question.fieldType === 'Switch' ? false : '')}
                  onChange={(v: any) => setAnswer(key, v)}
                />
              </div>
            );
          })}
          <Button type="submit" className="bg-[var(--brand-orange-500)] hover:opacity-90">
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
