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

type FieldOption = InferSelectModel<typeof fieldOptionsTable>;

type Answer = InferSelectModel<typeof answersTable> & {
  fieldOption?: FieldOption | null;
};

type Question = InferSelectModel<typeof questionsTable> & {
  fieldOptions: FieldOption[];
};

type FormSubmission = InferSelectModel<typeof formSubmissionsTable> & {
  answers: Answer[];
};

export type Form =
  | (InferSelectModel<typeof forms> & {
      questions: Question[];
      submissions: FormSubmission[];
    })
  | undefined;

interface TableProps {
  data: FormSubmission[];
  columns: Question[];
}

const columnHelper = createColumnHelper<any>();

export function Table({ data, columns: questionDefs }: TableProps) {
  // Build columns (id + one column per question)
  const columns = React.useMemo(
  () =>
    questionDefs.map((question) =>
      columnHelper.accessor(
        (row: FormSubmission) => {
          const ans = (row.answers ?? []).find(a => a?.questionId === question.id);
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

  return (
    <div className="p-2 mt-4">
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
