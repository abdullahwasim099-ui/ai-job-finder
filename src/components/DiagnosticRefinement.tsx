import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Send, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';

interface DiagnosticRefinementProps {
  diagnosticQuestions: string[];
  onRefineWithAnswers: (answers: { question: string; answer: string }[]) => void;
  isRefining: boolean;
}

export const DiagnosticRefinement: React.FC<DiagnosticRefinementProps> = ({
  diagnosticQuestions,
  onRefineWithAnswers,
  isRefining,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (index: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [index]: text }));
  };

  const answeredCount = Object.values(answers).filter((a) => a.trim().length > 0).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = diagnosticQuestions
      .map((q, idx) => ({
        question: q,
        answer: answers[idx]?.trim() || '',
      }))
      .filter((item) => item.answer.length > 0);

    if (formatted.length > 0) {
      onRefineWithAnswers(formatted);
    }
  };

  if (!diagnosticQuestions || diagnosticQuestions.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center text-slate-400">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-200">
          No additional diagnostic questions required.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Your CV provided sufficient depth for all target role benchmark checks.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-5 sm:p-6 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <span>Candidate Diagnostic Follow-up</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Interactive Refinement Loop
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              The advisor identified {diagnosticQuestions.length} critical points missing or ambiguous in your CV.
              Answer below to update your compatibility score!
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {diagnosticQuestions.map((question, idx) => (
          <div
            key={idx}
            className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2.5 transition-colors focus-within:border-indigo-500/50"
          >
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed">
                {question}
              </p>
            </div>

            <textarea
              value={answers[idx] || ''}
              onChange={(e) => handleAnswerChange(idx, e.target.value)}
              placeholder="Provide clarifying details, specific metrics, tools used, or team size here..."
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all resize-y"
            />
          </div>
        ))}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400">
            {answeredCount} of {diagnosticQuestions.length} questions answered
          </span>

          <button
            type="submit"
            disabled={answeredCount === 0 || isRefining}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              answeredCount === 0 || isRefining
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 cursor-pointer border border-indigo-400/30'
            }`}
          >
            {isRefining ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Recalculating Match with New Details...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Refine ATS Analysis & Re-Score</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
