import { Search as SearchIcon, X } from 'lucide-react';
import { forwardRef, useMemo } from 'react';
import { useSearchShortcutState } from '@/shared/hooks/useKeyboardState';
import { useModifierKey } from '@/shared/hooks/usePlatform';
import { Kbd } from '@/shared/ui/Kbd';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  'data-testid'?: string;
  showShortcut?: boolean;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ value, onChange, placeholder, className = '', 'data-testid': dataTestId, showShortcut = true }, ref) => {
    const modifierKey = useModifierKey();
    const { isModifierPressed, isShiftPressed, isKPressed } = useSearchShortcutState();

    const shortcutKeys = useMemo(() => {
      if (!showShortcut) return null;
      // Hide shortcut when there's a value (to make room for clear button)
      if (value) return null;
      return (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 gap-1">
          <Kbd active={isModifierPressed}>{modifierKey}</Kbd>
          <span className="text-fgColor-secondary text-xs">+</span>
          <Kbd active={isShiftPressed}>shift</Kbd>
          <span className="text-fgColor-secondary text-xs">+</span>
          <Kbd active={isKPressed}>k</Kbd>
        </div>
      );
    }, [modifierKey, showShortcut, value, isModifierPressed, isShiftPressed, isKPressed]);

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
          ref={ref}
          type="text"
          value={value}
        />
        {shortcutKeys}
        {value && (
          <button
            aria-label="Clear search"
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-fgColor-secondary hover:text-fgColor-primary z-10"
            onClick={() => onChange('')}
            type="button"
          >
            <X size={24} />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';
