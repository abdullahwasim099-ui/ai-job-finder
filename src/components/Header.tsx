import React from 'react';
import { Sparkles, FileText, History, RotateCcw, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
  onReset,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CareerPulse
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
                ATS Engine v3.8
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              AI Resume Parser & Career Match Compatibility Advisor
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {hasResult && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title="Start a new analysis"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">New Analysis</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors relative"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>History</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
