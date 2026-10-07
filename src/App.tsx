import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { SyntheticDataBadge } from './components/ui/SyntheticDataBadge';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ExecutiveSummary } from './pages/ExecutiveSummary';
import { CustomerOrders } from './pages/CustomerOrders';
import { ConsumptionEstimation } from './pages/ConsumptionEstimation';
import { PredictionModel } from './pages/PredictionModel';
import { ReorderPredictions } from './pages/ReorderPredictions';
import { ReminderEligibility } from './pages/ReminderEligibility';
import { AccuracyMetrics } from './pages/AccuracyMetrics';
import { CustomerSegmentation } from './pages/CustomerSegmentation';
import { Workflow } from './pages/Workflow';
import { About } from './pages/About';
import { FilterProvider, useFilters } from './hooks/useFilters';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-neutral-50">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <Sidebar onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 lg:pl-64 transition-all duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
            <Outlet />
          </div>
        </main>
        
        <Footer />
        <SyntheticDataBadge />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <FilterProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ExecutiveSummary />} />
          <Route path="orders" element={<CustomerOrders />} />
          <Route path="consumption" element={<ConsumptionEstimation />} />
          <Route path="model" element={<PredictionModel />} />
          <Route path="predictions" element={<ReorderPredictions />} />
          <Route path="reminders" element={<ReminderEligibility />} />
          <Route path="accuracy" element={<AccuracyMetrics />} />
          <Route path="segmentation" element={<CustomerSegmentation />} />
          <Route path="workflow" element={<Workflow />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </FilterProvider>
  );
}

export default App;