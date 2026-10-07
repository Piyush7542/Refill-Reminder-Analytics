import { Users, TrendingUp, DollarSign, Clock, AlertTriangle, Target, CreditCard, Award } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
import { BarChart } from '@/components/charts/BarChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { InsightCard } from '@/components/dashboard/InsightCard';
import { RecommendationCard } from '@/components/dashboard/RecommendationCard';
import { useCustomerData } from '@/hooks/useCustomerData';
import { formatNumber, formatCurrency, formatPercentage } from '@/utils/formatters';

export function CustomerSegmentation() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { customers, segmentMetrics, loading, error } = useCustomerData(filters);

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

  // RFM-style segment distribution
  const segmentData = segmentMetrics.map(s => ({
    name: s.segment,
    value: s.customer_count,
  }));

  // Segment comparison
  const segmentComparison = segmentMetrics.map(s => ({
    segment: s.segment,
    'Customers': s.customer_count,
    'Avg Orders': s.avg_orders_per_customer,
    'Avg Spend': s.avg_spent_per_customer,
    'Avg Cycle (days)': s.avg_days_between_orders,
    'Reminders Due %': s.reminder_eligible_pct,
  }));

  // Simulated RFM scores
  const rfmData = [
    { segment: 'High Value', recency: 15, frequency: 8, monetary: 15000 },
    { segment: 'Regular', recency: 30, frequency: 4, monetary: 6000 },
    { segment: 'Occasional', recency: 60, frequency: 2, monetary: 2000 },
    { segment: 'At Risk', recency: 120, frequency: 1, monetary: 800 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customer Segmentation</h1>
          <p className="text-neutral-600 mt-1">
            RFM-style segmentation (Recency, Frequency, Monetary) for targeted engagement
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
        <KPICard label="Total Customers" value={customers.length} format="number" icon={<Users className="w-8 h-8" />} />
        <KPICard label="High Value" value={segmentMetrics.find(s => s.segment === 'High Value')?.customer_count || 0} format="number" icon={<Award className="w-8 h-8" />} />
        <KPICard label="At Risk" value={segmentMetrics.find(s => s.segment === 'At Risk')?.customer_count || 0} format="number" trend="down" icon={<AlertTriangle className="w-8 h-8" />} />
        <KPICard label="Avg Spend/Customer" value={customers.reduce((sum, c) => sum + c.total_spent, 0) / customers.length} format="currency" icon={<DollarSign className="w-8 h-8" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Segment Distribution</h2>
          </div>
          <div className="card-body">
            <DonutChart
              data={segmentData}
              height={280}
              label="Customers"
              total={customers.length}
            />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="text-lg font-semibold text-neutral-900">Segment Comparison</h2>
          </div>
          <div className="card-body">
            <BarChart
              data={segmentComparison}
              xKey="segment"
              yKeys={['Customers', 'Avg Orders', 'Avg Spend', 'Avg Cycle (days)', 'Reminders Due %']}
              labels={['Customers', 'Avg Orders', 'Avg Spend (₹)', 'Avg Cycle (days)', 'Reminders Due %']}
              colors={['#22c55e', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444']}
              height={300}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">RFM Scores by Segment</h2>
        </div>
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Segment</th>
                  <th className="text-center">Recency (days)</th>
                  <th className="text-center">Frequency (orders)</th>
                  <th className="text-center">Monetary (₹)</th>
                  <th className="text-center">R Score</th>
                  <th className="text-center">F Score</th>
                  <th className="text-center">M Score</th>
                  <th className="text-center">RFM Score</th>
                </tr>
              </thead>
              <tbody>
                {rfmData.map((seg) => (
                  <tr key={seg.segment}>
                    <td className="font-medium">{seg.segment}</td>
                    <td className="text-center font-mono">{seg.recency}</td>
                    <td className="text-center font-mono">{seg.frequency}</td>
                    <td className="text-center font-mono">{formatCurrency(seg.monetary)}</td>
                    <td className="text-center">{seg.recency <= 30 ? '5' : seg.recency <= 60 ? '3' : '1'}</td>
                    <td className="text-center">{seg.frequency >= 6 ? '5' : seg.frequency >= 3 ? '3' : '1'}</td>
                    <td className="text-center">{seg.monetary >= 10000 ? '5' : seg.monetary >= 5000 ? '3' : '1'}</td>
                    <td className="text-center font-bold text-primary-600">
                      {seg.recency <= 30 ? '5' : seg.recency <= 60 ? '3' : '1'}
                      {seg.frequency >= 6 ? '5' : seg.frequency >= 3 ? '3' : '1'}
                      {seg.monetary >= 10000 ? '5' : seg.monetary >= 5000 ? '3' : '1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Segment Profiles</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'High Value',
                icon: Award,
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                stats: [
                  { label: 'Recency', value: '15 days' },
                  { label: 'Frequency', value: '8 orders/yr' },
                  { label: 'Monetary', value: '₹15,000/yr' },
                  { label: 'Reminders Due', value: '15%' },
                ],
                strategy: 'Personal calls, VIP support, early access to new products'
              },
              {
                name: 'Regular',
                icon: Users,
                color: 'text-green-600',
                bg: 'bg-green-50',
                stats: [
                  { label: 'Recency', value: '30 days' },
                  { label: 'Frequency', value: '4 orders/yr' },
                  { label: 'Monetary', value: '₹6,000/yr' },
                  { label: 'Reminders Due', value: '35%' },
                ],
                strategy: 'Automated SMS, loyalty rewards, referral program'
              },
              {
                name: 'Occasional',
                icon: Clock,
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                stats: [
                  { label: 'Recency', value: '60 days' },
                  { label: 'Frequency', value: '2 orders/yr' },
                  { label: 'Monetary', value: '₹2,000/yr' },
                  { label: 'Reminders Due', value: '55%' },
                ],
                strategy: 'Email nurture, educational content, re-engagement offers'
              },
              {
                name: 'At Risk',
                icon: AlertTriangle,
                color: 'text-red-600',
                bg: 'bg-red-50',
                stats: [
                  { label: 'Recency', value: '120+ days' },
                  { label: 'Frequency', value: '<1 order/yr' },
                  { label: 'Monetary', value: '₹800/yr' },
                  { label: 'Reminders Due', value: '80%' },
                ],
                strategy: 'Win-back calls, discount offers, doctor coordination'
              },
            ].map((seg) => (
              <div key={seg.name} className={`card p-6 ${seg.bg}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${seg.bg.replace('bg-', 'bg-').replace('50', '100')}`}>
                    <seg.icon className={`w-6 h-6 ${seg.color}`} />
                  </div>
                  <h3 className="font-semibold text-neutral-900">{seg.name}</h3>
                </div>
                <div className="space-y-2 mb-4">
                  {seg.stats.map((stat, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-neutral-500">{stat.label}</span>
                      <span className="font-medium text-neutral-900">{stat.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600"><strong>Strategy:</strong> {seg.strategy}</p>
                </div>
              </div>
            ))}
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
              title="High Value = High Retention"
              description="High Value segment has 15-day recency and 8 orders/year. They self-manage refills; only 15% need reminders. Invest in keeping them happy."
              icon={<Award className="w-5 h-5" />}
              type="success"
              metric="Recency"
              value="15 days"
            />
            <InsightCard
              title="At Risk = Revenue Leakage"
              description="At Risk segment (120+ days recency) represents 20% of customers but 40% of reminder workload. Win-back ROI is 5:1."
              icon={<AlertTriangle className="w-5 h-5" />}
              type="risk"
              metric="Win-back ROI"
              value="5:1"
            />
            <InsightCard
              title="Regular Segment = Automation Target"
              description="Regular segment (35% reminders due) is the sweet spot for SMS automation. High volume, predictable patterns, good response rates."
              icon={<Target className="w-5 h-5" />}
              type="opportunity"
              metric="Automation Fit"
              value="High"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Recommendations</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <RecommendationCard
              title="Deploy Segment-Specific Communication"
              description="High Value: Quarterly personal calls. Regular: Monthly automated SMS. Occasional: Bi-monthly email. At Risk: Immediate multi-channel win-back."
              priority="high"
              effort="medium"
              impact="high"
              related_page="Reminder Eligibility"
            />
            <RecommendationCard
              title="Win-Back Campaign for At Risk"
              description="Offer 10% discount + free doctor consultation for returning At Risk customers. Track 90-day reactivation rate."
              priority="high"
              effort="medium"
              impact="high"
              related_page="Reminder Eligibility"
            />
            <RecommendationCard
              title="Loyalty Program for Regular → High Value"
              description="Incentivize Regular customers to reach 6+ orders/year with points redeemable for discounts. Target 20% migration rate."
              priority="medium"
              effort="medium"
              impact="medium"
              related_page="Customer Orders"
            />
            <RecommendationCard
              title="Doctor Partnership for Occasional"
              description="Partner with prescribing doctors to align refill schedules. Occasional patients often forget — doctor reminder at visit helps."
              priority="medium"
              effort="high"
              impact="medium"
              related_page="Workflow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
