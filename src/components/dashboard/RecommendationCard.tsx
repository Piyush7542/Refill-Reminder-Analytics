import { cn } from '../../utils/cn';

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  related_page?: string;
}

const PRIORITY_STYLES = {
  high: 'bg-red-50 border-red-200 text-red-800',
  medium: 'bg-amber-50 border-amber-200 text-amber-800',
  low: 'bg-green-50 border-green-200 text-green-800',
};

const PRIORITY_LABELS = {
  high: 'High Priority',
  medium: 'Medium Priority',
  low: 'Low Priority',
};

const EFFORT_IMPACT_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function RecommendationCard({ title, description, priority, effort, impact, related_page }: RecommendationCardProps) {
  return (
    <div className="recommendation-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={cn('badge', PRIORITY_STYLES[priority])}>
              {PRIORITY_LABELS[priority]}
            </span>
            {related_page && (
              <span className="badge badge-neutral">Related: {related_page}</span>
            )}
          </div>
          <h4 className="font-medium text-neutral-900">{title}</h4>
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">Effort:</span>
            <span className={cn('badge badge-neutral', effort === 'high' && 'badge-warning', effort === 'low' && 'badge-success')}>
              {EFFORT_IMPACT_LABELS[effort]}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="font-medium text-neutral-700">Impact:</span>
            <span className={cn('badge badge-neutral', impact === 'high' && 'badge-success', impact === 'low' && 'badge-warning')}>
              {EFFORT_IMPACT_LABELS[impact]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}