import React from 'react';

type TestCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function TestCard({ title, children }: TestCardProps) {
  return (
    <div className="m-4 p-4 bg-gray-100 rounded-lg w-1/3">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="text-md font-medium text-gray-700">
        <div>{children}</div>
      </div>
    </div>
  );
}
