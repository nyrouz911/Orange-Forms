"use client";

import { useState } from "react";

export type ActionState = { 
  message: string; 
  data?: { formId: string } 
};

export default function FormClient() {
  const [state, setState] = useState<ActionState>({ message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const form = e.currentTarget; // Store form reference before async operation
    const formData = new FormData(form);
    const description = formData.get("description") as string;
    
    console.log("About to make fetch request to /api/generate-form");
    console.log("Description:", description);

    try {
      const response = await fetch('/api/generate-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      console.log("Response status:", response.status);
      
      const result = await response.json();
      console.log("Response data:", result);
      
      if (response.ok && result.success === true) {
        setState({
          message: result.message || 'Form generated successfully!',
          data: result.data
        });
        form.reset(); // Use stored form reference
      } else {
        setState({ message: result?.error || 'An error occurred' });
        if (response.status === 402) {
          // show upgrade CTA — replace with your SubscribeBtn/modal if desired
          alert('Free plan limit reached. Please upgrade to create more forms.');
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setState({
        message: 'Network error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Form Description:
          </label>
          <textarea
            id="description"
            name="description"
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Describe the form you want to create..."
            rows={3}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 rounded font-[Helvetica] bg-[var(--brand-orange-500)] text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Generating..." : "Generate Form"}
        </button>
      </form>

      {state.message && (
        <div className={`p-3 rounded ${
          state.data ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
        }`}>
          <p className="text-sm">
            <strong>Result:</strong> {state.message}
            {state.data?.formId && (
              <span> (Form ID: {state.data.formId})</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}