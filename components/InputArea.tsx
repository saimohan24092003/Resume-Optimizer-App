import React from 'react';

interface InputAreaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  heightClass?: string;
  disabled?: boolean;
}

export const InputArea: React.FC<InputAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  heightClass = "h-40",
  disabled = false
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
        {label}
      </label>
      <textarea
        className={`w-full p-3 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none shadow-sm ${heightClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
};
