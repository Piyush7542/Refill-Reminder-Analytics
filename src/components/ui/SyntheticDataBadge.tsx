import { AlertTriangle, Info } from 'lucide-react';

export function SyntheticDataBadge() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg shadow-lg animate-slide-up" role="status" aria-live="polite">
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" aria-hidden="true" />
      <span className="text-sm font-medium text-red-800">SYNTHETIC DATA — PORTFOLIO DEMO</span>
      <Info className="w-4 h-4 text-red-500 cursor-help" aria-label="This project uses synthetic data for demonstration purposes only" />
    </div>
  );
}

export function InlineSyntheticBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-full">
      <AlertTriangle className="w-3.5 h-3.5 text-red-600" aria-hidden="true" />
      <span className="text-xs font-medium text-red-800">SYNTHETIC DATA — PORTFOLIO DEMO</span>
    </span>
  );
}