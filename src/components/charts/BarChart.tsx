import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { cn } from '../../utils/cn';

interface BarChartProps {
  data: any[];
  xKey: string;
  yKeys: string[];
  labels?: string[];
  colors?: string[];
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  formatY?: (value: number) => string;
  stacked?: boolean;
}

const DEFAULT_COLORS = ['#22c55e', '#f59e0b', '#64748b', '#3b82f6', '#ef4444', '#8b5cf6'];

export function BarChart({
  data,
  xKey,
  yKeys,
  labels,
  colors = DEFAULT_COLORS,
  height = 300,
  className = '',
  showLegend = true,
  showGrid = true,
  formatY,
  stacked = false,
}: BarChartProps) {
  if (!data.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 bg-neutral-50 rounded-lg border border-neutral-200', className)}>
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />}
          <XAxis
            type="number"
            tickFormatter={formatY || ((v: number) => v.toLocaleString())}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#737373' }}
            interval="preserveStartEnd"
          />
          <YAxis
            dataKey={xKey}
            type="category"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#525252' }}
            width={140}
            interval={0}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            labelFormatter={(value: string) => value}
            formatter={(value: number, name: string) => [
              formatY ? formatY(value) : value.toLocaleString(),
              labels?.[yKeys.indexOf(name)] || name,
            ]}
          />
          {showLegend && (
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="top"
              iconType="square"
              wrapperStyle={{ paddingTop: 20 }}
            />
          )}
          {yKeys.map((yKey, index) => (
            <Bar
              key={yKey}
              dataKey={yKey}
              stackId={stacked ? 'a' : undefined}
              fill={colors[index % colors.length]}
              radius={[0, 4, 4, 0]}
              maxBarSize={40}
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}