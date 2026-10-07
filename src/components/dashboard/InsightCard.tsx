import { cn } from '../../utils/cn';

interface InsightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'finding' | 'opportunity' | 'risk' | 'success';
  metric?: string;
  value?: string;
}

const TYPE_STYLES = {
  finding: 'insight-finding',
  opportunity: 'insight-opportunity',
  risk: 'insight-risk',
  success: 'insight-success',
};

const TYPE_ICONS = {
  finding: 'text-primary-600',
  opportunity: 'text-amber-600',
  risk: 'text-red-600',
  success: 'text-green-600',
};

export function InsightCard({ title, description, icon, type, metric, value }: InsightCardProps) {
  return (
    <div className={cn('insight-card', TYPE_STYLES[type])}>
      <div className="flex items-start gap-3">
        <div className={cn('flex-shrink-0 p-2 rounded-lg', TYPE_ICONS[type])}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
          {metric && value && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-neutral-500">{metric}:</span>
              <span className="text-sm font-semibold text-neutral-900">{value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}