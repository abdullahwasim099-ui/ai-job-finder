import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

const STEPS = [
  "Extracting resume parameters & skill metrics...",
  "Scanning active job listings with search grounding...",
  "Benchmarking against ATS keyword databases...",
  "Crafting STAR bullets & cover letter drafts..."
];

export const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(5);

  useEffect(() => {
    // Cycle through steps every 2.5 seconds
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2500);

    // Smooth overall progress bar animation
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) return 98; // Hold near completion until page updates
        const nextStepLimit = ((currentStep + 1) / STEPS.length) * 100;
        if (prev < nextStepLimit) {
          return prev + 1;
        }
        return prev;
      });
    }, 50);

    return () => {
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, [currentStep]);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-8 text-center space-y-8 animate-in fade-in duration-300">
      
      {/* Premium Radar Pulse with Obsidian Design Accent */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-zinc-800/30 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-zinc-900/50 animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center shadow-md border border-zinc-700/60">
          <Sparkles className="w-7 h-7 text-white animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Processing Executive Analysis</h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          AI CareerPulse engine is parsing credentials, querying search grounding indices, and customizing STAR resumes.
        </p>
      </div>

      {/* Main Smooth Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="flex justify-between items-center text-[11px] font-mono uppercase tracking-widest text-zinc-500">
          <span>Engine Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden border border-zinc-800/50">
          <div
            className="bg-white h-1.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Structured Multi-Step Progress List */}
      <div className="bg-zinc-950/70 border border-zinc-800/60 rounded-xl p-5 text-left space-y-3.5 max-w-md mx-auto">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3 text-xs transition-all duration-300 ${
                isDone
                  ? 'text-emerald-400 opacity-90'
                  : isCurrent
                  ? 'text-white font-semibold opacity-100'
                  : 'text-zinc-600 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-white animate-spin shrink-0 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-800 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
