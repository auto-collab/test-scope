"use client";

import MetricBox from "./components/metric-box";
import ProjectSelector from "./components/project-selector";

export default function Dashboard() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Test Results Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <div className="mb-6 col-span-1 sm:col-span-3">
          <ProjectSelector
            options={[
              { value: "application1", label: "Application 1" },
              { value: "application2", label: "Application 2" },
              { value: "application3", label: "Application 3" },
            ]}
          />
        </div>
        <div className="flex gap-4 justify-center col-span-1 sm:col-span-9">
          <MetricBox title="Test metric 1" value="Fail" />
          <MetricBox title="Test metric 2" value="30%" />
          <MetricBox title="Test metric 3" value="45%" />
          <MetricBox title="Test metric 4" value="60%" />
        </div>
      </div>
    </>
  );
}
