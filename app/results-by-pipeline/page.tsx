'use client';

import { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';

export default function ResultsByPipelinePage() {
  const [apps, setApps] = useState(['App1', 'App2']);
  const [selectedApp, setSelectedApp] = useState('');

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Results by Pipeline</h1>
      <div className="bg-white rounded-lg shadow p-4">
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

// 'use client';

// import { useState, useEffect } from 'react';
// import Dropdown from '../components/Dropdown';

// export default function ResultsByPipelinePage() {
//   const [apps, setApps] = useState(['App1', 'App2']);
//   const [selectedApp, setSelectedApp] = useState('');

//   return (
//     <main className="p-6" key="results-page">
//       <h1 className="text-3xl font-bold">Applications</h1>
//       <Dropdown
//         label="LAabl"
//         options={apps}
//         value={selectedApp}
//         onChange={(v) => setSelectedApp(v)}
//       />
//     </main>
//   );
// }
