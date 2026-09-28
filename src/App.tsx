/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  Mail,
  Target,
  Compass,
} from 'lucide-react';
import {
  AnalysisInput,
  CareerAnalysisResult,
  ExpertAtsResult,
  CoverLetterInput,
  CoverLetterResult,
  HistoryItem,
} from './types/career';
import { SAMPLE_PROFILES, SampleProfile } from './data/sampleProfiles';
import { Header, ToolType } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ExpertAtsDashboard } from './components/ExpertAtsDashboard';
import { CoverLetterPanel } from './components/CoverLetterPanel';
import { CoverLetterResultView } from './components/CoverLetterResultView';
import { InterviewCoachView } from './components/InterviewCoachView';
import { CareerMatcherView } from './components/CareerMatcherView';
import { AtsPostingScorerView } from './components/AtsPostingScorerView';
import { CareerCopywriterView } from './components/CareerCopywriterView';
import { LiveJobFinderView } from './components/LiveJobFinderView';
import { EditorialHero } from './components/EditorialHero';
import { LoadingScreen } from './components/LoadingScreen';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ApiKeyModal } from './components/ApiKeyModal';
import { safeFetch } from './utils/api';

const STORAGE_KEY = 'careerpulse_history';

const INITIAL_INPUT: AnalysisInput = {
  candidateCv: '',
  targetRole: '',
  locationPreference: 'Remote / Flexible',
  targetSalaryOrSeniority: '',
  mode: 'expert_ats',
  userPreferences: {
    workCulture: '',
    industry: '',
    keyHardSkills: '',
  },
  targetJobDescription: '',
};

const INITIAL_COVER_LETTER_INPUT: CoverLetterInput = {
  candidateCv: '',
  jobDescription: '',
  companyName: '',
};

