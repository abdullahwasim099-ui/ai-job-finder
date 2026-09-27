import React, { useState } from 'react';
import {
  FileCheck,
  Building,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  AlertOctagon,
  Copy,
  Check,
  Code2,
  Wand2,
  Layers,
  ArrowRight,
  Lightbulb,
  FileCode,
  Tag,
  RotateCcw,
} from 'lucide-react';
import { AtsPostingScoreResult, AtsPostingScoreInput } from '../types/career';

interface AtsPostingScorerViewProps {
  initialProfileJson?: string;
}

const SAMPLE_PROFILE_JSON = JSON.stringify(
  {
    candidateProfile: {
      extractedName: 'Alex Rivera',
      experienceLevel: 'Senior',
      primaryTitle: 'Senior Full-Stack Engineer / Distributed Systems',
      coreSkills: [
        'Distributed Systems',
        'Microservices Architecture',
        'API Design',
        'Performance Optimization',
        'Database Scaling',
      ],
      toolsAndTechnologies: [
        'TypeScript',
        'Node.js',
        'PostgreSQL',
        'Redis',
        'AWS',
        'Docker',
        'Kubernetes',
        'GraphQL',
      ],
    },
    jobMatchStrategy: {
      targetJobTitles: ['Lead Platform Architect', 'Staff Infrastructure Engineer', 'Principal Backend Engineer'],
      booleanSearchKeywords: '(Node.js OR TypeScript) AND (Microservices OR "Distributed Systems") AND (AWS OR Kubernetes)',
      suggestedFilters: {
        remoteAllowed: true,
        experienceLevel: 'Senior',
      },
    },
  },
  null,
  2
);

const SAMPLE_JOB_POSTING = {
  title: 'Lead Platform Architect',
  company: 'Stripe',
  description: `Stripe is looking for a Lead Platform Architect to steer our global developer infrastructure.
Responsibilities:
- Architect high-throughput distributed microservices handling billions in financial volume.
- Optimize multi-region PostgreSQL clusters, Redis caches, and Kafka event streams.
- Mentor senior engineers, drive architecture RFCs, and maintain 99.999% availability.
Requirements:
- 7+ years building resilient distributed backends with Node.js/Go and cloud native architecture (AWS/GCP, Kubernetes).
- Deep expertise in Kafka streaming, event sourcing, and high-concurrency transactional databases.
- Proven leadership in cross-functional technical RFC reviews.`,
};

