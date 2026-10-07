import { cn } from '../../utils/cn';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function Tabs({ tabs, activeTab, onChange, className = '', variant = 'underline' }: TabsProps) {
  const baseStyles = 'flex gap-1';
  
  const variantStyles = {
    default: 'bg-neutral-100 rounded-lg p-1',
    pills: '',
    underline: 'border-b border-neutral-200',
  };

  const tabStyles = {
    default: 'px-4 py-2 rounded-md text-sm font-medium transition-all',
    pills: 'px-4 py-2 rounded-lg text-sm font-medium transition-all',
    underline: 'px-4 py-3 border-b-2 border-transparent text-sm font-medium transition-all -mb-px',
  };

  const activeStyles = {
    default: 'bg-white text-primary-600 shadow-sm',
    pills: 'bg-primary-100 text-primary-700',
    underline: 'text-primary-600 border-primary-600',
  };

  const inactiveStyles = {
    default: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200',
    pills: 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100',
    underline: 'text-neutral-500 hover:text-neutral-700 hover:border-neutral-300',
  };

  return (
    <div className={cn(baseStyles, variantStyles[variant], className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          id={`tab-${tab.id}`}
          onClick={() => !tab.disabled && onChange(tab.id)}
          disabled={tab.disabled}
          className={cn(
            tabStyles[variant],
            activeTab === tab.id ? activeStyles[variant] : inactiveStyles[variant],
            tab.disabled && 'opacity-50 cursor-not-allowed',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded'
          )}
        >
          {tab.icon && <span className="inline-flex items-center gap-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  );
}