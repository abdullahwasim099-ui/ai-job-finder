/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertCircle,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { AnalysisInput, CareerAnalysisResult, HistoryItem } from './types/career';
import { SAMPLE_PROFILES, SampleProfile } from './data/sampleProfiles';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { HistoryDrawer } from './components/HistoryDrawer';

const STORAGE_KEY = 'careerpulse_ats_history_v1';

const INITIAL_INPUT: AnalysisInput = {
  candidateCv: '',
  targetRole: '',
  locationPreference: 'Remote / Flexible',
  targetSalaryOrSeniority: '',
  userPreferences: {
    workCulture: '',
    industry: '',
    keyHardSkills: '',
  },
  targetJobDescription: '',
};

export default function App() {
  const [input, setInput] = useState<AnalysisInput>(INITIAL_INPUT);
  const [result, setResult] = useState<CareerAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'input' | 'results'>('input');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

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

  // Save history to localStorage
  const saveToHistory = (res: CareerAnalysisResult, inData: AnalysisInput) => {
    try {
      const nameSnippet =
        inData.candidateCv.split('\n').find((l) => l.trim().length > 0)?.substring(0, 30) ||
        'Candidate CV';

      const newItem: HistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: Date.now(),
        targetRole: inData.targetRole,
        candidateNameSnippet: nameSnippet,
        overallScore: res.roleMatch.overallScore,
        result: res,
        input: inData,
      };

      setHistory((prev) => {
        const updated = [newItem, ...prev.slice(0, 19)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save scan to storage:', e);
    }
  };

  const handleInputChange = (updated: Partial<AnalysisInput>) => {
    setInput((prev) => ({ ...prev, ...updated }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleLoadSample = (sample: SampleProfile) => {
    setInput(sample.data);
    setErrorMessage(null);
  };

  const handleAnalyze = async () => {
    if (!input.candidateCv.trim()) {
      setErrorMessage('Please paste or upload candidate CV text.');
      return;
    }
    if (!input.targetRole.trim()) {
      setErrorMessage('Please specify a target role or field.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to complete resume analysis.');
      }

      setResult(data);
      saveToHistory(data, input);
      setViewMode('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'An error occurred while connecting to the Career Advisor engine.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineWithAnswers = async (answers: { question: string; answer: string }[]) => {
    setIsRefining(true);
    setErrorMessage(null);

    try {
      const payload: AnalysisInput = {
        ...input,
        diagnosticAnswers: answers,
      };

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to refine resume analysis.');
      }

      setResult(data);
      saveToHistory(data, payload);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Refinement error:', err);
      setErrorMessage(err.message || 'Failed to refine profile scores.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleReset = () => {
    setInput(INITIAL_INPUT);
    setResult(null);
    setViewMode('input');
    setErrorMessage(null);
  };

  const handleRestoreHistory = (item: HistoryItem) => {
    setInput(item.input);
    setResult(item.result);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onReset={handleReset}
        hasResult={!!result}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Hero Section if on Input View */}
        {viewMode === 'input' && !isLoading && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack ATS Resume Intelligence & Role Matching</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              AI Career Advisor &{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
                ATS Resume Parser
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Calculate precise role compatibility scores, uncover hidden ATS keyword gaps, rewrite
              resumes into high-impact STAR bullets, and generate targeted search strategies.
            </p>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-sm flex-1">
              <span className="font-semibold">Notice: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Loading Screen */}
        {isLoading && <LoadingScreen />}

        {/* Input Form Mode */}
        {viewMode === 'input' && !isLoading && (
          <InputPanel
            input={input}
            onChange={handleInputChange}
            onSubmit={handleAnalyze}
            isLoading={isLoading}
            onLoadSample={handleLoadSample}
          />
        )}

        {/* Results Dashboard Mode */}
        {viewMode === 'results' && result && !isLoading && (
          <ResultsDashboard
            result={result}
            input={input}
            onRefineWithAnswers={handleRefineWithAnswers}
            isRefining={isRefining}
            onEditInputs={() => setViewMode('input')}
          />
        )}
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">CareerPulse</span>
            <span>•</span>
            <span>ATS Resume Parser Engine</span>
          </div>
          <div>Strict schema compliant • STAR Method optimization • Real-time scoring</div>
        </div>
      </footer>
    </div>
  );
}
