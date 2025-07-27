"use client";

import Select from "react-select";

type Option = { value: string; label: string };

interface ProjectSelectorProps {
  options: Option[];
}

export default function ProjectSelector({ options }: ProjectSelectorProps) {
  return (
    <div>
      <Select
        id="project-selector"
        className="p-2 rounded"
        options={options}
        placeholder="Select an application"
      />
    </div>
  );
}
