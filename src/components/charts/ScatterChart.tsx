import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '../../utils/cn';

interface ScatterChartProps {
  data: Array<{ x: number; y: number; name?: string; [key: string]: any }>;
  xKey: string;
  yKey: string;
  xLabel?: string;
  yLabel?: string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showGrid?: boolean;
  color?: string;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  // For regression line
  regressionLine?: { slope: number; intercept: number };
}

export function ScatterChart({
  data,
  xKey,
  yKey,
  xLabel,
  yLabel,
  height = 350,
  className = '',
  showLegend = true,
  showGrid = true,
  color = '#22c55e',
  formatX,
  formatY,
  regressionLine,
}: ScatterChartProps) {
  if (!data.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 bg-neutral-50 rounded-lg border border-neutral-200', className)}>
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  // Calculate bounds for regression line
  const xValues = data.map(d => d[xKey]);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />}
          <XAxis
            type="number"
            dataKey={xKey}
            tickFormatter={formatX || ((v: number) => v.toLocaleString())}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#737373' }}
            interval="preserveStartEnd"
            name={xLabel}
          />
          <YAxis
            type="number"
            tickFormatter={formatY || ((v: number) => v.toLocaleString())}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: '#737373' }}
            interval="preserveStartEnd"
            orientation="left"
            width={60}
            name={yLabel}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number, name: string) => [
              formatY ? formatY(value) : value.toLocaleString(),
              name,
            ]}
          />
          {showLegend && (
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: 20 }}
            />
          )}
          <Scatter
            name="Predictions"
            data={data}
            fill={color}
            stroke={color}
            shape="circle"
          />
          {regressionLine && (
            <>
              <line
                x1={xMin}
                y1={regressionLine.slope * xMin + regressionLine.intercept}
                x2={xMax}
                y2={regressionLine.slope * xMax + regressionLine.intercept}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            </>
          )}
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
}