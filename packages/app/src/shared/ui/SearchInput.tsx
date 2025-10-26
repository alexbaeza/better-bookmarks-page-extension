import { Search as SearchIcon, X } from 'lucide-react';
import type React from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder, className = '', 'data-testid': dataTestId }) => {
  return (
    <div className={`relative mx-auto w-full max-w-xl ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-fgColor-secondary">
        <SearchIcon size={24} />
      </div>
      <input
        className="
          w-full rounded-xl bg-bgColor-secondary
          px-12 py-5 text-xl text-fgColor-primary transition-shadow
          placeholder:text-fgColor-secondary focus:outline-none
          focus:ring-4 focus:ring-fgColor-accent
        "
        data-testid={dataTestId}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {value && (
        <button
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-fgColor-secondary hover:text-fgColor-primary"
          onClick={() => onChange('')}
          type="button"
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
};
