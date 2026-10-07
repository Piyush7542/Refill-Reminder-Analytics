import { ShoppingCart, Search, Filter, X, Download } from 'lucide-react';
import { useState } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { CustomerTable } from '@/components/dashboard/CustomerTable';
import { useCustomerData } from '@/hooks/useCustomerData';
import { formatNumber } from '@/utils/formatters';

export function CustomerOrders() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { customers, customerMedicines, filteredMedicines, loading, error } = useCustomerData(filters);
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <p className="text-red-600">Error loading data: {error}</p>
      </div>
    );
  }

  // Apply search filter
  const searchFiltered = filteredMedicines.filter(med => 
    med.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Customer Orders & Prescriptions</h1>
          <p className="text-neutral-600 mt-1">
            Browse and search all active customer-medicine prescriptions with prediction status
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Search medicine name or category..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Advanced Filters
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Prescriptions ({searchFiltered.length} of {customerMedicines.length})</h2>
        </div>
        <div className="card-body">
          <CustomerTable data={searchFiltered} />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card p-6">
          <p className="text-sm text-neutral-500">Unique Medicines</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {new Set(customerMedicines.map(m => m.medicine_id)).size}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-neutral-500">Categories</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {new Set(customerMedicines.map(m => m.category)).size}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-neutral-500">Avg Orders per Prescription</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {(customerMedicines.reduce((sum, m) => sum + m.total_orders, 0) / customerMedicines.length).toFixed(1)}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-neutral-500">Customers with Multiple Meds</p>
          <p className="text-3xl font-bold text-neutral-900 mt-1">
            {new Set(customerMedicines.filter((m, i, arr) => arr.findIndex(x => x.customer_id === m.customer_id) !== i).map(m => m.customer_id)).size}
          </p>
        </div>
      </div>
    </div>
  );
}
