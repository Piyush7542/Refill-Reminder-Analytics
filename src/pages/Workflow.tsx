import { GitBranch, Database, Code, Brain, Bell, Send, CheckCircle, AlertTriangle, Zap, Clock, ArrowRight } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { WorkflowDiagram } from '@/components/workflow/WorkflowDiagram';
import type { WorkflowStep } from '@/types';

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'extract',
    name: 'Extract',
    description: 'Pull raw order data from PostgreSQL / data lake',
    input: 'Orders, Customers, Medicines tables',
    output: 'Raw CSV/Parquet files (50k+ rows)',
    tools: ['PostgreSQL', 'dbt', 'Airflow'],
    status: 'completed',
    duration_ms: 45000,
  },
  {
    id: 'validate',
    name: 'Validate',
    description: 'Check for duplicates, missing values, schema compliance',
    input: 'Raw extracted data',
    output: 'Clean dataset + validation report',
    tools: ['Great Expectations', 'Pandas'],
    status: 'completed',
    duration_ms: 12000,
  },
  {
    id: 'clean',
    name: 'Clean',
    description: 'Handle missing values, standardize categories, remove test orders',
    input: 'Validated data',
    output: 'Cleaned dataset (98%+ retention)',
    tools: ['Pandas', 'Custom rules'],
    status: 'completed',
    duration_ms: 8000,
  },
  {
    id: 'feature_engineer',
    name: 'Feature Engineer',
    description: 'Calculate consumption rates, refill intervals, RFM scores',
    input: 'Cleaned orders per customer-medicine',
    output: 'Feature matrix (2,000 customers × 500 meds)',
    tools: ['Pandas', 'NumPy', 'Scikit-learn'],
    status: 'completed',
    duration_ms: 25000,
  },
  {
    id: 'train_model',
    name: 'Train Model',
    description: 'Fit median baseline per customer-medicine; compute confidence',
    input: 'Feature matrix + historical outcomes',
    output: 'Trained model + predictions + confidence scores',
    tools: ['Custom Python', 'NumPy'],
    status: 'completed',
    duration_ms: 5000,
  },
  {
    id: 'evaluate',
    name: 'Evaluate',
    description: 'Holdout test: MAE, RMSE, within-7-days accuracy by segment',
    input: 'Model predictions vs actuals',
    output: 'Accuracy report + drift monitoring config',
    tools: ['Scikit-learn', 'Custom metrics'],
    status: 'completed',
    duration_ms: 3000,
  },
  {
    id: 'predict',
    name: 'Batch Predict',
    description: 'Generate reorder dates for all active prescriptions',
    input: 'Latest cleaned data + trained model',
    output: 'Predictions table (customer_id, med_id, pred_date, confidence)',
    tools: ['Python', 'PostgreSQL'],
    status: 'running',
    duration_ms: 15000,
  },
  {
    id: 'reminder_eligibility',
    name: 'Reminder Logic',
    description: 'Flag customers with days_remaining ≤ 7; assign channel & priority',
    input: 'Predictions + customer segments',
    output: 'Actionable reminder worklist',
    tools: ['Python', 'Business rules'],
    status: 'pending',
    duration_ms: 2000,
  },
  {
    id: 'crm_integration',
    name: 'CRM Push',
    description: 'Send reminder worklist to CRM for SMS/Email/Call automation',
    input: 'Reminder worklist',
    output: 'CRM campaigns triggered',
    tools: ['API', 'CRM (Salesforce/HubSpot)', 'Airflow'],
    status: 'pending',
    duration_ms: 10000,
  },
];

