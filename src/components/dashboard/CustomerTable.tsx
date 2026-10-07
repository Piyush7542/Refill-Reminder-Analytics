import { cn } from '../../utils/cn';
import type { CustomerMedicineSummary } from '../../types';
import { formatDate, getDaysRemainingClass, getReminderStatusBadge } from '../../utils/formatters';
import { Badge } from '../ui/Badge';

interface CustomerTableProps {
  data: CustomerMedicineSummary[];
  loading?: boolean;
  onRowClick?: (row: CustomerMedicineSummary) => void;
}

export function CustomerTable({ data, loading = false, onRowClick }: CustomerTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="card p-8 text-center">
        <p className="text-neutral-500">No customer medicine data available</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="w-40">Customer</th>
              <th>Medicine</th>
              <th className="text-center">Last Order</th>
              <th className="text-center">Predicted Reorder</th>
              <th className="text-center">Days Remaining</th>
              <th className="text-center">Status</th>
              <th className="text-center">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 50).map((row) => (
              <tr 
                key={`${row.customer_id}-${row.medicine_id}`}
                className={cn(onRowClick && 'cursor-pointer hover:bg-neutral-50')}
                onClick={() => onRowClick?.(row)}
              >
                <td className="font-medium max-w-[200px] truncate">{row.medicine_name}</td>
                <td className="text-neutral-600 max-w-[200px] truncate">{row.category}</td>
                <td className="text-center text-sm text-neutral-600">{formatDate(row.last_order_date)}</td>
                <td className="text-center text-sm text-neutral-600">{formatDate(row.predicted_reorder_date)}</td>
                <td className="text-center">
                  <span className={cn('font-mono font-medium', getDaysRemainingClass(row.days_remaining))}>
                    {row.days_remaining >= 0 ? row.days_remaining : `${row.days_remaining} (Overdue)`}
                  </span>
                </td>
                <td className="text-center">
                  <Badge variant={row.reminder_status === 'Overdue' ? 'danger' : row.reminder_status === 'Due Soon' ? 'warning' : row.reminder_status === 'Sent' ? 'success' : 'neutral'}>
                    {row.reminder_status}
                  </Badge>
                </td>
                <td className="text-center text-sm text-neutral-600">
                  {(row.confidence_score * 100).toFixed(0)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 50 && (
        <div className="card-body text-center text-sm text-neutral-500">
          Showing 50 of {data.length} records. Use filters to narrow results.
        </div>
      )}
    </div>
  );
}