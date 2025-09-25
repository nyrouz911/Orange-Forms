// src/forms/FormField.tsx
'use client';

import * as React from 'react';

type FieldType = 'RadioGroup' | 'Select' | 'Switch' | 'Input' | 'Textarea' | 'ShortText';

type FieldOption = {
  id: number;
  text: string | null;
  value: string | null;
  questionId: number | null;
};

export type QuestionWithOptionsModel = {
  id: number;
  text: string;
  fieldType: FieldType;
  formId: number;
  fieldOptions: FieldOption[];
};

type Props = {
  element: QuestionWithOptionsModel;
  value: string | boolean; // RHF-controlled value coming from FillForm
  onChange: (val: any) => void; // FillForm's universal setter accepts event or value
};

export default function FormField({ element, value, onChange }: Props) {
  const { id, fieldType, fieldOptions } = element;

  // Helper for option value shape your submitter expects:
  // "answerId_<id>" for choice inputs, raw strings for free text, booleans for switch.
  const optVal = (opt: FieldOption) => `answerId_${opt.id}`;

  if (fieldType === 'Select') {
    return (
      <select
        value={(value as string) ?? ''}
        onChange={onChange}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-[var(--brand-orange-500)]"
      >
        {/* Ensure the current value can be '' initially so the control isn't “stuck” */}
        <option value="" disabled>
          -- Select an option --
        </option>
        {fieldOptions.map((opt) => (
          <option key={opt.id} value={optVal(opt)}>
            {opt.text ?? opt.value ?? `Option ${opt.id}`}
          </option>
        ))}
      </select>
    );
  }

  if (fieldType === 'RadioGroup') {
    const name = `q_${id}`;
    return (
      <div className="space-y-2">
        {fieldOptions.map((opt) => {
          const v = optVal(opt);
          return (
            <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={name}
                value={v}
                checked={value === v}
                onChange={onChange}
                className="h-4 w-4 accent-[var(--brand-orange-500)]"
              />
              <span className="text-sm">
                {opt.text ?? opt.value ?? `Option ${opt.id}`}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  if (fieldType === 'Switch') {
  const name = `q_${id}`;
  const v = String(value ?? '');

  return (
    <div className="flex items-center gap-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          value="true"
          checked={v === 'true'}
          onChange={onChange}
          className="h-4 w-4 accent-[var(--brand-orange-500)]"
        />
        <span className="text-sm">Yes</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name={name}
          value="false"
          checked={v === 'false'}
          onChange={onChange}
          className="h-4 w-4 accent-[var(--brand-orange-500)]"
        />
        <span className="text-sm">No</span>
      </label>
    </div>
  );
}

  if (fieldType === 'Textarea') {
    return (
      <textarea
        value={(value as string) ?? ''}
        onChange={onChange}
        rows={4}
        className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-orange-500)]"
        placeholder="Your answer..."
      />
    );
  }

  // Input & ShortText => single-line text
  return (
    <input
      type="text"
      value={(value as string) ?? ''}
      onChange={onChange}
      className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[var(--brand-orange-500)]"
      placeholder="Your answer..."
    />
  );
}
