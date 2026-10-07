import { useState, useRef, useEffect } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { FilterState } from '../../types';
import { SEGMENTS, REMINDER_STATUSES, CATEGORIES, CITIES } from '../../utils/constants';

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export function FilterBar({ filters, onChange, onReset, hasActiveFilters }: FilterBarProps) {
  const [openFilters, setOpenFilters] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenFilters(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMultiSelectChange = (
    key: keyof FilterState,
    value: string,
    currentArray: string[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(v => v !== value)
      : [...currentArray, value];
    onChange({ ...filters, [key]: newArray });
  };

  const renderDropdown = (label: string, key: 'segments' | 'categories' | 'cities' | 'reminderStatuses', options: string[]) => (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          'flex items-center gap-2 px-3 py-2 text-sm border rounded-lg bg-white',
          filters[key].length > 0
            ? 'border-primary-300 text-primary-700 bg-primary-50'
            : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
        )}
        onClick={() => setOpenFilters(openFilters === key ? null : key)}
        aria-expanded={openFilters === key}
        aria-haspopup="listbox"
      >
        <Filter className="w-4 h-4" />
        <span>{label}</span>
        {filters[key].length > 0 && (
          <span className="text-xs font-medium px-1.5 py-0.5 bg-primary-100 text-primary-700 rounded">
            {filters[key].length}
          </span>
        )}
        <ChevronDown className={cn('w-4 h-4 transition-transform', openFilters === key && 'rotate-180')} />
      </button>

      {openFilters === key && (
        <div className="absolute z-50 mt-1 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg py-1">
          <div className="px-3 py-2 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 uppercase">Select {label.toLowerCase()}</span>
            {filters[key].length > 0 && (
              <button
                type="button"
                onClick={() => onChange({ ...filters, [key]: [] })}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-60 overflow-y-auto">
            {options.map(option => (
              <label
                key={option}
                className="flex items-center px-3 py-2 hover:bg-neutral-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters[key].includes(option)}
                  onChange={() => handleMultiSelectChange(key, option, filters[key])}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-neutral-700">{option}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white border-b border-neutral-200">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <label htmlFor="date-start" className="text-sm text-neutral-500 whitespace-nowrap">From</label>
          <input
            id="date-start"
            type="date"
            value={filters.dateRange.start}
            onChange={e => onChange({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
            className="input w-40"
          />
          <label htmlFor="date-end" className="text-sm text-neutral-500 whitespace-nowrap">To</label>
          <input
            id="date-end"
            type="date"
            value={filters.dateRange.end}
            onChange={e => onChange({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
            className="input w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          {renderDropdown('Segments', 'segments', SEGMENTS)}
          {renderDropdown('Categories', 'categories', CATEGORIES)}
          {renderDropdown('Cities', 'cities', CITIES)}
          {renderDropdown('Reminder Status', 'reminderStatuses', ['Not Due', 'Due Soon', 'Overdue', 'Sent'])}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary flex items-center gap-2"
          aria-label="Clear all filters"
        >
          <X className="w-4 h-4" />
          <span>Clear Filters</span>
        </button>
      )}
    </div>
  );
}