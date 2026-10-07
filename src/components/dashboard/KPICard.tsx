import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatNumber, formatPercentage, formatCurrency, formatDays, getTrendClass, getTrendIcon, getTrendLabel } from '../../utils/formatters';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'days' | 'raw';
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function KPICard({ 
  label, 
  value, 
  change, 
  trend, 
  format = 'number', 
  description, 
  icon,
  className = '' 
}: KPICardProps) {
  const trendClass = getTrendClass(change);
  const trendIcon = getTrendIcon(change);
  const trendLabel = getTrendLabel(change);

  let formattedValue: string;
  if (typeof value === 'number') {
    switch (format) {
      case 'percentage':
        formattedValue = formatPercentage(value);
        break;
      case 'currency':
        formattedValue = formatCurrency(value);
        break;
      case 'days':
        formattedValue = formatDays(value);
        break;
      case 'number':
        formattedValue = formatNumber(value);
        break;
      default:
        formattedValue = value.toString();
    }
  } else {
    formattedValue = value;
  }

  const TrendIcon = trendIcon === 'trending-up' ? TrendingUp : trendIcon === 'trending-down' ? TrendingDown : Minus;

  return (
    <div className={cn('kpi-card', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="kpi-label">{label}</p>
          <p className="kpi-value">{formattedValue}</p>
          {description && <p className="text-xs text-neutral-500 mt-1">{description}</p>}
        </div>
        {icon && <div className="text-neutral-300 ml-4 flex-shrink-0">{icon}</div>}
      </div>
      {(change !== undefined || trend !== undefined) && (
        <div className={cn('kpi-trend mt-3', `kpi-trend-${trendClass}`)}>
          <TrendIcon className="w-4 h-4" aria-hidden="true" />
          <span>{trendLabel} vs previous period</span>
        </div>
      )}
    </div>
  );
}