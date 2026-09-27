import React, { useState } from 'react';
import {
  Sparkles,
  FileText,
  AlertTriangle,
  Search,
  HelpCircle,
  FileCode,
  Copy,
  Check,
  RotateCcw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CareerAnalysisResult, AnalysisInput } from '../types/career';
import { ScoreGauge } from './ScoreGauge';
import { StarBulletCard } from './StarBulletCard';
import { StrengthsAndGapsPanel } from './StrengthsAndGapsPanel';
import { SearchStrategyPanel } from './SearchStrategyPanel';
import { DiagnosticRefinement } from './DiagnosticRefinement';
import { RawJsonView } from './RawJsonView';

interface ResultsDashboardProps {
  result: CareerAnalysisResult;
  input: AnalysisInput;
  onRefineWithAnswers: (answers: { question: string; answer: string }[]) => void;
  isRefining: boolean;
  onEditInputs: () => void;
}

type TabType = 'bullets' | 'gaps' | 'search' | 'refine' | 'json';

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  result,
  input,
  onRefineWithAnswers,
  isRefining,
  onEditInputs,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('bullets');
  const [copiedAllBullets, setCopiedAllBullets] = useState(false);

  const handleCopyAllBullets = () => {
    if (!result.atsOptimizedBullets?.length) return;
    const all = result.atsOptimizedBullets
      .map((b, idx) => `${idx + 1}. ${b.optimizedBullet}\n   Impact: ${b.impactReason}`)
      .join('\n\n');
    navigator.clipboard.writeText(all);
    setCopiedAllBullets(true);
    setTimeout(() => setCopiedAllBullets(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Navigation back to Edit */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Analysis Complete for target role:</span>
          <span className="text-white font-semibold">{input.targetRole}</span>
        </div>

        <button
          type="button"
          onClick={onEditInputs}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span>Modify Inputs & Preferences</span>
        </button>
      </div>

      {/* Main Hero Score Gauge */}
      <ScoreGauge
        roleMatch={result.roleMatch}
        profileSummary={result.profileSummary}
        targetRole={input.targetRole}
        targetSalaryOrSeniority={input.targetSalaryOrSeniority}
      />

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('bullets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'bullets'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ATS STAR Bullets ({result.atsOptimizedBullets?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gaps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'gaps'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Skills & Gap Matrix</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('search')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'search'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Job Search Strategy</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('refine')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all relative ${
            activeTab === 'refine'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Diagnostic Refinement</span>
          {result.diagnosticQuestions?.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ml-auto ${
            activeTab === 'json'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>JSON & Report</span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                ATS STAR Bullet Point Optimizer
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Rewritten with Situation, Task, Action, and Quantifiable Results for top ATS parse rates
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopyAllBullets}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition-colors"
            >
              {copiedAllBullets ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">All Bullets Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy All Bullets</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {result.atsOptimizedBullets?.map((bullet, idx) => (
              <StarBulletCard key={idx} bullet={bullet} index={idx} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'gaps' && (
        <StrengthsAndGapsPanel
          strengthsAndGaps={result.strengthsAndGaps}
          profileSummary={result.profileSummary}
        />
      )}

      {activeTab === 'search' && (
        <SearchStrategyPanel
          searchStrategy={result.searchStrategy}
          locationPreference={input.locationPreference}
        />
      )}

      {activeTab === 'refine' && (
        <DiagnosticRefinement
          diagnosticQuestions={result.diagnosticQuestions}
          onRefineWithAnswers={onRefineWithAnswers}
          isRefining={isRefining}
        />
      )}

      {activeTab === 'json' && <RawJsonView result={result} />}
    </div>
  );
};
