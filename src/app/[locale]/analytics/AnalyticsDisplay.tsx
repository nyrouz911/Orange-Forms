import Charts from '../forms/[formId]/analytics/charts';

export default function AnalyticsDisplay({ formId }: { formId: number }) {
  return <Charts formId={formId} />;
}
