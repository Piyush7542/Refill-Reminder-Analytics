import { cn } from '../../utils/cn';
import { CheckCircle, Loader2, XCircle, Clock } from 'lucide-react';
import type { WorkflowStep } from '../../types';

interface PipelineStepProps {
  step: WorkflowStep;
  index: number;
  isLast: boolean;
}

const STATUS_ICONS = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle,
  failed: XCircle,
};

const STATUS_COLORS = {
  pending: 'text-neutral-400',
  running: 'text-primary-500 animate-spin',
  completed: 'text-green-500',
  failed: 'text-red-500',
};

const STATUS_BG = {
  pending: 'bg-neutral-100',
  running: 'bg-primary-100',
  completed: 'bg-green-100',
  failed: 'bg-red-100',
};

export function PipelineStep({ step, index, isLast }: PipelineStepProps) {
  const Icon = STATUS_ICONS[step.status];

  return (
    <div className="flex flex-col items-center relative">
      {/* Step Circle */}
      <div className={cn('relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4', STATUS_BG[step.status])}>
        <Icon className={cn('w-6 h-6', STATUS_COLORS[step.status])} />
      </div>

      {/* Step Label */}
      <div className="mt-3 text-center w-40">
        <h4 className="font-medium text-sm text-neutral-900">{step.name}</h4>
        <p className="text-xs text-neutral-500 mt-1">{step.description}</p>
      </div>

      {/* Tools */}
      <div className="mt-2 flex flex-wrap justify-center gap-1">
        {step.tools.map((tool, i) => (
          <span key={i} className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-600 rounded">
            {tool}
          </span>
        ))}
      </div>

      {/* Duration */}
      {step.duration_ms && (
        <div className="mt-2 text-xs text-neutral-500">
          {step.duration_ms < 1000 
            ? `${step.duration_ms}ms` 
            : `${(step.duration_ms / 1000).toFixed(1)}s`}
        </div>
      )}

      {/* Connector Line */}
      {!isLast && (
        <div className="absolute left-1/2 top-28 w-0.5 h-16 bg-neutral-200 -translate-x-1/2" />
      )}
    </div>
  );
}