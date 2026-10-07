import type { WorkflowStep } from '../../types';
import { PipelineStep } from './PipelineStep';

interface WorkflowDiagramProps {
  steps: WorkflowStep[];
  title?: string;
}

export function WorkflowDiagram({ steps, title = 'ETL & ML Pipeline' }: WorkflowDiagramProps) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6 text-center">{title}</h3>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex items-start gap-8 min-w-max px-4">
          {steps.map((step, index) => (
            <PipelineStep
              key={step.id}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-500" />
          <span className="text-neutral-600">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-primary-100 border-2 border-primary-500 animate-pulse" />
          <span className="text-neutral-600">Running</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-neutral-100 border-2 border-neutral-400" />
          <span className="text-neutral-600">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-500" />
          <span className="text-neutral-600">Failed</span>
        </div>
      </div>
    </div>
  );
}