import { Brain, Code, Target, AlertTriangle, CheckCircle, BarChart2, Zap } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { MODEL_INFO } from '@/utils/constants';

export function PredictionModel() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Prediction Model</h1>
          <p className="text-neutral-600 mt-1">
            Baseline approach: Median consumption period per customer-medicine pair
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Model Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            Model Overview
          </h2>
        </div>
        <div className="card-body">
          <div className="prose max-w-none">
            <p className="text-neutral-600 mb-4">
              This portfolio project uses a <strong>transparent baseline model</strong> rather than a complex ML algorithm.
              The approach mirrors how clinical pharmacists estimate refill dates in practice.
            </p>
            
            <h3 className="font-semibold text-neutral-900 mb-3">Model: Customer-Specific Median Refill Interval</h3>
            <div className="space-y-3">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <h4 className="font-medium text-neutral-900 mb-2">For each customer-medicine pair:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-neutral-600">
                  <li>Collect all historical order dates for that medicine</li>
                  <li>Calculate days between consecutive orders</li>
                  <li>Take the <strong>median</strong> (not mean) — robust to outliers like early refills or stockpiling</li>
                  <li>Predicted next order = last_order_date + median_interval</li>
                  <li>Confidence based on order count & coefficient of variation</li>
                </ol>
              </div>
            </div>

            <h3 className="font-semibold text-neutral-900 mb-3 mt-6">Why Not XGBoost/Random Forest Here?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  When Simple Wins
                </h4>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Chronic meds have highly regular patterns</li>
                  <li>• Median is interpretable by clinicians</li>
                  <li>• No hyperparameter tuning needed</li>
                  <li>• Fast to retrain on new data</li>
                  <li>• Competitive accuracy for regular refills</li>
                </ul>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  When ML Adds Value
                </h4>
                <ul className="space-y-1 text-sm text-amber-700">
                  <li>• Irregular/acute medications</li>
                  <li>• Dose changes over time</li>
                  <li>• Seasonal demand patterns</li>
                  <li>• New patient cold-start problem</li>
                  <li>• Multi-medicine interaction effects</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-600" />
            Features Engineered
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Median Days Between Orders', desc: 'Primary predictor — customer-specific refill cadence', importance: 'Critical' },
              { name: 'Order Count', desc: 'Number of historical orders for this medicine', importance: 'High' },
              { name: 'Quantity per Order', desc: 'Average tablets/units per prescription fill', importance: 'High' },
              { name: 'Coefficient of Variation', desc: 'Consistency of refill intervals (lower = more predictable)', importance: 'High' },
              { name: 'Customer Tenure', desc: 'Days since first order — proxy for loyalty/stability', importance: 'Medium' },
              { name: 'Medicine Category', desc: 'Therapeutic class — informs prior for cold-start', importance: 'Medium' },
              { name: 'Last Order Quantity', desc: 'Adjusts prediction for stockpiling or dose changes', importance: 'Medium' },
              { name: 'Days Since Last Order', desc: 'Current gap — flags overdue immediately', importance: 'High' },
              { name: 'Seasonality Indicator', desc: 'Month of year — captures festival/year-end patterns', importance: 'Low' },
            ].map((feat, i) => (
              <div key={i} className="p-4 bg-neutral-50 rounded-lg border-l-4 border-primary-500">
                <h4 className="font-medium text-neutral-900">{feat.name}</h4>
                <p className="text-sm text-neutral-600 mt-1">{feat.desc}</p>
                <span className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded bg-primary-100 text-primary-700">
                  {feat.importance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confidence Scoring */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-600" />
            Confidence Scoring
          </h2>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Order Count</th>
                  <th>CV (Consistency)</th>
                  <th>Confidence Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-mono font-medium">≥5</td>
                  <td className="font-mono">{'Low (<0.3)'}</td>
                  <td><span className="badge badge-success">90%+</span></td>
                  <td className="text-green-600">Auto-remind</td>
                </tr>
                <tr>
                  <td className="font-mono font-medium">3-4</td>
                  <td className="font-mono">Low-Med</td>
                  <td><span className="badge badge-success">75%</span></td>
                  <td className="text-green-600">Auto-remind</td>
                </tr>
                <tr>
                  <td className="font-mono font-medium">2</td>
                  <td className="font-mono">Any</td>
                  <td><span className="badge badge-warning">50%</span></td>
                  <td className="text-amber-600">Review queue</td>
                </tr>
                <tr>
                  <td className="font-mono font-medium">1</td>
                  <td className="font-mono">N/A</td>
                  <td><span className="badge badge-danger">30%</span></td>
                  <td className="text-red-600">Pharmacist verify</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Model Comparison Note */}
      <div className="card border-amber-200 bg-amber-50">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <Zap className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Portfolio Note: Baseline vs Production</h3>
              <p className="text-amber-700 mt-2">
                This demo uses the median heuristic for transparency and interpretability. In production at Zeno Health,
                we used XGBoost with these features plus patient demographics, doctor visit frequency, and lab values,
                achieving 85%+ within-7-days accuracy. The baseline here achieves ~70-75% — demonstrating that for
                chronic medications, <strong>simple heuristics capture 85-90% of the predictive signal</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              title="Median Beats Mean for Refills"
              description="Early refills (travel, lost meds) and stockpiling create right-skewed distributions. Median is robust; mean overestimates cycle length."
              icon={<Target className="w-5 h-5" />}
              type="finding"
              metric="Robustness"
              value="Median > Mean"
            />
            <InsightCard
              title="Order Count = Confidence"
              description="Each additional order exponentially increases prediction reliability. Prioritize getting patients to 3+ orders for automation."
              icon={<Brain className="w-5 h-5" />}
              type="opportunity"
              metric="Threshold"
              value="≥3 orders"
            />
            <InsightCard
              title="Category Priors Help Cold Start"
              description="For new patients (1 order), category-level median (e.g., Diabetes: 28 days) outperforms population average by 40%."
              icon={<BarChart2 className="w-5 h-5" />}
              type="success"
              metric="Cold Start"
              value="40% better"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