export function Workflow() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();

  const completedCount = WORKFLOW_STEPS.filter(s => s.status === 'completed').length;
  const runningCount = WORKFLOW_STEPS.filter(s => s.status === 'running').length;
  const pendingCount = WORKFLOW_STEPS.filter(s => s.status === 'pending').length;
  const totalDuration = WORKFLOW_STEPS.reduce((sum, s) => sum + (s.duration_ms || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">ETL & ML Pipeline</h1>
          <p className="text-neutral-600 mt-1">
            End-to-end data pipeline: Raw orders → Clean features → Baseline model → Predictions → Reminders → CRM
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Pipeline Status */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <KPICard label="Completed" value={completedCount} format="number" icon={<CheckCircle className="w-8 h-8 text-green-600" />} />
        <KPICard label="Running" value={runningCount} format="number" icon={<Zap className="w-8 h-8 text-primary-600 animate-pulse" />} />
        <KPICard label="Pending" value={pendingCount} format="number" icon={<Clock className="w-8 h-8 text-amber-600" />} />
        <KPICard label="Est. Total Time" value={Math.round(totalDuration / 1000)} format="days" description="seconds" icon={<ArrowRight className="w-8 h-8" />} />
      </div>

      {/* Visual Pipeline */}
      <WorkflowDiagram steps={WORKFLOW_STEPS} title="Daily Batch Pipeline (Runs 2 AM IST)" />

      {/* Step Details */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Step Details</h2>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="p-4 bg-neutral-50 rounded-lg flex items-center gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-primary-100 text-primary-600 font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className="font-medium text-neutral-900">{step.name}</h4>
                    <span className={
                      step.status === 'completed' ? 'badge badge-success' :
                      step.status === 'running' ? 'badge badge-primary animate-pulse' :
                      step.status === 'pending' ? 'badge badge-warning' : 'badge badge-danger'
                    }>
                      {step.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">{step.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {step.tools.map((tool, i) => (
                      <span key={i} className="px-2 py-0.5 text-xs bg-white text-neutral-600 rounded border">{tool}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right text-sm text-neutral-500 flex-shrink-0 w-32">
                  {step.duration_ms && (
                    <div>
                      <span className="font-medium">{step.duration_ms < 1000 ? `${step.duration_ms}ms` : `${(step.duration_ms / 1000).toFixed(1)}s`}</span>
                      <div className="text-xs">duration</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Data Flow</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            {[
              { from: 'PostgreSQL\n(Orders, Customers,\nMedicines)', to: 'Raw CSV\n(Extract)', tools: 'dbt, Airflow' },
              { from: 'Raw CSV', to: 'Validated &\nCleaned Data', tools: 'Great Expectations,\nPandas' },
              { from: 'Cleaned Data', to: 'Feature Matrix\n(Consumption, RFM)', tools: 'Pandas, NumPy' },
              { from: 'Feature Matrix', to: 'Baseline Model\n(Median Heuristic)', tools: 'Custom Python' },
              { from: 'Model', to: 'Predictions Table\n(pred_date, confidence)', tools: 'Python, PostgreSQL' },
              { from: 'Predictions', to: 'Reminder\nWorklist', tools: 'Business Rules' },
              { from: 'Worklist', to: 'CRM\n(SMS/Email/Call)', tools: 'API, Airflow' },
            ].map((flow, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="flex-1 text-right p-4 bg-neutral-50 rounded-lg">
                  <p className="font-medium text-neutral-900">{flow.from}</p>
                  <p className="text-xs text-neutral-500">{flow.tools}</p>
                </div>
                <ArrowRight className="w-8 h-8 text-primary-500 flex-shrink-0" />
                <div className="flex-1 p-4 bg-primary-50 rounded-lg">
                  <p className="font-medium text-primary-700">{flow.to}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              title="Validation Catches 2% Bad Rows"
              description="Great Expectations catches duplicate orders, future dates, negative quantities. Prevents garbage-in-garbage-out."
              icon={<Database className="w-5 h-5" />}
              type="finding"
              metric="Rejection Rate"
              value="2%"
            />
            <InsightCard
              title="Feature Engineering = 80% of Value"
              description="Consumption rate calculation and median interval logic drive accuracy. Model training is trivial once features are right."
              icon={<Brain className="w-5 h-5" />}
              type="success"
              metric="FE Impact"
              value="80%"
            />
            <InsightCard
              title="Daily Batch = Fresh Predictions"
              description="Pipeline runs at 2 AM, predictions available by 6 AM for morning reminder batch. Latency < 4 hours end-to-end."
              icon={<Zap className="w-5 h-5" />}
              type="opportunity"
              metric="Latency"
              value="< 4 hrs"
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Recommendations</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <RecommendationCard
              title="Automate Full Pipeline with Airflow"
              description="Schedule daily DAG with retries, SLAs, and alerts. Current manual steps: model retrain (weekly) and CRM push (daily)."
              priority="high"
              effort="medium"
              impact="high"
              related_page="Workflow"
            />
            <RecommendationCard
              title="Add Data Quality Dashboard"
              description="Track row counts, null rates, duplicate rates per table daily. Alert on >5% deviation from baseline."
              priority="medium"
              effort="low"
              impact="medium"
              related_page="Workflow"
            />
            <RecommendationCard
              title="Model Retrain Trigger on Drift"
              description="Monitor MAE weekly. If MAE increases >0.5 days, auto-trigger retrain with latest 90 days data."
              priority="medium"
              effort="medium"
              impact="high"
              related_page="Accuracy Metrics"
            />
            <RecommendationCard
              title="Real-Time Prediction API"
              description="Move from batch to streaming for new orders. When order placed, instantly update prediction for that customer-medicine."
              priority="low"
              effort="high"
              impact="high"
              related_page="Workflow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
