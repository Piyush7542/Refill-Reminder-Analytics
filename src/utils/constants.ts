// Application constants

export const APP_NAME = 'Refill Reminder Analytics';
export const APP_TAGLINE = 'Predictive Analytics Portfolio Project';
export const SYNTHETIC_BADGE = 'SYNTHETIC DATA — PORTFOLIO DEMO';

export const PAGES = [
  { id: 'executive', label: 'Executive Summary', icon: 'layout-dashboard' },
  { id: 'orders', label: 'Customer Orders', icon: 'shopping-cart' },
  { id: 'consumption', label: 'Consumption Estimation', icon: 'calculator' },
  { id: 'model', label: 'Prediction Model', icon: 'brain' },
  { id: 'predictions', label: 'Reorder Predictions', icon: 'calendar-clock' },
  { id: 'reminders', label: 'Reminder Eligibility', icon: 'bell' },
  { id: 'accuracy', label: 'Accuracy Metrics', icon: 'target' },
  { id: 'segmentation', label: 'Customer Segmentation', icon: 'users' },
  { id: 'workflow', label: 'ETL & ML Pipeline', icon: 'git-branch' },
  { id: 'about', label: 'About This Project', icon: 'info' },
] as const;

export const DEFAULT_FILTERS = {
  dateRange: { start: '2024-01-01', end: '2024-12-31' },
  segments: [] as string[],
  categories: [] as string[],
  cities: [] as string[],
  reminderStatuses: [] as string[],
};

export const SEGMENTS = ['High Value', 'Regular', 'Occasional', 'At Risk'];
export const REMINDER_STATUSES = ['Not Due', 'Due Soon', 'Overdue', 'Sent'];
export const CATEGORIES = ['Diabetes', 'Hypertension', 'Cardiac', 'Thyroid', 'Respiratory', 'Neurology', 'Gastroenterology', 'Vitamins'];
export const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];
export const STATES = ['Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'West Bengal', 'Gujarat'];

export const MODEL_INFO = {
  type: 'Baseline: Median Consumption Period',
  description: 'Uses customer-specific median days between orders per medicine. Simple, interpretable, and effective for regular medications.',
  whyNotXGBoost: 'For portfolio demo: baseline is transparent, requires no hyperparameter tuning, matches clinical workflow (clinical pharmacists use similar heuristics), and achieves competitive accuracy for chronic medications with regular refill patterns.',
  features: [
    'Customer-medicine order frequency',
    'Median days between orders',
    'Quantity per order',
    'Customer tenure',
    'Medicine category',
  ],
};