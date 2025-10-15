import React from 'react';

interface TextareaProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
  label?: string;
  name?: string;
}

export default function Textarea({
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  rows = 4,
  className = '',
  label,
  name,
}: TextareaProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="font-semibold text-sm">
          {label}
          {required && <span className="text-kiwi-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        rows={rows}
        className="border-2 border-gray-300 px-4 py-3 focus:border-kiwi-500 focus:outline-none transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}

