// src/app/[locale]/forms/[formId]/analytics/charts.tsx
'use client';

import useSWR from 'swr';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend
} from 'recharts';

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const COLORS = ['#ff7900', '#ffa64d', '#ffc799', '#ffd9bf', '#ffe8d9', '#fff4ec'];

export default function Charts({ formId }: { formId: number }) {
  // ⬇️ Use singular "form" to match your existing API route
  const { data, error, isLoading } = useSWR(`/api/form/${formId}/stats`, fetcher);

  if (isLoading) return <div>Loading…</div>;
  if (error || !data) return <div>Failed to load</div>;

  const { stats, questions } = data as {
    stats: Record<number, Record<string, number>>;
    questions: Array<{ id: number; text: string; fieldType: string }>;
  };

  if (!questions?.length) {
    return <div className="text-sm text-gray-600">No questions found for this form.</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {questions.map((q) => {
        const rows = Object.entries(stats[q.id] ?? {}).map(([name, value]) => ({
          name,
          value: Number(value) || 0
        }));

        const isMany = rows.length > 5;
        const isChoice =
          q.fieldType === 'RadioGroup' || q.fieldType === 'Select' || q.fieldType === 'Switch';

        return (
          <Card key={q.id}>
            <CardHeader>
              <CardTitle className="text-base">{q.text}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {rows.length === 0 ? (
                    <BarChart data={[{ name: 'No data', value: 0 }]}>
                      <XAxis dataKey="name" hide />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  ) : isChoice ? (
                    isMany ? (
                      <BarChart data={rows}>
                        <XAxis dataKey="name" hide={rows.length > 10} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" />
                      </BarChart>
                    ) : (
                      <PieChart>
                        <Pie data={rows} dataKey="value" nameKey="name" outerRadius={90} label>
                          {rows.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    )
                  ) : (
                    <BarChart data={rows}>
                      <XAxis dataKey="name" hide />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
