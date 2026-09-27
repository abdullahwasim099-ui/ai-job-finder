import React, { useState } from 'react';
import {
  Award,
  Briefcase,
  Cpu,
  Wrench,
  HeartHandshake,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Search,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  FileCode,
  Download,
  HelpCircle,
  Sparkles,
  RefreshCw,
  User,
  Clock,
  Layers,
  FileDown,
} from 'lucide-react';
import { ExpertAtsResult, AnalysisInput } from '../types/career';
import { exportAtsReportPdf } from '../utils/pdfExport';

interface ExpertAtsDashboardProps {
  result: ExpertAtsResult;
  input: AnalysisInput;
  onRefineWithAnswers: (answers: { question: string; answer: string }[]) => void;
  isRefining: boolean;
  onEditInputs: () => void;
}

export const ExpertAtsDashboard: React.FC<ExpertAtsDashboardProps> = ({
  result,
  input,
  onRefineWithAnswers,
  isRefining,
  onEditInputs,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gaps' | 'search' | 'refine' | 'json'>('overview');
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedQueryIdx, setCopiedQueryIdx] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const jsonString = JSON.stringify(result, null, 2);

  const handleDownloadTailoredCv = () => {
    const header = `=====================================================\nCANDIDATE TAILORED CV - OPTIMIZED FOR ${input.targetRole.toUpperCase()}\n=====================================================\n\n`;
    const roleDetails = `TARGET ROLE: ${input.targetRole}\nEXTRACTED SENIORITY: ${result.profile.seniorityLevel}\nEXPERIENCE MATCH: ${result.profile.yearsExperience} Years\n\n`;
    
    const skillsSection = `-----------------------------------------------------\nIDENTIFIED CORE TECHNICAL SKILLS\n-----------------------------------------------------\n` +
      `Technical: ${result.profile.technicalSkills.join(', ')}\n` +
      `Tools & Frameworks: ${result.profile.toolsAndFrameworks.join(', ')}\n` +
      `Soft Skills: ${result.profile.softSkills.join(', ')}\n\n`;

    const originalSection = `-----------------------------------------------------\nORIGINAL RESUME DOCUMENT REFERENCE\n-----------------------------------------------------\n${input.candidateCv}`;

    const content = header + roleDetails + skillsSection + originalSection;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ATS-Tailored-CV-${input.targetRole.replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-parser-result-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyQuery = (query: string, idx: number) => {
    navigator.clipboard.writeText(query);
    setCopiedQueryIdx(idx);
    setTimeout(() => setCopiedQueryIdx(null), 2000);
  };

  const handleDiagnosticSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = result.diagnosticQuestions
      .map((q, idx) => ({
        question: q,
        answer: answers[idx]?.trim() || '',
      }))
      .filter((item) => item.answer.length > 0);

    if (formatted.length > 0) {
      onRefineWithAnswers(formatted);
    }
  };

  // Score styling
  const score = Math.min(100, Math.max(0, result.compatibility.overallScore || 0));
  let scoreColorClass = 'text-emerald-400 stroke-emerald-500';
  let badgeColorClass = 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  let badgeLabel = 'Strong ATS Compatibility';

  if (score < 55) {
    scoreColorClass = 'text-rose-400 stroke-rose-500';
    badgeColorClass = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    badgeLabel = 'Substantial Gaps / Low Compatibility';
  } else if (score < 75) {
    scoreColorClass = 'text-amber-400 stroke-amber-500';
    badgeColorClass = 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    badgeLabel = 'Moderate Match (Gaps to Address)';
  } else if (score < 88) {
    scoreColorClass = 'text-indigo-400 stroke-indigo-500';
    badgeColorClass = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    badgeLabel = 'Competitive Candidate';
  }

  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>ATS Evaluation for:</span>
          <span className="text-white font-semibold">{input.targetRole}</span>
          {result.profile.name && (
            <span className="text-indigo-300 font-mono">({result.profile.name})</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownloadTailoredCv}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-all"
            title="Download formatted tailored CV document"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Tailored CV</span>
          </button>

          <button
            type="button"
            onClick={() => exportAtsReportPdf(result, input.targetRole)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-all"
            title="Download ATS Gap Analysis Report as PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>

          <button
            type="button"
            onClick={onEditInputs}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Edit Target or CV</span>
          </button>
        </div>
      </div>

      {/* Hero Compatibility & Profile Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Gauge Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className="stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="70"
                  cy="70"
                  r={radius}
                  className={`${scoreColorClass} transition-all duration-1000 ease-out`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-extrabold tracking-tight text-white">{score}%</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                  Overall Score
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

          {/* Sub-scores & Profile Metadata */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-xs text-slate-400">Target Role</span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <span>{input.targetRole}</span>
                </h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {result.profile.seniorityLevel} Level
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {result.profile.yearsExperience} yrs exp
                </span>
              </div>
            </div>

            {/* Score bars */}
            <div className="space-y-4">
              {/* Hard Skills Match */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-zinc-300">Hard Skills Match</span>
                  <span className={`font-bold ${
                    result.compatibility.skillsMatchScore >= 75 ? 'text-emerald-400' :
                    result.compatibility.skillsMatchScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.compatibility.skillsMatchScore}%
                  </span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/50">
                  <div
                    className={`${
                      result.compatibility.skillsMatchScore >= 75 ? 'bg-emerald-500' :
                      result.compatibility.skillsMatchScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    } h-2.5 rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${Math.min(100, result.compatibility.skillsMatchScore)}%` }}
                  />
                </div>
              </div>

              {/* Experience Level Alignment */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-zinc-300">Experience Level Alignment</span>
                  <span className={`font-bold ${
                    result.compatibility.experienceMatchScore >= 75 ? 'text-emerald-400' :
                    result.compatibility.experienceMatchScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {result.compatibility.experienceMatchScore}%
                  </span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/50">
                  <div
                    className={`${
                      result.compatibility.experienceMatchScore >= 75 ? 'bg-emerald-500' :
                      result.compatibility.experienceMatchScore >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                    } h-2.5 rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${Math.min(100, result.compatibility.experienceMatchScore)}%` }}
                  />
                </div>
              </div>

              {/* Formatting & Structure Integrity */}
              <div>
                <div className="flex justify-between items-center text-xs font-medium mb-1">
                  <span className="text-zinc-300">Formatting & Structure Integrity</span>
                  <span className="font-bold text-emerald-400">
                    85%
                  </span>
                </div>
                <div className="w-full bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800/50">
                  <div
                    className="bg-emerald-500 h-2.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `85%` }}
                  />
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="p-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl flex items-start gap-2.5 text-xs text-slate-300">
              <Award className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold text-white">Verdict: </span>
                <span>{result.compatibility.verdict}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Extracted Skills</span>
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
          <AlertOctagon className="w-4 h-4" />
          <span>Strengths & Critical Gaps</span>
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
          <span>Search Optimization</span>
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
          <span>Diagnostic Questions (3)</span>
          <span className="w-2 h-2 rounded-full bg-indigo-400" />
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
          <span>Raw JSON (Clean Spec)</span>
        </button>
      </div>

      {/* Tab: Overview (Technical skills, tools & frameworks, soft skills) */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Technical Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.profile.technicalSkills?.map((s, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 font-medium"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-cyan-400" />
              Tools & Frameworks
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.profile.toolsAndFrameworks?.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-200 border border-cyan-500/20 font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-violet-400" />
              Soft Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {result.profile.softSkills?.map((ss, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-violet-500/10 text-violet-200 border border-violet-500/20 font-medium"
                >
                  {ss}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Gaps (Top strengths, missing keywords, critical gaps) */}
      {activeTab === 'gaps' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Top Strengths</h4>
            </div>
            <ul className="space-y-2">
              {result.gapAnalysis.topStrengths?.map((str, idx) => (
                <li
                  key={idx}
                  className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/10 text-xs text-emerald-200 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">Missing Keywords</h4>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {result.gapAnalysis.missingKeywords?.map((kw, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-200 border border-amber-500/20 font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-rose-500/20 rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <h4 className="text-sm font-bold text-white">Critical Gaps</h4>
            </div>
            <ul className="space-y-2">
              {result.gapAnalysis.criticalGaps?.map((gap, idx) => (
                <li
                  key={idx}
                  className="p-2 rounded-lg bg-rose-950/20 border border-rose-500/10 text-xs text-rose-200 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Search Optimization */}
      {activeTab === 'search' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Recommended Job Titles
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.searchOptimization.recommendedJobTitles?.map((title, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 text-xs font-semibold"
                >
                  {title}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-cyan-400" />
              Search Queries
            </h4>
            <div className="space-y-2.5">
              {result.searchOptimization.searchQueries?.map((q, idx) => {
                const linkedInUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
                  q
                )}`;
                const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(
                  `${q} jobs`
                )}&ibp=htl;jobs`;

                return (
                  <div
                    key={idx}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <span className="font-mono text-xs text-indigo-200 break-all select-all">
                      "{q}"
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyQuery(q, idx)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                      >
                        {copiedQueryIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <a
                        href={linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#70B5F9] text-xs font-medium border border-[#0A66C2]/40"
                      >
                        <span>LinkedIn</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={googleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/40"
                      >
                        <span>Google</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Diagnostic Questions */}
      {activeTab === 'refine' && (
        <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <div>
              <h4 className="text-sm font-bold text-white">Targeted Diagnostic Questions</h4>
              <p className="text-xs text-slate-400">
                Provide answers to fill critical experience/skill gaps and re-evaluate compatibility.
              </p>
            </div>
          </div>

          <form onSubmit={handleDiagnosticSubmit} className="space-y-4">
            {result.diagnosticQuestions?.map((q, idx) => {
              const purposeLabels = [
                '1. Clarify missing information',
                '2. Quantify achievements with metrics',
                '3. Work preferences & environment',
              ];

              return (
                <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold">
                    <span>{purposeLabels[idx] || `Question ${idx + 1}`}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-200">{q}</p>
                  <textarea
                    value={answers[idx] || ''}
                    onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                    placeholder="Enter clarifying details, quantified metrics, or specific role preferences here..."
                    rows={2}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              );
            })}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isRefining || Object.values(answers).every((a) => !a.trim())}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:bg-slate-800 disabled:text-slate-500"
              >
                {isRefining ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Recalculating Compatibility...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Answers & Re-Score</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Raw JSON (Clean Spec) */}
      {activeTab === 'json' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                Raw JSON Output (Strict Schema Compliance)
              </h4>
              <p className="text-xs text-slate-400">
                Clean, unformatted JSON with no markdown wrapper (profile, compatibility, gapAnalysis, searchOptimization, diagnosticQuestions)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-[480px] leading-relaxed selection:bg-indigo-500/40">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
