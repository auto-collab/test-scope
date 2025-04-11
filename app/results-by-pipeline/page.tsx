'use client';

import { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';

export default function ResultsByPipelinePage() {
  const [applications, setApplications] = useState<string[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<string>('');

  useEffect(() => {
    setApplications(['App1', 'App2', 'App3']);
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Results by Pipeline</h1>
      <Dropdown
        label={''}
        value={selectedApplication}
        options={applications}
        onChange={(value) => setSelectedApplication(value)}
      />
    </main>
  );
}
