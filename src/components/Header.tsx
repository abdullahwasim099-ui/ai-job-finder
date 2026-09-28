import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  History,
  RotateCcw,
  Mail,
  Target,
  Compass,
  MessageSquareCode,
  Globe,
  FileCheck,
  PenTool,
  Radar,
  ChevronDown,
  Menu,
  Key,
} from 'lucide-react';

export type ToolType =
  | 'live_job_finder'
  | 'career_copywriter'
  | 'ats_posting_scorer'
  | 'career_matcher'
  | 'ats_parser'
  | 'cover_letter'
  | 'interview_coach'
  | 'career_advisor';

interface HeaderProps {
  activeTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
  hasResult: boolean;
  onOpenApiKeyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTool,
  onSelectTool,
  onOpenHistory,
  historyCount,
  onReset,
  hasResult,
  onOpenApiKeyModal,
}) => {
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const selectSecondaryTool = (tool: ToolType) => {
    onSelectTool(tool);
    setIsToolsMenuOpen(false);
  };

  // Helper to check if active tool is in the dropdown menu
  const isDropdownToolActive = [
    'ats_posting_scorer',
    'ats_parser',
    'cover_letter',
    'interview_coach',
    'career_advisor',
  ].includes(activeTool);

  const getActiveToolLabel = () => {
    switch (activeTool) {
      case 'ats_posting_scorer':
        return 'Posting Scorer';
      case 'ats_parser':
        return 'ATS Gap Analysis';
      case 'cover_letter':
        return 'Cover Letter & STAR';
      case 'interview_coach':
        return 'AI Interview Coach';
      case 'career_advisor':
        return 'Career Advisor';
      default:
        return 'More Tools';
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand/Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-zinc-700 via-zinc-800 to-zinc-100 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#09090B] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                CareerPulse
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-zinc-800 text-zinc-400 border border-zinc-700/80 rounded-full">
                ATS Executive
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Fully Responsive, Zero-Overflow) */}
        <nav className="flex items-center p-1 bg-zinc-900/90 rounded-full border border-zinc-800/80 text-xs shadow-lg max-w-full">
          
          {/* Primary Viewports: Visible Everywhere */}
          <button
            type="button"
            onClick={() => onSelectTool('live_job_finder')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-all shrink-0 ${
              activeTool === 'live_job_finder'
                ? 'bg-white text-black shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Live Job Finder</span>
            <span className="sm:hidden">Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('career_copywriter')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-all shrink-0 ${
              activeTool === 'career_copywriter'
                ? 'bg-white text-black shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Career Copywriter</span>
            <span className="sm:hidden">Copywriter</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectTool('career_matcher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-all shrink-0 lg:flex ${
              activeTool === 'career_matcher'
                ? 'bg-white text-black shadow-md font-bold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Job Match & Search</span>
            <span className="sm:hidden">Match</span>
          </button>

          {/* Desktop Only Tabs (Visible on screens >= 1024px) */}
          <div className="hidden lg:flex items-center">
            <button
              type="button"
              onClick={() => onSelectTool('ats_posting_scorer')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all shrink-0 ${
                activeTool === 'ats_posting_scorer'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Posting Scorer</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('ats_parser')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all shrink-0 ${
                activeTool === 'ats_parser'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>ATS Gap Analysis</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('cover_letter')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all shrink-0 ${
                activeTool === 'cover_letter'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Cover Letter & STAR</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('interview_coach')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all shrink-0 ${
                activeTool === 'interview_coach'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>Interview Coach</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTool('career_advisor')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold transition-all shrink-0 ${
                activeTool === 'career_advisor'
                  ? 'bg-white text-black font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Career Advisor</span>
            </button>
          </div>

          {/* Unified Dropped Menu (Visible under 1024px for grouped secondary tools) */}
          <div className="relative lg:hidden shrink-0" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold transition-all ${
                isDropdownToolActive
                  ? 'bg-zinc-800 text-white font-bold border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Menu className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">
                {isDropdownToolActive ? getActiveToolLabel() : 'Tools'}
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Card */}
            {isToolsMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#09090B] border border-zinc-800 rounded-xl shadow-2xl p-1.5 space-y-0.5 animate-in fade-in duration-200">
                <button
                  type="button"
                  onClick={() => selectSecondaryTool('ats_posting_scorer')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${
                    activeTool === 'ats_posting_scorer'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>Posting Scorer</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSecondaryTool('ats_parser')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${
                    activeTool === 'ats_parser'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>ATS Gap Analysis</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSecondaryTool('cover_letter')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${
                    activeTool === 'cover_letter'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Cover Letter & STAR</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSecondaryTool('interview_coach')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${
                    activeTool === 'interview_coach'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <MessageSquareCode className="w-3.5 h-3.5" />
                  <span>Interview Coach</span>
                </button>

                <button
                  type="button"
                  onClick={() => selectSecondaryTool('career_advisor')}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs ${
                    activeTool === 'career_advisor'
                      ? 'bg-zinc-800 text-white font-bold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Career Advisor</span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Actions Block */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all relative ${
              localStorage.getItem('gemini_api_key')
                ? 'text-emerald-400 border border-emerald-800 bg-emerald-950/20 hover:bg-emerald-950/40'
                : 'text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800'
            }`}
            title="Configure Custom Gemini API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">API Key</span>
            {localStorage.getItem('gemini_api_key') && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {hasResult && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-all"
              title="Reset current view"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full transition-all relative"
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                {historyCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
