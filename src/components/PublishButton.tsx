'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import FormPublishSuccess from '@/forms/FormPublishSuccess'; // Adjust path if needed

type Props = {
  initialPublished: boolean;
  formId: number;
};

export default function PublishButton({ initialPublished, formId }: Props) {
  const [published, setPublished] = useState(initialPublished);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const togglePublish = async () => {
    setLoading(true);
    try {
      // Call your server action or API to publish the form
      await fetch(`/api/forms/${formId}/publish`, { method: 'POST' });
      setPublished(true);
      setSuccessOpen(true);
    } catch (error) {
      console.error('Failed to publish form:', error);
      alert('Failed to publish the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={togglePublish} disabled={loading}>
        {published ? 'Published' : 'Publish'}
      </Button>

      <FormPublishSuccess
        formId={formId}
        open={successOpen}
        onOpenChange={setSuccessOpen}
      />
    </>
  );
}
