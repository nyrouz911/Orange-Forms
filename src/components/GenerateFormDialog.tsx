'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FormGenerator from '@/form-generator/FormClient';

export default function GenerateFormDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="lg" className="px-6">
          Generate a form
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Describe your form</DialogTitle>
        </DialogHeader>

        {/* Your existing generator (textarea + logic) now lives inside the modal */}
        <div className="mt-2">
          <FormGenerator />
        </div>
      </DialogContent>
    </Dialog>
  );
}
