import { Menu, BarChart2, Github, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { PAGES } from '../../utils/constants';
import { InlineSyntheticBadge } from '../ui/SyntheticDataBadge';

const NAV_ITEMS = PAGES.filter(p => p.id !== 'about');

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2" onClick={onMenuClick}>
              <BarChart2 className="w-7 h-7 text-primary-600" />
              <span className="font-semibold text-neutral-900">Refill Reminder Analytics</span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((page) => {
              const isActive = location.pathname === `/${page.id}` || (page.id === 'executive' && location.pathname === '/');
              return (
                <Link
                  key={page.id}
                  to={`/${page.id}`}
                  className={cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <InlineSyntheticBadge />
            <div className="hidden lg:flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost p-2"
                aria-label="View on GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}