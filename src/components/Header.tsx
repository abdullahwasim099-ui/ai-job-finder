import React from 'react';
import { Sparkles, FileText, History, RotateCcw, Mail, Target, Compass, MessageSquareCode, Globe, FileCheck, PenTool, Radar } from 'lucide-react';

export type ToolType = 'live_job_finder' | 'career_copywriter' | 'ats_posting_scorer' | 'career_matcher' | 'ats_parser' | 'cover_letter' | 'interview_coach' | 'career_advisor';

interface HeaderProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
  hasResult: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTool,
  onSelectTool,
  onOpenHistory,
  historyCount,
  onReset,
  hasResult,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                CareerPulse
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full hidden sm:inline">
                ATS & Copywriter
              </span>
            </div>
          </div>
        </div>

        {/* Center Tool Switcher */}
        <nav className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs overflow-x-auto max-w-full">
          <button
            type="button"
            onClick={() => onSelectTool('live_job_finder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTool === 'live_job_finder'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Live Job Finder</span>
            <span className="md:hidden">Live Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('career_copywriter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTool === 'career_copywriter'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Career Copywriter</span>
            <span className="md:hidden">Copywriter</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('ats_posting_scorer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTool === 'ats_posting_scorer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Posting Scorer</span>
            <span className="md:hidden">Score</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('career_matcher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTool === 'career_matcher'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Job Match & Search</span>
            <span className="md:hidden">Match</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('ats_parser')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
              activeTool === 'ats_parser'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ATS Gap Analysis</span>
            <span className="md:hidden">ATS</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('cover_letter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTool === 'cover_letter'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Cover Letter & STAR</span>
            <span className="md:hidden">Cover</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('interview_coach')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTool === 'interview_coach'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Interview Coach</span>
            <span className="md:hidden">Interview</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('career_advisor')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTool === 'career_advisor'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Career Advisor</span>
            <span className="md:hidden">Advisor</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {hasResult && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
              title="Reset current view"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors relative"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
