// src/components/Form.tsx
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FIELD_TYPES = ["Input", "Textarea", "RadioGroup", "Select", "Switch", "ShortText"] as const;
type FieldType = typeof FIELD_TYPES[number];

type Question = {
  id: number;
  text: string;
  fieldType: FieldType;
  formId: number;
  // optional: fieldOptions if you support them in this editor
  fieldOptions?: Array<{ id?: number; text: string; value: string }>;
};

export default function Form({
  form,
  editMode: editModeProp = false
}: {
  form: any;
  editMode?: boolean;
}) {
  // Sanitize initial data
  const initialQuestions: Question[] = (form?.questions ?? []).map((q: any) => ({
    id: q.id,
    text: q.text ?? "",
    fieldType: (q.fieldType as FieldType) ?? "Input",
    formId: q.formId ?? form.id,
    fieldOptions: q.fieldOptions ?? []
  }));

  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("Input");
  const [isSaving, setIsSaving] = useState(false);
  const [editMode, setEditMode] = useState(!!editModeProp);

  async function reloadFromServer() {
    const res = await fetch(`/api/form/${form.id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to reload form");
    const data = await res.json();
    const fresh = (data.form?.questions ?? []).map((q: any) => ({
      id: q.id,
      text: q.text ?? "",
      fieldType: (q.fieldType as FieldType) ?? "Input",
      formId: q.formId ?? form.id,
      fieldOptions: q.fieldOptions ?? []
    })) as Question[];
    setQuestions(fresh);
  }

  async function pushQuestions(fullList: Question[]) {
    setIsSaving(true);
    try {
      const payload = {
        name: form.name ?? undefined,
        description: form.description ?? undefined,
        questions: fullList.map(q => ({
          id: q.id, // server will use id to decide update vs insert
          text: q.text,
          fieldType: q.fieldType,
          // include options if you support them in UI
          fieldOptions: q.fieldOptions?.map(o => ({ text: o.text, value: o.value })) ?? []
        }))
      };

      const res = await fetch(`/api/form/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "");
        throw new Error(err || "Failed to save");
      }

      // Re-fetch to get fresh IDs for newly inserted rows
      await reloadFromServer();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleAdd() {
    if (!newQuestionText.trim()) return;
    // Optimistic local add with a temporary id (negative)
    const tempId = -(Date.now());
    const next: Question[] = [
      ...questions,
      {
        id: tempId,
        text: newQuestionText.trim(),
        fieldType: newFieldType,
        formId: form.id,
        fieldOptions: []
      }
    ];
    setQuestions(next);
    setNewQuestionText("");
    await pushQuestions(next);
  }

  async function handleEdit(id: number, text: string) {
    const next = questions.map(q => (q.id === id ? { ...q, text } : q));
    setQuestions(next);
    await pushQuestions(next);
  }

  async function handleChangeType(id: number, fieldType: FieldType) {
    const next = questions.map(q => (q.id === id ? { ...q, fieldType } : q));
    setQuestions(next);
    await pushQuestions(next);
  }

  async function handleDelete(id: number) {
    const next = questions.filter(q => q.id !== id);
    setQuestions(next);
    await pushQuestions(next);
  }

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <button
        onClick={() => setEditMode(!editMode)}
        className="mb-2 inline-flex items-center rounded-md border border-[var(--brand-orange-500)] px-4 py-2 text-sm font-medium text-[var(--brand-orange-500)] hover:bg-[var(--brand-orange-500)] hover:text-white transition"
      >
        {editMode ? "Switch to View Mode" : "Switch to Edit Mode"}
      </button>

      {/* Add new question */}
      {editMode && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add a question</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-[1fr_minmax(180px,240px)_auto]">
            <input
              type="text"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="New question text"
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange-500)] focus-visible:ring-offset-2"
              aria-label="New question text"
            />

            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as FieldType)}
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange-500)] focus-visible:ring-offset-2"
              aria-label="Field type"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              disabled={isSaving || !newQuestionText.trim()}
              className="inline-flex items-center rounded-md bg-[var(--brand-orange-500)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              ＋ Add Question
            </button>
          </CardContent>
        </Card>
      )}

      {/* Questions list */}
      <div className="space-y-3">
        {questions.map((q) => (
          <Card key={q.id}>
            <CardContent className="pt-5 grid gap-3 sm:grid-cols-[1fr_minmax(180px,240px)_auto]">
              <input
                value={q.text}
                onChange={(e) => handleEdit(q.id, e.target.value)}
                disabled={!editMode || isSaving}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange-500)] focus-visible:ring-offset-2 disabled:opacity-60"
                aria-label="Question text"
              />

              <select
                value={q.fieldType}
                onChange={(e) => handleChangeType(q.id, e.target.value as FieldType)}
                disabled={!editMode || isSaving}
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange-500)] focus-visible:ring-offset-2 disabled:opacity-60"
                aria-label="Question type"
              >
                {FIELD_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              {editMode && (
                <button
                  onClick={() => handleDelete(q.id)}
                  disabled={isSaving}
                  className="justify-self-start inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
                >
                  ✕ Delete
                </button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {isSaving && (
        <p className="text-sm text-neutral-500">Saving…</p>
      )}
    </div>
  );
}
