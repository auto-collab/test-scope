"use client";

import Select from "react-select";

type Option = { value: string; label: string };

interface ProjectSelectorProps {
  options: Option[];
}

export default function ProjectSelector({ options }: ProjectSelectorProps) {
  // const options = [
  //   {
  //     value: "project1",
  //     label: "Project 1",
  //   },
  //   {
  //     value: "project2",
  //     label: "Project 2",
  //   },
  //   {
  //     value: "project3",
  //     label: "Project 3",
  //   },
  // ];

  return (
    <div>
      <Select
        id="project-selector"
        className="p-2 border rounded"
        options={options}
        placeholder="Select a project"
      />
    </div>
  );
}
