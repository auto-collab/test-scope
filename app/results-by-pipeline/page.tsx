'use client';

import { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';

export default function ResultsByPipelinePage() {
  const [apps, setApps] = useState(['App1', 'App2']);
  const [selectedApp, setSelectedApp] = useState('');

  return (
    <main className="p-6" key="results-page">
      <h1 className="text-2xl font-bold">Pipeline Results</h1>
      <Dropdown
        label="App"
        options={apps}
        value={selectedApp}
        onChange={(v) => setSelectedApp(v)}
      />
    </main>
  );
}
