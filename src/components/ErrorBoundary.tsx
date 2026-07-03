import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Heart, RefreshCw, AlertTriangle, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  props!: Props;
  
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    if (confirm('Are you sure you want to reset your local cache? This can resolve loaded data errors.')) {
      localStorage.clear();
      window.location.href = window.location.origin + window.location.pathname;
    }
  };

  public render() {
    if (this.state.hasError) {
      const errorMsg = this.state.error?.message || 'An unknown runtime error occurred.';
      
      // Check if it's a Firestore/Firebase related error
      const isFirebaseError = errorMsg.toLowerCase().includes('firestore') || 
                            errorMsg.toLowerCase().includes('firebase') || 
                            errorMsg.toLowerCase().includes('permission-denied') ||
                            errorMsg.toLowerCase().includes('quota');

      return (
        <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40 dark:opacity-10" />
          
          <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-xl border border-neutral-200 dark:border-neutral-800 space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Elegant Icon Crest */}
            <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center relative">
              <ShieldAlert className="h-8 w-8 text-rose-600 dark:text-rose-400" />
              <span className="absolute inset-0 rounded-2xl bg-rose-500/10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Application Interrupted
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-sm mx-auto">
                {isFirebaseError 
                  ? "We couldn't connect securely to the database. This is usually due to strict third-party cookie blocking, private window restrictions, or a connection outage."
                  : "A rendering exception interrupted the workspace. You can reload or reset your workspace to recover."
                }
              </p>
            </div>

            {/* Error Message Box */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl text-left font-mono text-[11px] text-neutral-600 dark:text-neutral-400 max-h-36 overflow-y-auto break-all [scrollbar-width:thin]">
              <div className="font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" /> Error Details:
              </div>
              {errorMsg}
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reload Page
              </button>
              
              <button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Reset Workspace
              </button>
            </div>

            <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-center items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-semibold">
              <Heart className="h-3 w-3 text-rose-500" /> Wedding invitation Card Creator
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
