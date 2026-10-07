import { Info, AlertTriangle, Github, ExternalLink, Database, Code, Brain, Users, Shield, Clock, Zap, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function About() {
  return (
    <div className="space-y-8 max-w-4xl">
      {/* Hero */}
      <div className="card p-8 md:p-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full mb-6">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-800">SYNTHETIC DATA — PORTFOLIO DEMO</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">Refill Reminder Analytics</h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          A predictive analytics portfolio project demonstrating medicine reorder prediction,
          ETL pipelines, customer segmentation, and proactive engagement using <strong>entirely synthetic data</strong>.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <Github className="w-4 h-4 mr-2" />
            View Source
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Demo
          </a>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card border-red-200 bg-red-50">
        <div className="card-body">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0" />
            <div>
              <h2 className="font-semibold text-red-800">Important Disclaimer</h2>
              <p className="text-red-700 mt-2">
                <strong>This project uses 100% synthetic data generated for portfolio demonstration purposes only.</strong>
                No real Zeno Health data, patient information, prescriptions, medical records, or proprietary
                business metrics are used, stored, or displayed in this application. All numbers, predictions,
                accuracy metrics, and visualizations are computed from artificially generated datasets designed to
                approximate the analytical patterns described in the resume project description.
              </p>
              <p className="text-red-700 mt-2">
                This project is a portfolio simulation and is not connected to any real healthcare/customer systems,
                databases, or analytics platforms. The methodology demonstrated here represents analytical approaches
                used in professional predictive analytics work, but the specific results are simulated.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary-600" />
            Project Overview
          </h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-neutral-600">
            This project recreates the <strong>Refill Reminder</strong> project from my resume (Zeno Health, 2023–2025)
            as an interactive portfolio dashboard. The original project built Python predictive models and ETL pipelines
            to forecast medicine reorder dates, integrated with CRM systems and Tableau dashboards to power
            personalized reminders and proactive customer engagement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Original Resume Context</h3>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Python predictive models for reorder dates</li>
                <li>• ETL pipelines for customer/order data</li>
                <li>• CRM integration for personalized reminders</li>
                <li>• Tableau dashboards for engagement tracking</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Key Resume Outcomes</h3>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Proactive customer engagement</li>
                <li>• Reduced stock-outs</li>
                <li>• Improved retention</li>
                <li>• Automated reminder workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            Methodology
          </h2>
        </div>
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Prediction Approach</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Baseline:</strong> Customer-specific median refill interval</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Features:</strong> Order frequency, quantity, consistency, tenure</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Confidence:</strong> Based on order count & coefficient of variation</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Why not XGBoost:</strong> Transparent, interpretable, matches clinical workflow</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">ETL Pipeline</h3>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Extract:</strong> PostgreSQL → CSV via dbt/Airflow</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Validate:</strong> Great Expectations (schema, duplicates, ranges)</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Clean:</strong> Standardize, handle missing, remove test data</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Feature Engineer:</strong> Consumption rates, RFM, refill intervals</li>
                <li className="flex items-center gap-2"><span className="w-2 h-2 bg-primary-500 rounded-full" /> <strong>Load:</strong> Predictions → CRM for automation</li>
              </ul>
            </div>
          </div>
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-2">Customer Segmentation (RFM-Style)</h3>
            <ul className="space-y-1 text-sm text-neutral-600">
              <li>• <strong>High Value:</strong> Recent, frequent, high spend — Personal engagement</li>
              <li>• <strong>Regular:</strong> Moderate recency/frequency — Automated SMS</li>
              <li>• <strong>Occasional:</strong> Low frequency — Email nurture</li>
              <li>• <strong>At Risk:</strong> Lapsed — Win-back campaigns</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Generation */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-primary-600" />
            Synthetic Data Generation
          </h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-neutral-600">
            All data is generated using Python scripts with controlled random seeds for reproducibility.
            The generation process creates realistic distributions that approximate real pharmacy patterns
            while ensuring no real data is ever used.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                Customers (2,000)
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 4 segments: High Value, Regular, Occasional, At Risk</li>
                <li>• Ages 18-85, realistic demographics</li>
                <li>• 8 major Indian cities</li>
                <li>• Signup dates: 2022-2024</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-600" />
                Medicines (500)
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 8 therapeutic categories</li>
                <li>• Standard dosages & pricing</li>
                <li>• Chronic vs acute classification</li>
                <li>• Realistic brand/generic names</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary-600" />
                Orders (50,000)
              </h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• 24-month history (2023-2024)</li>
                <li>• Realistic refill patterns</li>
                <li>• Seasonal variations</li>
                <li>• Stockpiling & early refill noise</li>
              </ul>
            </div>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Privacy & Safety
            </h4>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• Raw data in .gitignore — never committed</li>
              <li>• Only aggregated JSON deployed to Netlify</li>
              <li>• No PII, no real patient identifiers</li>
              <li>• Seed-controlled reproducibility</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-primary-600" />
            Technology Stack
          </h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Frontend</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• React 18 + TypeScript</li>
                <li>• Vite for build/dev</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Recharts for visualizations</li>
                <li>• React Router for navigation</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Data & ML</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Python (pandas, numpy, scikit-learn)</li>
                <li>• Synthetic data generation scripts</li>
                <li>• Baseline median model</li>
                <li>• Great Expectations for validation</li>
                <li>• Airflow-ready DAG structure</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Deployment</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Netlify (static hosting)</li>
                <li>• Auto-deploy from GitHub</li>
                <li>• HTTPS, CDN, custom domains</li>
                <li>• Zero backend infrastructure</li>
                <li>• Environment-based config</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Integration */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary-600" />
            Portfolio Integration
          </h2>
        </div>
        <div className="card-body space-y-4">
          <p className="text-neutral-600">
            This project is designed as a portfolio piece for a Senior Data / Product Analyst role.
            It demonstrates the following competencies:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Analytical Skills</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• Predictive modeling (baseline + confidence)</li>
                <li>• ETL pipeline design & data validation</li>
                <li>• Customer segmentation (RFM-style)</li>
                <li>• Model evaluation & drift monitoring</li>
                <li>• Business recommendation framing</li>
              </ul>
            </div>
            <div className="p-4 bg-neutral-50 rounded-lg">
              <h4 className="font-medium text-neutral-900 mb-2">Technical Skills</h4>
              <ul className="space-y-1 text-sm text-neutral-600">
                <li>• React + TypeScript development</li>
                <li>• Interactive dashboard design</li>
                <li>• Data visualization (Recharts)</li>
                <li>• Python data pipeline</li>
                <li>• Git/GitHub + Netlify deployment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary-600" />
            Links & Resources
          </h2>
        </div>
        <div className="card-body space-y-3">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <Github className="w-6 h-6 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">GitHub Repository</p>
              <p className="text-sm text-neutral-500">Source code, data scripts, documentation</p>
            </div>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <ExternalLink className="w-6 h-6 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">Live Demo (Netlify)</p>
              <p className="text-sm text-neutral-500">Interactive dashboard deployment</p>
            </div>
          </a>
          <Link to="/" className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
            <BarChart2 className="w-6 h-6 text-neutral-600" />
            <div>
              <p className="font-medium text-neutral-900">Back to Dashboard</p>
              <p className="text-sm text-neutral-500">Explore the interactive analysis</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
