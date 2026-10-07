import { Github, Linkedin, Mail, BarChart2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="w-6 h-6 text-primary-600" />
              <span className="font-semibold text-neutral-900">Refill Reminder Analytics</span>
            </div>
            <p className="text-sm text-neutral-600 max-w-md">
              Predictive analytics portfolio project demonstrating medicine reorder prediction,
              ETL pipelines, customer segmentation, and proactive engagement using synthetic data.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-neutral-600 hover:text-primary-600">About This Project</Link>
              </li>
              <li>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary-600 flex items-center gap-1">
                  <Github className="w-4 h-4" />
                  GitHub Repository
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary-600 flex items-center gap-1">
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-neutral-900 mb-3">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-neutral-600 hover:text-primary-600 flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="mailto:example@email.com" className="text-neutral-600 hover:text-primary-600 flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">
            &copy; {currentYear} Refill Reminder Analytics Portfolio Project. All data is synthetic.
          </p>
          <p className="text-xs text-neutral-400">
            SYNTHETIC DATA — PORTFOLIO DEMO · Not affiliated with Zeno Health or any real company
          </p>
        </div>
      </div>
    </footer>
  );
}