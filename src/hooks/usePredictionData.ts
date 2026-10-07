import { useState, useEffect } from 'react';
import type { PredictionAccuracy } from '../types';

export function usePredictionData() {
  const [accuracy, setAccuracy] = useState<PredictionAccuracy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch('/data/prediction-accuracy.json');
        if (!res.ok) throw new Error('Failed to load prediction accuracy data');
        const data = await res.json();
        setAccuracy(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { accuracy, loading, error };
}