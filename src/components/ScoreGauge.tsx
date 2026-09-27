import React from 'react';
import { Award, CheckCircle2, AlertTriangle, XCircle, TrendingUp, Briefcase } from 'lucide-react';
import { RoleMatch, ProfileSummary } from '../types/career';

interface ScoreGaugeProps {
  roleMatch: RoleMatch;
  profileSummary: ProfileSummary;
  targetRole: string;
  targetSalaryOrSeniority?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  roleMatch,
  profileSummary,
  targetRole,
  targetSalaryOrSeniority,
}) => {
  const score = Math.min(100, Math.max(0, roleMatch.overallScore || 0));

  // Determine score status styling
  let scoreColorClass = 'text-emerald-400 stroke-emerald-500';
  let badgeColorClass = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  let badgeLabel = 'Strong ATS Match';

  if (score < 55) {
    scoreColorClass = 'text-rose-400 stroke-rose-500';
    badgeColorClass = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    badgeLabel = 'Significant Skill/Experience Gap';
  } else if (score < 75) {
    scoreColorClass = 'text-amber-400 stroke-amber-500';
    badgeColorClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    badgeLabel = 'Moderate Match (Targeted Prep Needed)';
  } else if (score < 88) {
    scoreColorClass = 'text-indigo-400 stroke-indigo-500';
    badgeColorClass = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    badgeLabel = 'Solid Contender (Competitive)';
  }

  // SVG Gauge calculations
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Helper to determine progress bar coloring dynamically
  const getBarColorClass = (val: number) => {
    if (val >= 75) return 'bg-emerald-500';
    if (val >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getBarTextColorClass = (val: number) => {
    if (val >= 75) return 'text-emerald-400';
    if (val >= 50) return 'text-amber-400';
    return 'text-rose-400';
  };

  const skillsMatch = Math.min(100, Math.max(0, roleMatch.breakdown?.skillsMatch ?? 0));
  const experienceMatch = Math.min(100, Math.max(0, roleMatch.breakdown?.experienceMatch ?? 0));
  const structureMatch = Math.min(100, Math.max(0, roleMatch.breakdown?.qualificationMatch ?? 85));

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Column: Overall Gauge */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/80">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-zinc-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Progress animated circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={`${scoreColorClass} transition-all duration-1000 ease-out`}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
                {score}%
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mt-0.5">
                Role Match
              </span>
            </div>
          </div>

          <div className="mt-3 text-center">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeColorClass}`}
            >
              {badgeLabel}
            </span>
          </div>
        </div>

        {/* Right Column: Breakdown & Seniority Fit */}
        <div className="lg:col-span-7 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
              <span>Target Role Benchmark</span>
              <span className="font-mono text-zinc-300">{profileSummary.yearsOfExperience}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-zinc-400 shrink-0" />
              <span>{targetRole}</span>
            </h3>
            {targetSalaryOrSeniority && (
              <p className="text-xs text-zinc-300/90 mt-1">
                Target Level / Salary: {targetSalaryOrSeniority}
              </p>
            )}
          </div>

          {/* 3 Categories Breakdown: Skills, Experience, Formatting */}
          <div className="space-y-4 pt-1">
            {/* Hard Skills Match */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-1">
                <span className="text-zinc-300">Hard Skills Match</span>
                <span className={`font-bold ${getBarTextColorClass(skillsMatch)}`}>
                  {skillsMatch}%
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/50">
                <div
                  className={`${getBarColorClass(skillsMatch)} h-2.5 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${skillsMatch}%` }}
                />
              </div>
            </div>

            {/* Experience Level Alignment */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-1">
                <span className="text-zinc-300">Experience Level Alignment</span>
                <span className={`font-bold ${getBarTextColorClass(experienceMatch)}`}>
                  {experienceMatch}%
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/50">
                <div
                  className={`${getBarColorClass(experienceMatch)} h-2.5 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${experienceMatch}%` }}
                />
              </div>
            </div>

            {/* Formatting & Structure Integrity */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium mb-1">
                <span className="text-zinc-300">Formatting & Structure Integrity</span>
                <span className={`font-bold ${getBarTextColorClass(structureMatch)}`}>
                  {structureMatch}%
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/50">
                <div
                  className={`${getBarColorClass(structureMatch)} h-2.5 rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${structureMatch}%` }}
                />
              </div>
            </div>
          </div>

          {/* Seniority Assessment */}
          <div className="p-3 bg-zinc-950/60 border border-zinc-800/80 rounded-xl flex items-center justify-between text-xs">
            <span className="text-zinc-400">Extracted Seniority:</span>
            <span className="font-semibold text-zinc-100 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
              {profileSummary.extractedSeniority || 'Not determined'}
            </span>
          </div>
        </div>
      </div>

      {/* Verdict Banner */}
      {roleMatch.verdict && (
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-indigo-500/20 flex items-start gap-3">
          <Award className="w-5 h-5 text-indigo-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
              Advisor Verdict
            </span>
            <p className="text-sm text-slate-200 mt-0.5 leading-relaxed font-normal">
              {roleMatch.verdict}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
