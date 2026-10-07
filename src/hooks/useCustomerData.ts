import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Customer, CustomerMedicineSummary, SegmentMetrics, FilterState } from '../types';

interface CustomerData {
  customers: Customer[];
  customerMedicines: CustomerMedicineSummary[];
  segmentMetrics: SegmentMetrics[];
  loading: boolean;
  error: string | null;
  filteredMedicines: CustomerMedicineSummary[];
}

export function useCustomerData(filters: FilterState): CustomerData {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerMedicines, setCustomerMedicines] = useState<CustomerMedicineSummary[]>([]);
  const [segmentMetrics, setSegmentMetrics] = useState<SegmentMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [customersRes, medicinesRes, segmentsRes] = await Promise.all([
        fetch('/data/customer-summary.json'),
        fetch('/data/reminder-eligibility.json'),
        fetch('/data/cohort-analysis.json'),
      ]);
      
      if (!customersRes.ok || !medicinesRes.ok || !segmentsRes.ok) {
        throw new Error('Failed to load data');
      }
      
      const customersData = await customersRes.json() as Customer[];
      const medicinesData = await medicinesRes.json() as CustomerMedicineSummary[];
      const segmentsData = await segmentsRes.json() as SegmentMetrics[];
      
      // Enrich medicines with customer data (city, segment, state)
      const customerMap = new Map(customersData.map(c => [c.customer_id, c]));
      const enrichedMedicines = medicinesData.map(med => {
        const customer = customerMap.get(med.customer_id);
        return {
          ...med,
          city: customer?.city || '',
          state: customer?.state || '',
          segment: customer?.segment || '',
        };
      });
      
      setCustomers(customersData);
      setCustomerMedicines(enrichedMedicines);
      setSegmentMetrics(segmentsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Apply filters to customer medicines
  const filteredMedicines = useMemo(() => {
    return customerMedicines.filter(med => {
      // Filter by segment
      if (filters.segments.length > 0 && med.segment && !filters.segments.includes(med.segment)) {
        return false;
      }
      // Filter by city
      if (filters.cities.length > 0 && med.city && !filters.cities.includes(med.city)) {
        return false;
      }
      // Filter by category
      if (filters.categories.length > 0 && med.category && !filters.categories.includes(med.category)) {
        return false;
      }
      // Filter by reminder status
      if (filters.reminderStatuses.length > 0 && !filters.reminderStatuses.includes(med.reminder_status)) {
        return false;
      }
      return true;
    });
  }, [customerMedicines, filters]);

  return {
    customers,
    customerMedicines,
    segmentMetrics,
    filteredMedicines,
    loading,
    error,
  };
}