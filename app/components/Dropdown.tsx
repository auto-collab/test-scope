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
    <div className="m-4 p-4 bg-gray-100 rounded-lg">
      <label className="text-md font-medium text-gray-700">{label}</label>
      <select
        className="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm text-gray-900 shadow-lg"
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
