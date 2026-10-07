import { CalendarClock, TrendingUp, Target, AlertTriangle, Search, Filter, X, Download, Eye } from 'lucide-react';
import { useState } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { PredictionCard } from '@/components/dashboard/PredictionCard';
import { useCustomerData } from '@/hooks/useCustomerData';
import { formatNumber } from '@/utils/formatters';

export function ReorderPredictions() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { customerMedicines, filteredMedicines, loading, error } = useCustomerData(filters);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">Error loading data: {error}</p>
      </div>
    );
  }

  // Apply search filter
  const searchFiltered = filteredMedicines.filter(med => 
    med.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort by days remaining (most urgent first)
  const sorted = [...searchFiltered].sort((a, b) => a.days_remaining - b.days_remaining);

  // Stats
  const overdue = sorted.filter(m => m.days_remaining < 0).length;
  const dueSoon = sorted.filter(m => m.days_remaining >= 0 && m.days_remaining <= 7).length;
  const onTrack = sorted.filter(m => m.days_remaining > 7).length;
  const avgConfidence = sorted.reduce((sum, m) => sum + m.confidence_score, 0) / sorted.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reorder Predictions</h1>
          <p className="text-neutral-600 mt-1">
            Predicted reorder dates for all active customer-medicine prescriptions
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search medicine name or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="card p-6 border-l-4 border-red-500">
          <p className="text-sm text-neutral-500">Overdue</p>
          <p className="text-3xl font-bold text-red-600 mt-1">{overdue}</p>
        </div>
        <div className="card p-6 border-l-4 border-amber-500">
          <p className="text-sm text-neutral-500">Due Soon (0-7 days)</p>
          <p className="text-3xl font-bold text-amber-600 mt-1">{dueSoon}</p>
        </div>
        <div className="card p-6 border-l-4 border-green-500">
          <p className="text-sm text-neutral-500">{'On Track (>7 days)'}</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{onTrack}</p>
        </div>
        <div className="card p-6 border-l-4 border-primary-500">
          <p className="text-sm text-neutral-500">Avg Confidence</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">{(avgConfidence * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Prediction Cards Grid */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Predictions ({sorted.length})</h2>
        </div>
        <div className="card-body">
          {selectedPrediction && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary-800">Selected Prediction Detail</h3>
                <button onClick={() => setSelectedPrediction(null)} className="text-primary-600 hover:text-primary-800">Close ×</button>
              </div>
              <PredictionCard prediction={selectedPrediction} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.slice(0, 30).map((prediction) => (
              <div
                key={`${prediction.customer_id}-${prediction.medicine_id}`}
                className="card p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPrediction(prediction)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 truncate">{prediction.medicine_name}</h4>
                    <p className="text-xs text-neutral-500 mt-1">{prediction.category} • {prediction.total_orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: prediction.days_remaining < 0 ? '#ef4444' : prediction.days_remaining <= 7 ? '#f59e0b' : '#22c55e' }}>
                      {prediction.days_remaining >= 0 ? prediction.days_remaining : Math.abs(prediction.days_remaining)} {prediction.days_remaining >= 0 ? 'days' : 'overdue'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {(prediction.confidence_score * 100).toFixed(0)}% conf
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                  <span>Last: {prediction.last_order_date}</span>
                  <span>Predicted: {prediction.predicted_reorder_date}</span>
                </div>
              </div>
            ))}
          </div>
          
          {sorted.length > 30 && (
            <div className="mt-6 text-center text-sm text-neutral-500">
              Showing 30 of {sorted.length} predictions. Use filters to narrow results.
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {overdue} Overdue
              </h4>
              <p className="text-sm text-red-700 mt-2">
                These customers need immediate outreach. Prioritize high-value segments first.
              </p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-medium text-amber-800 flex items-center gap-2">
                <Target className="w-5 h-5" />
                {dueSoon} Due Soon
              </h4>
              <p className="text-sm text-amber-700 mt-2">
                Schedule automated SMS/Email reminders. Best sent 3-5 days before predicted date.
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {onTrack} On Track
              </h4>
              <p className="text-sm text-green-700 mt-2">
                No action needed. Monitor for pattern changes that might indicate issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
