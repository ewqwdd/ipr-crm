import { useState, useRef, useEffect } from 'react';

interface AutocompleteProps {
  options: string[];
  value?: string | null;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  loading?: boolean;
  placeholder?: string;
}

export default function Autocomplete({
  options,
  value,
  onChange,
  label,
  className,
  loading,
  placeholder,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes((value || '').toLowerCase()),
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        inputRef.current &&
        !inputRef.current.parentElement?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={`relative ${className || ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        value={value || ''}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        disabled={loading}
        placeholder={loading ? 'Загрузка...' : placeholder}
      />
      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 sm:text-sm">
          {filtered.map((opt, index) => (
            <li
              key={index}
              className={`cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white ${
                value === opt ? 'font-semibold text-indigo-600' : ''
              }`}
              onMouseDown={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
              {value === opt && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                  ✓
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
