import React from 'react';
import '../styles/dropdown.css';

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
    <div className="dropdown">
      <label className="dropdown-label">
        {label}
        <select
          className="dropdown-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option: string) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
