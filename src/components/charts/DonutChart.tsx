import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../utils/cn';

interface DonutChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
  height?: number;
  className?: string;
  showLegend?: boolean;
  colors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  formatValue?: (value: number) => string;
  label?: string;
  total?: number;
}

const DEFAULT_COLORS = ['#22c55e', '#f59e0b', '#64748b', '#3b82f6', '#ef4444', '#8b5cf6'];

export function DonutChart({
  data,
  height = 280,
  className = '',
  showLegend = true,
  colors = DEFAULT_COLORS,
  innerRadius = 70,
  outerRadius = 100,
  formatValue,
  label,
  total,
}: DonutChartProps) {
  if (!data.length || data.every(d => d.value === 0)) {
    return (
      <div className={cn('flex items-center justify-center', className)} style={{ height }}>
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  const computedTotal = total ?? data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={cn('w-full relative', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number, name: string) => [
              formatValue ? formatValue(value) : value.toLocaleString(),
              name,
            ]}
          />
          {showLegend && (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="square"
              wrapperStyle={{ paddingRight: 20 }}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
      
      {(label || total !== undefined) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {total !== undefined && (
            <div className="text-center">
              <div className="text-3xl font-bold text-neutral-900">
                {formatValue ? formatValue(computedTotal) : computedTotal.toLocaleString()}
              </div>
              {label && <div className="text-sm text-neutral-500 mt-1">{label}</div>}
            </div>
          )}
          {label && !total && (
            <div className="text-center text-sm text-neutral-500">{label}</div>
          )}
        </div>
      )}
    </div>
  );
}