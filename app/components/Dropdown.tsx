import React from 'react';

type DropdownProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

export default function Dropdown({
  label,
  value,
  options,
  onChange,
}: DropdownProps) {
  return (
    <div className="flex flex-col gap-5">
      <label className="dropdown-label">{label}</label>
      <select
        className="dropdown-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled></option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
