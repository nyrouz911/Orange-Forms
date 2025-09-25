"use client";
import React, { useState } from "react";
import { addQuestion, updateQuestion, deleteQuestion } from "@/forms/actions/questionActions";

export default function Form({ form, editMode }: { form: any, editMode?: boolean }) {
  
const fieldTypes = ["ShortText", "RadioGroup", "Select", "Input", "Textarea", "Switch"] as const;

type FieldType = typeof fieldTypes[number];

// Updated to match database schema (nullable fields)
type Question = {
  id: number;
  text: string | null;  // Allow null
  fieldType: 'ShortText' | 'RadioGroup' | 'Select' | 'Input' | 'Textarea' | 'Switch' | null;  // Allow null
  formId: number | null;  // Allow null
};

const sanitizedQuestions: Question[] = form.questions.map((q: any) => ({
  id: q.id,
  text: q.text ?? '',
  fieldType: q.fieldType ?? 'ShortText',
  formId: q.formId ?? 0,
}));

  const [questions, setQuestions] = useState<Question[]>(sanitizedQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("ShortText");

  const handleAdd = async () => {
    const created = await addQuestion(form.id, newQuestion, newFieldType);
    setQuestions([...questions, created]);
    setNewQuestion("");
  };

  const handleEdit = async (id: number, text: string) => {
    await updateQuestion(id, text);
    setQuestions(questions.map(q => (q.id === id ? { ...q, text } : q)));
  };

  const handleDelete = async (id: number) => {
    await deleteQuestion(id);
    setQuestions(questions.filter(q => q.id !== id));
  };

  return (
    <div>
      <h2>Edit Form</h2>
     {questions.map((q: Question) => (
  <div key={q.id}>
    <input
      value={q.text || ''}  // Handle null values
      onChange={e => handleEdit(q.id, e.target.value)}
      disabled={!editMode}
    />
    {editMode && <button onClick={() => handleDelete(q.id)}>Delete</button>}
  </div>
))}

      {editMode && (
        <>
          <input value={newQuestion} onChange={e => setNewQuestion(e.target.value)} placeholder="Add a question" />
          <select value={newFieldType} onChange={e => setNewFieldType(e.target.value as FieldType)}>
  {fieldTypes.map((type) => (
    <option key={type} value={type}>
      {type}
    </option>
  ))}
</select>

          <button onClick={handleAdd}>Add</button>
        </>
      )}
    </div>
  );
}