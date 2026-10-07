import { Bell, Send, Phone, Mail, AlertTriangle, CheckCircle, Clock, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useFilters } from '@/hooks/useFilters';
import { FilterBar } from '@/components/ui/FilterBar';
import { KPICard } from '@/components/dashboard/KPICard';
{/* InsightCard, RecommendationCard */}
import { useCustomerData } from '@/hooks/useCustomerData';
import { formatNumber, formatPercentage } from '@/utils/formatters';
import { Badge } from '@/components/ui/Badge';

export function ReminderEligibility() {
  const { filters, hasActiveFilters, resetFilters } = useFilters();
  const { customerMedicines, filteredMedicines, loading, error } = useCustomerData(filters);
  const [selectedChannel, setSelectedChannel] = useState<'all' | 'SMS' | 'Email' | 'Push' | 'Call'>('all');
  const [showSent, setShowSent] = useState(false);

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

  // Filter for actionable reminders
  let actionable = filteredMedicines.filter(m => 
    m.reminder_status === 'Due Soon' || m.reminder_status === 'Overdue'
  );
  
  if (!showSent) {
    actionable = actionable.filter(m => m.reminder_status !== 'Sent');
  }
  
  if (selectedChannel !== 'all') {
    actionable = actionable.filter(m => m.contact_method === selectedChannel);
  }

  // Sort by urgency
  actionable.sort((a, b) => a.days_remaining - b.days_remaining);

  // Stats
  const totalDue = filteredMedicines.filter(m => m.reminder_status === 'Due Soon' || m.reminder_status === 'Overdue').length;
  const overdue = filteredMedicines.filter(m => m.reminder_status === 'Overdue').length;
  const dueSoon = filteredMedicines.filter(m => m.reminder_status === 'Due Soon').length;
  const sent = filteredMedicines.filter(m => m.reminder_status === 'Sent').length;
  const highPriority = actionable.filter(m => m.priority === 'High').length;
  const byChannel = {
    SMS: actionable.filter(m => m.contact_method === 'SMS').length,
    Email: actionable.filter(m => m.contact_method === 'Email').length,
    Push: actionable.filter(m => m.contact_method === 'Push').length,
    Call: actionable.filter(m => m.contact_method === 'Call').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Reminder Eligibility</h1>
          <p className="text-neutral-600 mt-1">
            Customers due for refill reminders — actionable worklist for engagement teams
          </p>
        </div>
        <FilterBar
          filters={filters}
          onChange={useFilters().setFilters}
          onReset={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
        <KPICard label="Total Due" value={totalDue} format="number" icon={<Bell className="w-8 h-8" />} />
        <KPICard label="Overdue" value={overdue} format="number" trend="down" icon={<AlertTriangle className="w-8 h-8" />} />
        <KPICard label="Due Soon" value={dueSoon} format="number" icon={<Clock className="w-8 h-8" />} />
        <KPICard label="High Priority" value={highPriority} format="number" icon={<Users className="w-8 h-8" />} />
        <KPICard label="Already Sent" value={sent} format="number" icon={<Send className="w-8 h-8" />} />
      </div>

      {/* Channel Breakdown */}
      <div className="card mb-6">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Contact Channel Distribution</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{byChannel.SMS}</p>
              <p className="text-sm text-neutral-500">SMS</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">{byChannel.Email}</p>
              <p className="text-sm text-neutral-500">Email</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{byChannel.Push}</p>
              <p className="text-sm text-neutral-500">Push</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">{byChannel.Call}</p>
              <p className="text-sm text-neutral-500">Call</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-4 bg-neutral-50 rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-700">Channel:</label>
          <select 
            value={selectedChannel}
            onChange={e => setSelectedChannel(e.target.value as any)}
            className="select w-32"
          >
            <option value="all">All Channels</option>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
            <option value="Push">Push</option>
            <option value="Call">Call</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
          <input
            type="checkbox"
            checked={showSent}
            onChange={e => setShowSent(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          Show already sent
        </label>
        <span className="text-sm text-neutral-500 ml-auto">
          {actionable.length} actionable reminders
        </span>
      </div>

      {/* Actionable List */}
      <div className="card">
        <div className="card-header flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Actionable Reminders ({actionable.length})</h2>
          <div className="flex items-center gap-2">
            <button className="btn-secondary flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Call All High Priority
            </button>
            <button className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send SMS Batch ({byChannel.SMS})
            </button>
          </div>
        </div>
        <div className="card-body">
          {actionable.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
              <p className="text-neutral-500 mt-4">All caught up! No pending reminders.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Medicine</th>
                    <th className="text-center">Days Remaining</th>
                    <th className="text-center">Priority</th>
                    <th className="text-center">Channel</th>
                    <th className="text-center">Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {actionable.slice(0, 50).map((reminder) => (
                    <tr key={`${reminder.customer_id}-${reminder.medicine_id}`}>
                      <td className="font-medium">{reminder.customer_name}</td>
                      <td className="max-w-[200px] truncate">{reminder.medicine_name}</td>
                      <td className="text-center">
                        <span className={reminder.days_remaining < 0 ? 'text-red-600 font-bold' : 'text-amber-600 font-bold'}>
                          {reminder.days_remaining >= 0 ? reminder.days_remaining : Math.abs(reminder.days_remaining)} {reminder.days_remaining >= 0 ? 'days' : 'overdue'}
                        </span>
                      </td>
                      <td className="text-center">
                        <Badge variant={reminder.priority === 'High' ? 'danger' : reminder.priority === 'Medium' ? 'warning' : 'success'}>
                          {reminder.priority}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge variant={
                          reminder.contact_method === 'SMS' ? 'success' :
                          reminder.contact_method === 'Email' ? 'primary' :
                          reminder.contact_method === 'Push' ? 'warning' : 'neutral'
                        }>
                          {reminder.contact_method}
                        </Badge>
                      </td>
                      <td className="text-center">
                        <Badge variant={reminder.reminder_status === 'Overdue' ? 'danger' : 'warning'}>
                          {reminder.reminder_status}
                        </Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="btn-ghost p-1" title="Send SMS">
                            <Send className="w-4 h-4" />
                          </button>
                          <button className="btn-ghost p-1" title="Call">
                            <Phone className="w-4 h-4" />
                          </button>
                          <button className="btn-ghost p-1" title="Mark Sent">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {actionable.length > 50 && (
            <div className="mt-4 text-center text-sm text-neutral-500">
              Showing 50 of {actionable.length} reminders. Use filters to narrow.
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900">Key Insights</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Overdue Requires Calls
              </h4>
              <p className="text-sm text-red-700 mt-2">
                {'SMS alone has <10% response for overdue. Phone calls by pharmacists achieve 40%+ conversion.'}
              </p>
            </div>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Batch SMS for Due Soon
              </h4>
              <p className="text-sm text-green-700 mt-2">
                Automate 85%+ of due-soon reminders via SMS template. Schedule 3 days before predicted date.
              </p>
            </div>
            <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h4 className="font-medium text-primary-800 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Segment by Value
              </h4>
              <p className="text-sm text-primary-700 mt-2">
                High-value customers get personal calls. Regular get SMS. At-risk get multi-channel + offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
