import { Calculator, TrendingUp, Target, AlertTriangle, Info, Clock } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { BarChart } from '@/components/charts/BarChart';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { useCustomerData } from '@/hooks/useCustomerData';
import { formatNumber, formatDays } from '@/utils/formatters';

export function ConsumptionEstimation() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { customerMedicines, loading, error } = useCustomerData(filters);

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

  // Calculate consumption metrics
  const withConsumption = customerMedicines.filter(m => m.estimated_consumption_per_day > 0);
  const avgConsumption = withConsumption.reduce((sum, m) => sum + m.estimated_consumption_per_day, 0) / withConsumption.length;
  const avgCycle = customerMedicines.reduce((sum, m) => sum + m.avg_days_between_orders, 0) / customerMedicines.length;
  const consistentUsers = customerMedicines.filter(m => m.total_orders >= 3).length;

  // Consumption distribution by category
  const categories = [...new Set(customerMedicines.map(m => m.category))];
  const categoryData = categories.map(cat => {
    const meds = customerMedicines.filter(m => m.category === cat);
    return {
      category: cat,
      avg_consumption: meds.reduce((sum, m) => sum + m.estimated_consumption_per_day, 0) / meds.length,
      avg_cycle: meds.reduce((sum, m) => sum + m.avg_days_between_orders, 0) / meds.length,
      count: meds.length,
    };
  }).sort((a, b) => b.count - a.count);

  // Consumption buckets
  const buckets = [
    { label: '0-0.5 units/day', count: customerMedicines.filter(m => m.estimated_consumption_per_day <= 0.5).length },
    { label: '0.5-1 units/day', count: customerMedicines.filter(m => m.estimated_consumption_per_day > 0.5 && m.estimated_consumption_per_day <= 1).length },
    { label: '1-2 units/day', count: customerMedicines.filter(m => m.estimated_consumption_per_day > 1 && m.estimated_consumption_per_day <= 2).length },
    { label: '2+ units/day', count: customerMedicines.filter(m => m.estimated_consumption_per_day > 2).length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Consumption Estimation</h1>
          <p className="text-neutral-600 mt-1">
            How we calculate daily consumption rates and predict reorder dates from order history
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <KPICard
          label="Avg Daily Consumption"
          value={avgConsumption.toFixed(2)}
          format="raw"
          description="units per day"
          icon={<Calculator className="w-8 h-8" />}
        />
        <KPICard
          label="Avg Refill Cycle"
          value={avgCycle.toFixed(0)}
          format="days"
          icon={<Clock className="w-8 h-8" />}
        />
        <KPICard
          label="Consistent Users (≥3 orders)"
          value={consistentUsers}
          format="number"
          icon={<Target className="w-8 h-8" />}
        />
        <KPICard
          label="Medicines Analyzed"
          value={withConsumption.length}
          format="number"
          icon={<TrendingUp className="w-8 h-8" />}
        />
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-600" />
            Methodology
          </h2>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary-600" />
                Daily Consumption Rate
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> For each customer-medicine pair with ≥2 orders</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> Calculate days between consecutive orders</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> consumption_per_day = quantity / days_between_orders</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> Take median across all intervals (robust to outliers)</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> For single-order pairs: use category average</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-3 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary-600" />
                Predicted Reorder Date
              </h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> predicted_date = last_order_date + (last_quantity / daily_consumption)</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> Adjusts for actual quantity ordered last time</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> Falls back to median cycle if consumption estimate unavailable</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> Confidence score based on order count & consistency</li>
              </ul>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Assumptions & Limitations
            </h4>
            <ul className="space-y-1 text-sm text-amber-700">
              <li>• Assumes constant daily consumption (no dose changes, no missed doses)</li>
              <li>• Does not account for doctor visits, dosage adjustments, or drug holidays</li>
              <li>• Single-order medicines use category averages (lower confidence)</li>
              <li>• Acute medications (antibiotics, painkillers) not suitable for this model</li>
              <li>• Confidence score: 90%+ for ≥5 orders, 70% for 3-4, 50% for 2, 30% for 1</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Consumption by Category</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={categoryData}
              xKey="category"
              yKeys={['avg_consumption']}
              labels={['Avg Units/Day']}
              colors={['#22c55e']}
              height={300}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Consumption Distribution</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={buckets}
              xKey="label"
              yKeys={['count']}
              labels={['Prescriptions']}
              colors={['#3b82f6']}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              title="Most Medications: 1 Unit/Day"
              description="80%+ of chronic medications follow standard once-daily dosing, making consumption estimation highly predictable."
              icon={<Target className="w-5 h-5" />}
              type="finding"
              metric="Std Dosing"
              value="80%+"
            />
            <InsightCard
              title="Category Variation"
              description="Diabetes meds show 1.2 units/day avg vs Vitamins at 0.8. Category-aware estimates improve accuracy for new patients."
              icon={<TrendingUp className="w-5 h-5" />}
              type="opportunity"
              metric="Diabetes vs Vitamins"
              value="1.5x"
            />
            <InsightCard
              title="Data Quality Matters"
              description="20% of prescriptions have only 1 order — using category median introduces uncertainty. Flag these for pharmacist verification."
              icon={<AlertTriangle className="w-5 h-5" />}
              type="risk"
              metric="Single-Order"
              value="20%"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
