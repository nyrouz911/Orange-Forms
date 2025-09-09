"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saveForm } from "./mutateForm";

export async function generateForm(
  prevState: { message: string },
  formData: FormData
) {
  const schema = z.object({ description: z.string().min(1) });
  const parse = schema.safeParse({ description: formData.get("description") });

  if (!parse.success) {
    console.error(parse.error);
    return { message: "Failed to parse data" };
  }
  if (!process.env.OPENAI_API_KEY) {
    return { message: "No OpenAI API key found" };
  }

  const { description } = parse.data;
  const promptExplanation =
    "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []";

  const userPrompt = `
${description}

${promptExplanation}

Return ONLY a single JSON object with keys:
- name: string
- description: string
- questions: Array<{ text: string; fieldType: "RadioGroup" | "Select" | "Input" | "Textarea" | "Switch"; fieldOptions: Array<{ text: string; value: string }> }>

Rules:
- For RadioGroup and Select, fieldOptions must be non-empty.
- For Input, Textarea, and Switch, fieldOptions must be [].
`.trim();

  try {
    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        temperature: 0.2,
        // Chat Completions supports this to force JSON
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON API. Always reply with a single valid JSON object and nothing else.",
          },
          { role: "user", content: userPrompt },
        ],
        // optional cost guardrails
        max_tokens: 400,
      }),
    });

    // Always read raw text first so we can log the exact payload
    const raw = await resp.text();
if (!resp.ok) {
  let err: any = null;
  try { err = JSON.parse(raw); } catch { /* raw may be text/html */ }

  console.error("OpenAI error payload:", {
    status: resp.status,
    headers: Object.fromEntries(resp.headers.entries()),
    body: err ?? raw,
  });

//console.log("Using OpenAI key:", (process.env.OPENAI_API_KEY ?? "").slice(0,20) + "..." );

  // Return exactly what OpenAI said (no opinionated rewording)
  return {
    message: `OpenAI error${
      err?.error?.code ? ` [${err.error.code}]` : ""
    }: ${err?.error?.message ?? raw ?? `HTTP ${resp.status}`}`,
  };
}
    // Parse the success JSON
    let json: any;
    try {
      json = JSON.parse(raw);
    } catch {
      console.error("Non-JSON success payload from OpenAI:", raw);
      return { message: "Model returned non-JSON" };
    }

    // DO NOT blindly index choices[0]
    const choice = Array.isArray(json?.choices) ? json.choices[0] : undefined;
    const content: string | undefined =
      choice?.message?.content ?? choice?.text;

    if (!content) {
      console.error("Unexpected OpenAI payload shape:", json);
      return { message: "Empty response from model" };
    }

    let responseObj: any;
    try {
      responseObj = JSON.parse(content);
    } catch {
      console.error("Model returned invalid JSON:", content);
      return { message: "Model returned invalid JSON" };
    }

    if (
      !responseObj?.name ||
      !responseObj?.description ||
      !Array.isArray(responseObj?.questions)
    ) {
      console.error("Bad survey shape:", responseObj);
      return { message: "Generated survey has an invalid shape" };
    }

    const dbFormId = await saveForm({
      name: responseObj.name,
      description: responseObj.description,
      questions: responseObj.questions,
    });

    revalidatePath("/");
    return { message: "success", data: { formId: dbFormId } };
  } catch (e) {
    console.error(e);
    return { message: "Failed to create form" };
  }
}