export default function App() {
  const [activeTool, setActiveTool] = useState<ToolType>('live_job_finder'); // Set to live_job_finder for Turn 8!
  const [cvText, setCvText] = useState<string>('');
  const [input, setInput] = useState<AnalysisInput>(INITIAL_INPUT);
  const [expertResult, setExpertResult] = useState<ExpertAtsResult | null>(null);
  const [comprehensiveResult, setComprehensiveResult] = useState<CareerAnalysisResult | null>(null);

  // Keep input and coverLetterInput synchronized with cvText
  useEffect(() => {
    setInput((prev) => {
      if (prev.candidateCv !== cvText) {
        return { ...prev, candidateCv: cvText };
      }
      return prev;
    });
    setCoverLetterInput((prev) => {
      if (prev.candidateCv !== cvText) {
        return { ...prev, candidateCv: cvText };
      }
      return prev;
    });
  }, [cvText]);

  // Turn 3 state: Cover letter & STAR
  const [coverLetterInput, setCoverLetterInput] = useState<CoverLetterInput>(INITIAL_COVER_LETTER_INPUT);
  const [coverLetterResult, setCoverLetterResult] = useState<CoverLetterResult | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'results'>('input');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse history from storage:', e);
    }
  }, []);

  const saveToHistory = (item: HistoryItem) => {
    setHistory((prev) => {
      const updated = [item, ...prev.slice(0, 19)];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to storage:', e);
      }
      return updated;
    });
  };

  const handleInputChange = (updated: Partial<AnalysisInput>) => {
    setInput((prev) => {
      const next = { ...prev, ...updated };
      if (updated.candidateCv !== undefined && updated.candidateCv !== cvText) {
        setCvText(updated.candidateCv);
      }
      return next;
    });
    if (errorMessage) setErrorMessage(null);
  };

  const handleCoverLetterInputChange = (updated: Partial<CoverLetterInput>) => {
    setCoverLetterInput((prev) => {
      const next = { ...prev, ...updated };
      if (updated.candidateCv !== undefined && updated.candidateCv !== cvText) {
        setCvText(updated.candidateCv);
      }
      return next;
    });
    if (errorMessage) setErrorMessage(null);
  };

  const handleLoadSample = (sample: SampleProfile) => {
    setCvText(sample.data.candidateCv || '');
    setInput((prev) => ({
      ...prev,
      ...sample.data,
      mode: prev.mode || 'expert_ats',
    }));
    // Also preload into cover letter input for seamless cross-tool use
    setCoverLetterInput({
      candidateCv: sample.data.candidateCv || '',
      jobDescription: sample.data.targetJobDescription || '',
      companyName: 'CloudScale Inc.',
    });
    setErrorMessage(null);
  };

  // Submit ATS / Career Advisor analysis
  const handleAnalyze = async () => {
    const isRaw = !!input.rawSystemInput?.trim();
    if (!isRaw && !input.candidateCv.trim()) {
      setErrorMessage('Please paste or upload candidate CV text.');
      return;
    }
    if (!isRaw && !input.targetRole.trim()) {
      setErrorMessage('Please specify a target role.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const mode = activeTool === 'career_advisor' ? 'comprehensive' : 'expert_ats';
    const endpoint = mode === 'expert_ats' ? '/api/ats-parse' : '/api/analyze';

    try {
      const response = await safeFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...input, mode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete analysis.');
      }

      if (mode === 'expert_ats') {
        setExpertResult(data);
        setComprehensiveResult(null);
        saveToHistory({
          id: `scan-${Date.now()}`,
          timestamp: Date.now(),
          targetRole: input.targetRole || 'Target Role',
          candidateNameSnippet: data.profile?.name || 'Candidate',
          overallScore: data.compatibility?.overallScore || 0,
          mode: 'expert_ats',
          expertResult: data,
          input,
        });
      } else {
        setComprehensiveResult(data);
        setExpertResult(null);
        saveToHistory({
          id: `scan-${Date.now()}`,
          timestamp: Date.now(),
          targetRole: input.targetRole || 'Target Role',
          candidateNameSnippet: input.candidateCv.substring(0, 25),
          overallScore: data.roleMatch?.overallScore || 0,
          mode: 'comprehensive',
          result: data,
          input,
        });
      }

      setViewMode('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'An error occurred while connecting to the engine.');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Cover Letter & STAR Bullets
  const handleGenerateCoverLetter = async () => {
    const isRaw = !!coverLetterInput.rawTaggedInput?.trim();
    if (!isRaw && !coverLetterInput.candidateCv.trim()) {
      setErrorMessage('Candidate CV text is required.');
      return;
    }
    if (!isRaw && !coverLetterInput.jobDescription.trim()) {
      setErrorMessage('Target Job Description is required.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await safeFetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coverLetterInput),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate cover letter.');
      }

      setCoverLetterResult(data);
      saveToHistory({
        id: `cover-${Date.now()}`,
        timestamp: Date.now(),
        targetRole: `${coverLetterInput.companyName || 'Application'} Cover Letter`,
        candidateNameSnippet: coverLetterInput.candidateCv.substring(0, 25),
        mode: 'cover_letter',
        coverLetterResult: data,
        coverLetterInput,
      });

      setViewMode('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Cover letter error:', err);
      setErrorMessage(err.message || 'Failed to generate cover letter.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineWithAnswers = async (answers: { question: string; answer: string }[]) => {
    setIsRefining(true);
    setErrorMessage(null);

    const mode = activeTool === 'career_advisor' ? 'comprehensive' : 'expert_ats';
    const endpoint = mode === 'expert_ats' ? '/api/ats-parse' : '/api/analyze';

    try {
      const payload: AnalysisInput = {
        ...input,
        mode,
        diagnosticAnswers: answers,
      };

      const response = await safeFetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine analysis.');
      }

      if (mode === 'expert_ats') {
        setExpertResult(data);
      } else {
        setComprehensiveResult(data);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Refinement error:', err);
      setErrorMessage(err.message || 'Failed to refine profile scores.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleReset = () => {
    if (activeTool === 'cover_letter') {
      setCoverLetterResult(null);
    } else if (activeTool === 'ats_parser') {
      setExpertResult(null);
    } else {
      setComprehensiveResult(null);
    }
    setViewMode('input');
    setErrorMessage(null);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    if (item.mode === 'cover_letter' && item.coverLetterResult) {
      setActiveTool('cover_letter');
      if (item.coverLetterInput) setCoverLetterInput(item.coverLetterInput);
      setCoverLetterResult(item.coverLetterResult);
    } else if (item.mode === 'expert_ats' && item.expertResult) {
      setActiveTool('ats_parser');
      if (item.input) setInput(item.input);
      setExpertResult(item.expertResult);
    } else if (item.result) {
      setActiveTool('career_advisor');
      if (item.input) setInput(item.input);
      setComprehensiveResult(item.result);
    }
    setViewMode('results');
    setErrorMessage(null);
  };

  const handleDeleteHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasCurrentResult =
    (activeTool === 'cover_letter' && !!coverLetterResult) ||
    (activeTool === 'ats_parser' && !!expertResult) ||
    (activeTool === 'career_advisor' && !!comprehensiveResult);

  return (
    <div className="min-h-screen bg-[#09090B] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeTool={activeTool}
        onSelectTool={(tool) => {
          setActiveTool(tool);
          setViewMode('input');
          setErrorMessage(null);
        }}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onReset={handleReset}
        hasResult={hasCurrentResult}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col">
        {/* SECTION A: Upper Hero & Bleeding Visual Showcase */}
        {viewMode === 'input' && !isLoading && (
          <section className="w-full relative bg-[#09090B]/40 overflow-visible border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <EditorialHero
                activeToolName={activeTool}
                onCtaClick={() => {
                  const el = document.getElementById('active-tool-workspace');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            </div>
          </section>
        )}

        {/* SECTION B: Contrasting Background & Overlapping Workspace Container */}
        <section
          id="active-tool-workspace"
          className={`relative z-10 w-full transition-colors duration-500 bg-[#09090B] ${
            viewMode === 'input' && !isLoading ? 'pt-36' : 'pt-10'
          } pb-20 border-t border-indigo-950/40`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Global Error Banner */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex flex-col sm:flex-row sm:items-center gap-3 animate-in fade-in justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-sm flex-1">
                    <span className="font-semibold">Notice: </span>
                    {errorMessage}
                  </div>
                </div>
                {(errorMessage.toLowerCase().includes('gemini_api_key') || errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('apikey')) && (
                  <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-all shrink-0 self-start sm:self-auto"
                  >
                    Configure API Key
                  </button>
                )}
              </div>
            )}

            {/* Loading Screen */}
            {isLoading && <LoadingScreen />}

            {/* ================= Tool 8: Executive Live Job Finder (Turn 8) ================= */}
        {activeTool === 'live_job_finder' && (
          <LiveJobFinderView
            initialRole={input.targetRole || 'Lead Platform Architect'}
            initialLocation={input.locationPreference || 'Remote'}
            initialSkills={input.userPreferences?.keyHardSkills || 'Distributed Systems, Microservices, Node.js, AWS, Kubernetes, Kafka'}
            onSelectListingForScorer={(listing) => {
              setActiveTool('ats_posting_scorer');
            }}
          />
        )}

        {/* ================= Tool 7: Professional Career Copywriter (Turn 7) ================= */}
        {activeTool === 'career_copywriter' && (
          <CareerCopywriterView initialCv={input.candidateCv || coverLetterInput.candidateCv} />
        )}

        {/* ================= Tool 6: ATS Scoring Engine for Job Postings (Turn 6) ================= */}
        {activeTool === 'ats_posting_scorer' && (
          <AtsPostingScorerView />
        )}

        {/* ================= Tool 5: AI Career Matcher & Job Search (Turn 5) ================= */}
        {activeTool === 'career_matcher' && (
          <CareerMatcherView initialCv={input.candidateCv || coverLetterInput.candidateCv} />
        )}

        {/* ================= Tool 4: AI Interview Coach (Turn 4) ================= */}
        {activeTool === 'interview_coach' && (
          <InterviewCoachView
            initialCv={input.candidateCv || coverLetterInput.candidateCv}
            initialRole={input.targetRole || 'Lead Platform Architect'}
          />
        )}

        {/* ================= Tool 1: Cover Letter & STAR Bullets (Turn 3) ================= */}
        {activeTool === 'cover_letter' && !isLoading && (
          <>
            {viewMode === 'input' && (
              <CoverLetterPanel
                input={coverLetterInput}
                onChange={handleCoverLetterInputChange}
                onSubmit={handleGenerateCoverLetter}
                isLoading={isLoading}
              />
            )}

            {viewMode === 'results' && coverLetterResult && (
              <CoverLetterResultView
                result={coverLetterResult}
                input={coverLetterInput}
                onEditInputs={() => setViewMode('input')}
              />
            )}
          </>
        )}

        {/* ================= Tool 2: ATS Parser (Turn 2) ================= */}
        {activeTool === 'ats_parser' && !isLoading && (
          <>
            {viewMode === 'input' && (
              <InputPanel
                input={{ ...input, mode: 'expert_ats' }}
                onChange={handleInputChange}
                onSubmit={handleAnalyze}
                isLoading={isLoading}
                onLoadSample={handleLoadSample}
                cvText={cvText}
                setCvText={setCvText}
              />
            )}

            {viewMode === 'results' && expertResult && (
              <ExpertAtsDashboard
                result={expertResult}
                input={input}
                onRefineWithAnswers={handleRefineWithAnswers}
                isRefining={isRefining}
                onEditInputs={() => setViewMode('input')}
              />
            )}
          </>
        )}

        {/* ================= Tool 3: Career Advisor (Turn 1) ================= */}
        {activeTool === 'career_advisor' && !isLoading && (
          <>
            {viewMode === 'input' && (
              <InputPanel
                input={{ ...input, mode: 'comprehensive' }}
                onChange={handleInputChange}
                onSubmit={handleAnalyze}
                isLoading={isLoading}
                onLoadSample={handleLoadSample}
                cvText={cvText}
                setCvText={setCvText}
              />
            )}

            {viewMode === 'results' && comprehensiveResult && (
              <ResultsDashboard
                result={comprehensiveResult}
                input={input}
                onRefineWithAnswers={handleRefineWithAnswers}
                isRefining={isRefining}
                onEditInputs={() => setViewMode('input')}
              />
            )}
          </>
        )}
          </div>
        </section>
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        items={history}
        onSelect={handleRestoreHistory}
        onDelete={handleDeleteHistory}
        onClearAll={handleClearAllHistory}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#09090B]/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CareerPulse</span>
            <span>•</span>
            <span>ATS Resume Parser & Career Copywriter</span>
          </div>
          <div>Strict Schema • STAR Method Metrics • Tailored Cover Letters &lt; 250 Words</div>
        </div>
      </footer>
    </div>
  );
}
