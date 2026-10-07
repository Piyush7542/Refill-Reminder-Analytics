import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg border border-neutral-200">
            <div className="text-center">
              <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-16 h-16 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
              <p className="text-neutral-600 mb-6">
                We're sorry, but something unexpected happened. Don't worry, your data is safe.
              </p>
              {import.meta.env.DEV && this.state.error && (
                <details className="text-left mb-4 p-4 bg-neutral-100 rounded-lg text-xs">
                  <summary className="font-medium text-neutral-700 cursor-pointer">Error Details</summary>
                  <pre className="mt-2 text-red-600 whitespace-pre-wrap">{this.state.error?.message}</pre>
                  <pre className="mt-2 text-neutral-500 whitespace-pre-wrap">{this.state.error?.stack}</pre>
                </details>
              )}
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.handleReset}
                  className="btn-primary flex-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
                <Link to="/" className="btn-secondary flex-1 justify-center">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </div>
              <p className="mt-4 text-xs text-neutral-500 text-center">
                Error logged automatically. If this persists, please refresh the page.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}