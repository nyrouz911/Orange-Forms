"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { InferSelectModel } from "drizzle-orm";
import { forms } from "@/db/schema";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type Form = InferSelectModel<typeof forms>;

type Props = {
  forms: Form[];
};

export default function FormsList({ forms }: Props) {
  const { locale } = useParams();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this form? This cannot be undone.")) return;

    try {
      setDeletingId(id);
      const res = await fetch(`/api/form/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(msg || "Failed to delete form");
      }
      router.refresh();
    } catch (err: any) {
      alert(err?.message ?? "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="grid grid-cols1 md:grid-cols-3 m-5 p-4 gap-4">
      {forms.map((form) => (
        <Card key={form.id} className="relative max-w-[350px] flex flex-col">
          {/* Small trash icon button in the top-right */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Delete form"
            className="absolute right-2 top-2 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => handleDelete(form.id)}
            disabled={deletingId === form.id}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>

          <CardHeader className="flex-1 pr-12">
            <CardTitle className="truncate">{form.name}</CardTitle>
            <CardDescription className="line-clamp-2">{form.description}</CardDescription>
          </CardHeader>

          <CardFooter>
            <Link className="w-full" href={`/${locale}/forms/edit/${form.id}`}>
              <Button className="w-full bg-[var(--brand-orange-500)] hover:opacity-90">
                View
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
