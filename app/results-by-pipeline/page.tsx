'use client';

import { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';

export default function ResultsByPipelinePage() {
  const [apps, setApps] = useState(['App1', 'App2']);
  const [selectedApp, setSelectedApp] = useState('');

  return (
    <main>
      <div className="flex justify-left">
        <Dropdown
          label="Select an application"
          options={apps}
          value={selectedApp}
          onChange={(v) => setSelectedApp(v)}
        />
      </div>
    </main>
  );
}
