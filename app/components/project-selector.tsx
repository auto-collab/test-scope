"use client";

import Select from "react-select";

type Option = { value: string; label: string };

interface ProjectSelectorProps {
  options: Option[];
  onSelect: (selectedOption: Option | null) => void;
  isLoading?: boolean;
}

export default function ProjectSelector({ options, onSelect, isLoading }: ProjectSelectorProps) {
  const customStyles = {
    control: (provided: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...provided,
      minHeight: '42px',
      border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        border: '1px solid #9ca3af'
      }
    }),
    placeholder: (provided: Record<string, unknown>) => ({
      ...provided,
      color: '#9ca3af'
    }),
    option: (provided: Record<string, unknown>, state: { isSelected: boolean; isFocused: boolean }) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#3b82f6' 
        : state.isFocused 
        ? '#f3f4f6' 
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:hover': {
        backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6'
      }
    })
  };

  return (
    <div>
      <Select
        id="project-selector"
        styles={customStyles}
        options={options}
        placeholder={isLoading ? "Loading applications..." : "Select an application"}
        onChange={onSelect}
        isDisabled={isLoading}
        isLoading={isLoading}
        isClearable
        isSearchable
        noOptionsMessage={() => "No applications found"}
      />
    </div>
  );
}
