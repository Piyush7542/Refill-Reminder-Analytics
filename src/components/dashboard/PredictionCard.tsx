import { Calendar, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { CustomerMedicineSummary } from '../../types';
import { formatDate, getDaysRemainingClass } from '../../utils/formatters';

interface PredictionCardProps {
  prediction: CustomerMedicineSummary;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const isOverdue = prediction.days_remaining < 0;
  const isDueSoon = prediction.days_remaining <= 7 && prediction.days_remaining >= 0;
  const isHealthy = prediction.days_remaining > 14;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{prediction.medicine_name}</h3>
          <p className="text-sm text-neutral-500 mt-1">{prediction.category} • {prediction.last_order_quantity} tablets</p>
        </div>
        <div className={cn('text-2xl font-bold', getDaysRemainingClass(prediction.days_remaining))}>
          {prediction.days_remaining >= 0 ? `${prediction.days_remaining} days` : `${Math.abs(prediction.days_remaining)} days overdue`}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar className="w-4 h-4" />
            <span>Last Order</span>
          </div>
          <p className="font-medium text-neutral-900 mt-1">{formatDate(prediction.last_order_date)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar className="w-4 h-4" />
            <span>Predicted Reorder</span>
          </div>
          <p className="font-medium text-primary-600 mt-1">{formatDate(prediction.predicted_reorder_date)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <TrendingUp className="w-4 h-4" />
            <span>Confidence</span>
          </div>
          <p className="font-medium text-neutral-900 mt-1">{(prediction.confidence_score * 100).toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 p-4 bg-neutral-50 rounded-lg">
        {isOverdue && (
          <>
            <AlertCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 font-medium">Overdue - Immediate action needed</span>
          </>
        )}
        {isDueSoon && !isOverdue && (
          <>
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-amber-700 font-medium">Due soon - Schedule reminder</span>
          </>
        )}
        {isHealthy && (
          <>
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">On track - No action needed</span>
          </>
        )}
      </div>

      <div className="mt-4 text-xs text-neutral-500">
        <span className="font-medium">Avg consumption:</span> {prediction.estimated_consumption_per_day.toFixed(2)} units/day •
        <span className="font-medium mx-2">Avg cycle:</span> {prediction.avg_days_between_orders.toFixed(0)} days •
        <span className="font-medium mx-2">Orders:</span> {prediction.total_orders}
      </div>
    </div>
  );
}