export const AtsPostingScorerView: React.FC<AtsPostingScorerViewProps> = ({
  initialProfileJson = '',
}) => {
  const [input, setInput] = useState<AtsPostingScoreInput>({
    parsedCvProfile: initialProfileJson || SAMPLE_PROFILE_JSON,
    jobTitle: SAMPLE_JOB_POSTING.title,
    company: SAMPLE_JOB_POSTING.company,
    jobDescription: SAMPLE_JOB_POSTING.description,
  });

  const [inputMode, setInputMode] = useState<'form' | 'raw'>('form');
  const [result, setResult] = useState<AtsPostingScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const handleRawChange = (text: string) => {
    setInput((prev) => ({ ...prev, rawTaggedInput: text }));

    const cvMatch = text.match(/\[PARSED CV PROFILE\]:?\s*([\s\S]*?)(?=\[JOB LISTING DATA\]|$)/i);
    const jobBlockMatch = text.match(/\[JOB LISTING DATA\]:?\s*([\s\S]*?)$/i);

    const updates: Partial<AtsPostingScoreInput> = {};
    if (cvMatch && cvMatch[1]) updates.parsedCvProfile = cvMatch[1].trim();

    if (jobBlockMatch && jobBlockMatch[1]) {
      const block = jobBlockMatch[1];
      const titleMatch = block.match(/-\s*Title:?\s*(.*?)(?=\n-|\n[A-Z]|$)/i);
      const compMatch = block.match(/-\s*Company:?\s*(.*?)(?=\n-|\n[A-Z]|$)/i);
      const descMatch = block.match(/-\s*Description:?\s*([\s\S]*?)$/i);

      if (titleMatch && titleMatch[1]) updates.jobTitle = titleMatch[1].trim();
      if (compMatch && compMatch[1]) updates.company = compMatch[1].trim();
      if (descMatch && descMatch[1]) updates.jobDescription = descMatch[1].trim();
    }

    if (Object.keys(updates).length > 0) {
      setInput((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleLoadSample = () => {
    setInput({
      parsedCvProfile: SAMPLE_PROFILE_JSON,
      jobTitle: SAMPLE_JOB_POSTING.title,
      company: SAMPLE_JOB_POSTING.company,
      jobDescription: SAMPLE_JOB_POSTING.description,
    });
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const isRaw = !!input.rawTaggedInput?.trim();
    if (!isRaw && !input.parsedCvProfile.trim()) {
      setErrorMessage('Please provide parsed candidate CV profile JSON or text.');
      return;
    }
    if (!isRaw && !input.jobDescription.trim()) {
      setErrorMessage('Please provide the target job listing description.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/score-posting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to calculate ATS posting score.');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Scoring error:', err);
      setErrorMessage(err.message || 'An error occurred while scoring the job posting.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* Input Panel */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              ATS Job Posting Comparison & Keyword Scoring
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              Load Sample (Alex @ Stripe)
            </button>

            <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setInputMode('form')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  inputMode === 'form'
                    ? 'bg-slate-800 text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Form
              </button>
              <button
                type="button"
                onClick={() => setInputMode('raw')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                  inputMode === 'raw'
                    ? 'bg-slate-800 text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>[TAGGED]</span>
              </button>
            </div>
          </div>
        </div>

        {inputMode === 'raw' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Raw Input Block ([PARSED CV PROFILE], [JOB LISTING DATA])
            </label>
            <p className="text-xs text-slate-400">
              Format: <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">[PARSED CV PROFILE]: &lt;JSON&gt; [JOB LISTING DATA]: - Title: ... - Company: ... - Description: ...</code>
            </p>
            <textarea
              value={input.rawTaggedInput || ''}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[PARSED CV PROFILE]:&#10;{ ... }&#10;&#10;[JOB LISTING DATA]:&#10;- Title: Lead Platform Architect&#10;- Company: Stripe&#10;- Description: Full description..."
              rows={12}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Parsed CV Profile */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>[PARSED CV PROFILE] (JSON or Structured Text)</span>
                <span className="text-[11px] text-slate-500 font-normal">Candidate baseline</span>
              </label>
              <textarea
                value={input.parsedCvProfile}
                onChange={(e) => setInput({ ...input, parsedCvProfile: e.target.value })}
                placeholder="Paste candidate JSON from Prompt 1 or parsed skills..."
                rows={11}
                className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
              />
            </div>

            {/* Right: Job Posting Info */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={input.jobTitle}
                    onChange={(e) => setInput({ ...input, jobTitle: e.target.value })}
                    placeholder="e.g., Lead Platform Architect"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={input.company}
                    onChange={(e) => setInput({ ...input, company: e.target.value })}
                    placeholder="e.g., Stripe, LinkedIn, Datadog"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Job Description (from LinkedIn or Indeed)
                </label>
                <textarea
                  value={input.jobDescription}
                  onChange={(e) => setInput({ ...input, jobDescription: e.target.value })}
                  placeholder="Paste the full job posting requirements and responsibilities..."
                  rows={8}
                  className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm font-sans focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !input.parsedCvProfile.trim() || !input.jobDescription.trim()}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Calculating Match Score & ATS Keyword Gaps...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Score Posting Compatibility & Extract Keyword Gaps</span>
              <ArrowRight className="w-4 h-4 opacity-80" />
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <FileCheck className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="text-base font-bold text-white">
                  ATS Compatibility Score & Keyword Gap Breakdown
                </h4>
                <p className="text-xs text-slate-400">
                  Benchmarked for {result.matchResults.jobTitle} at {result.matchResults.company}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>

          {/* Match Results Hero Banner */}
          <div className="p-6 bg-slate-950/70 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Score circle */}
            <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-900/70 rounded-xl border border-slate-800">
              <div
                className={`text-4xl font-extrabold mb-1 ${
                  result.matchResults.overallMatchScore >= 80
                    ? 'text-emerald-400'
                    : result.matchResults.overallMatchScore >= 60
                    ? 'text-amber-400'
                    : 'text-rose-400'
                }`}
              >
                {result.matchResults.overallMatchScore}%
              </div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Overall Match Score
              </span>
              <span
                className={`mt-2 text-xs font-bold px-3 py-1 rounded-full border ${
                  result.applicationAdvice.verdict.includes('Strong')
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : result.applicationAdvice.verdict.includes('Moderate')
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                }`}
              >
                {result.applicationAdvice.verdict}
              </span>
            </div>

            {/* Breakdown meters */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Skills Match Percentage</span>
                  <span className="text-indigo-300">
                    {result.matchResults.skillsMatchPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-indigo-500 transition-all duration-700"
                    style={{ width: `${result.matchResults.skillsMatchPercentage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Experience Match Percentage</span>
                  <span className="text-violet-300">
                    {result.matchResults.experienceMatchPercentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-violet-500 transition-all duration-700"
                    style={{ width: `${result.matchResults.experienceMatchPercentage}%` }}
                  />
                </div>
              </div>

              {/* 1-Line Customization Tip */}
              <div className="p-3 bg-indigo-950/20 border border-indigo-500/30 rounded-xl flex items-start gap-2 text-xs">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-indigo-300 mr-1">ATS Optimization Tip:</span>
                  <span className="text-slate-200">
                    {result.applicationAdvice.customizationTip}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compatibility Details (Matching skills vs Missing Critical Skills vs ATS Keyword Gaps) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Matching Skills */}
            <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Matching Skills ({result.compatibilityDetails.matchingSkills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.compatibilityDetails.matchingSkills?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-200 border border-emerald-500/20 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Skills */}
            <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-300">
                <AlertOctagon className="w-4 h-4 text-rose-400" />
                Missing Critical Skills (
                {result.compatibilityDetails.missingCriticalSkills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.compatibilityDetails.missingCriticalSkills?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-200 border border-rose-500/20 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* ATS Keyword Gaps */}
            <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                ATS Keyword Gaps ({result.compatibilityDetails.atsKeywordGaps?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {result.compatibilityDetails.atsKeywordGaps?.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-200 border border-amber-500/20 text-xs font-medium"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strict Raw JSON Inspector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              Strict Raw JSON (Expected Schema):
            </span>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
