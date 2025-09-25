import React from 'react';
import { getUserForms } from '@/app/actions/getUserForms';
import FormsPicker from '@/(admin)/results/FormsPicker';
// Use the ResultsDisplay as a base, swap in the Analytics display
import AnalyticsDisplay from '@/[locale]/analytics/AnalyticsDisplay'; 
const AnalyticsPage = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  const userForms = await getUserForms();
  if (!userForms?.length) return <div>No forms found</div>;

  const selectOptions = userForms.map(form => ({
    label: form.name,
    value: form.id
  }));
  const selectedFormId = searchParams?.formId ? parseInt(searchParams.formId as string) : userForms[0].id;

  return (
    <div>
      <FormsPicker options={selectOptions} />
      <AnalyticsDisplay formId={selectedFormId} />
    </div>
  );
};

export default AnalyticsPage;
