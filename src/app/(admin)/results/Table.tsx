"use client";
import * as React from "react";
import { InferSelectModel } from "drizzle-orm";
import {
  forms,
  answers as answersTable,
  formSubmissions as formSubmissionsTable,
  questions as questionsTable,
  fieldOptions as fieldOptionsTable,
} from "@/db/schema";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

type FieldOption = InferSelectModel<typeof fieldOptionsTable>;
type Answer = InferSelectModel<typeof answersTable> & { fieldOption?: FieldOption | null };
type Question = InferSelectModel<typeof questionsTable> & { fieldOptions: FieldOption[] };
type FormSubmission = InferSelectModel<typeof formSubmissionsTable> & { answers: Answer[] };

export type Form =
  | (InferSelectModel<typeof forms> & {
      questions: Question[];
      submissions: FormSubmission[];
    })
  | undefined;

interface TableProps {
  data: FormSubmission[];
  columns: Question[];
  /** Optional file name (no extension). Defaults to "form_results". */
  fileName?: string;
}

const columnHelper = createColumnHelper<any>();

export function Table({ data, columns: questionDefs, fileName = "form_results" }: TableProps) {
  // Build columns (one column per question)
  const columns = React.useMemo(
    () =>
      questionDefs.map((question) =>
        columnHelper.accessor(
          (row: FormSubmission) => {
            const ans = (row.answers ?? []).find((a) => a?.questionId === question.id);
            return ans?.fieldOption?.text ?? ans?.value ?? "—";
          },
          {
            id: question.id.toString(),
            header: () => question.text ?? `Question ${question.id}`,
            cell: (info) => info.renderValue(),
          }
        )
      ),
    [questionDefs]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Export to Excel
  async function handleExportExcel() {
    // Lazy-load xlsx (keeps bundle smaller)
    const XLSX = await import("xlsx");

    // Build a flat array of objects: { "Question 1": "Answer", "Question 2": "Answer", ... }
    const headers = questionDefs.map((q) => q.text ?? `Question ${q.id}`);
    const rows = data.map((submission) => {
      const row: Record<string, string> = {};
      questionDefs.forEach((q, idx) => {
        const ans = (submission.answers ?? []).find((a) => a?.questionId === q.id);
        row[headers[idx]] = (ans?.fieldOption?.text ?? ans?.value ?? "—") as string;
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows, { header: headers });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  return (
    <div className="p-2 mt-4">
      {/* Toolbar */}
      <div className="mb-3 flex items-center justify-end">
        <Button
          onClick={handleExportExcel}
          className="bg-[var(--brand-orange-500)] hover:opacity-90"
        >
          Export to Excel
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-left font-semibold">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-neutral-50/60">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 align-top">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
