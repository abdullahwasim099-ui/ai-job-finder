import React, { useEffect, useState } from 'react';
import { Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

const STEPS = [
  'Extracting technical hard skills, soft skills, and years of experience...',
  'Evaluating current seniority tier against target role expectations...',
  'Calculating overall ATS role compatibility and multi-factor breakdown...',
  'Detecting skill gaps, missing keywords, and recruiter red flags...',
  'Rewriting key bullet points using the STAR method with quantified results...',
  'Formulating optimized job search queries and diagnostic questions...',
];

export const LoadingScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 2200);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-8 sm:p-12 shadow-2xl backdrop-blur-md max-w-xl mx-auto my-8 text-center space-y-6">
      {/* Animated Radar Pulse */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full bg-violet-600/30 animate-pulse" />
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
          <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">Analyzing Resume & Role Compatibility</h3>
        <p className="text-xs sm:text-sm text-slate-400">
          CareerPulse ATS engine is parsing skills, calculating weighted compatibility, and engineering STAR bullets
        </p>
      </div>

      {/* Step Indicators */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-left space-y-2.5">
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 text-xs transition-opacity duration-300 ${
                isDone
                  ? 'text-emerald-400 opacity-90'
                  : isCurrent
                  ? 'text-indigo-300 font-semibold opacity-100'
                  : 'text-slate-500 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : isCurrent ? (
                <div className="w-4 h-4 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0 mt-0.5" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0 mt-0.5" />
              )}
              <span className="leading-tight">{step}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
