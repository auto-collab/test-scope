"use client";

import ProjectSelector from "./components/project-selector";

export default function Dashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Test Results Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="mb-6 col-span-1 sm:col-span-3">
          <ProjectSelector />
        </div>
      </div>
    </div>
  );
}
