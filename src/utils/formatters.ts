// Formatting utilities

export function formatNumber(value: number, decimals = 0): string {
  if (value >= 1e9) return (value / 1e9).toFixed(decimals) + 'B';
  if (value >= 1e6) return (value / 1e6).toFixed(decimals) + 'M';
  if (value >= 1e3) return (value / 1e3).toFixed(decimals) + 'K';
  return value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDays(value: number): string {
  return `${value} days`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getTrendClass(change: number | undefined): 'up' | 'down' | 'neutral' {
  if (change === undefined) return 'neutral';
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

export function getTrendIcon(change: number | undefined): string {
  if (change === undefined) return 'minus';
  if (change > 0) return 'trending-up';
  if (change < 0) return 'trending-down';
  return 'minus';
}

export function getTrendLabel(change: number | undefined): string {
  if (change === undefined) return '—';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

export function getDaysRemainingClass(days: number): string {
  if (days < 0) return 'text-red-600 font-medium';
  if (days <= 3) return 'text-red-600 font-medium';
  if (days <= 7) return 'text-amber-600 font-medium';
  if (days <= 14) return 'text-blue-600';
  return 'text-green-600';
}

export function getReminderStatusBadge(status: string): string {
  const badges: Record<string, string> = {
    'Not Due': 'badge-neutral',
    'Due Soon': 'badge-warning',
    'Overdue': 'badge-danger',
    'Sent': 'badge-success',
  };
  return badges[status] || 'badge-neutral';
}