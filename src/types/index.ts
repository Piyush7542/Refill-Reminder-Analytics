// Core data types for Refill Reminder Analytics

export interface Customer {
  customer_id: string;
  customer_name: string;
  age: number;
  gender: 'Male' | 'Female';
  city: string;
  state: string;
  signup_date: string;
  segment: 'High Value' | 'Regular' | 'Occasional' | 'At Risk';
  total_orders: number;
  total_spent: number;
  avg_order_value: number;
  days_since_last_order: number;
}

export interface Medicine {
  medicine_id: string;
  medicine_name: string;
  category: string;
  standard_dosage: number;
  unit: string;
  avg_days_supply: number;
  unit_price: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  medicine_id: string;
  order_date: string;
  quantity: number;
  days_supply: number;
  price: number;
}

export interface CustomerMedicineSummary {
  customer_id: string;
  customer_name: string;
  medicine_id: string;
  medicine_name: string;
  category: string;
  total_orders: number;
  total_quantity: number;
  avg_days_between_orders: number;
  avg_quantity_per_order: number;
  last_order_date: string;
  last_order_quantity: number;
  last_order_days_supply: number;
  estimated_consumption_per_day: number;
  predicted_reorder_date: string;
  days_remaining: number;
  reminder_eligible: boolean;
  reminder_status: 'Not Due' | 'Due Soon' | 'Overdue' | 'Sent';
  confidence_score: number;
  priority: 'High' | 'Medium' | 'Low';
  contact_method: 'SMS' | 'Email' | 'Push' | 'Call';
  // Enriched fields from customer data
  city?: string;
  state?: string;
  segment?: string;
}

export interface PredictionAccuracy {
  mae: number;           // Mean Absolute Error (days)
  rmse: number;          // Root Mean Square Error (days)
  within_7_days_pct: number;  // % predictions within 7 days
  within_14_days_pct: number; // % predictions within 14 days
  total_predictions: number;
  model_type: string;
  training_samples: number;
  test_samples: number;
}

export interface ReminderEligibility {
  customer_id: string;
  customer_name: string;
  medicine_name: string;
  predicted_reorder_date: string;
  days_remaining: number;
  reminder_status: 'Not Due' | 'Due Soon' | 'Overdue' | 'Sent';
  priority: 'High' | 'Medium' | 'Low';
  contact_method: 'SMS' | 'Email' | 'Push' | 'Call';
}

export interface SegmentMetrics {
  segment: string;
  customer_count: number;
  avg_age: number;
  avg_orders_per_customer: number;
  avg_spent_per_customer: number;
  avg_days_between_orders: number;
  reminder_eligible_count: number;
  reminder_eligible_pct: number;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  input: string;
  output: string;
  tools: string[];
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration_ms?: number;
}

export interface KPICardData {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'days';
  description?: string;
  icon?: React.ReactNode;
}

export interface InsightCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'finding' | 'opportunity' | 'risk' | 'success';
  metric?: string;
  value?: string;
}

export interface RecommendationCard {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  impact: 'high' | 'medium' | 'low';
  related_page?: string;
}

export interface FilterState {
  dateRange: { start: string; end: string };
  segments: string[];
  categories: string[];
  cities: string[];
  reminderStatuses: string[];
}

export const SEGMENTS = ['High Value', 'Regular', 'Occasional', 'At Risk'];
export const REMINDER_STATUSES = ['Not Due', 'Due Soon', 'Overdue', 'Sent'];
export const CATEGORIES = ['Diabetes', 'Hypertension', 'Cardiac', 'Thyroid', 'Respiratory', 'Neurology', 'Gastroenterology', 'Vitamins'];
export const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
export const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat'];