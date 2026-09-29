import React, { useState, useRef } from 'react';
import {
  FileText,
  Building,
  Briefcase,
  Sparkles,
  Upload,
  Trash2,
  ArrowRight,
  Code2,
  Wand2,
} from 'lucide-react';
import { CoverLetterInput } from '../types/career';
import { parseCVFile } from '../utils/fileParser';

interface CoverLetterPanelProps {
  input: CoverLetterInput;
  onChange: (updated: Partial<CoverLetterInput>) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const SAMPLE_DATA: CoverLetterInput = {
  candidateCv: `ALEX RIVERA
Email: alex.rivera@example.com | Location: Austin, TX | GitHub: github.com/arivera

SUMMARY:
Results-driven Senior Full-Stack Engineer with 6+ years experience designing and scaling microservices with TypeScript, React, Node.js, GraphQL, PostgreSQL, and AWS. Strong track record architecting platforms handling 15M+ daily requests, driving test coverage to 85%+, and mentoring 4 engineers. AWS Certified Solutions Architect.

EXPERIENCE:
Senior Full Stack Engineer | CloudScale Inc. (2022 - Present)
- Architected high-throughput Node.js microservices processing 15M daily events with 99.99% uptime.
- Optimized PostgreSQL database indexes and Redis caching, cutting average query latency by 45%.
- Maintained Docker containers and Kubernetes clusters across multi-region AWS infrastructure.
- Mentored 4 engineers in design patterns, RFC reviews, and clean architecture principles.

Full Stack Developer | NexaTech Solutions (2019 - 2022)
- Built enterprise client dashboard in React, TypeScript, and Redux Toolkit.
- Integrated Stripe billing and OAuth 2.0 authentication workflows.
- Led unit and integration test automation with Jest and Cypress, reducing regression bugs by 35%.`,
  jobDescription: `Position: Lead Platform Architect
Company: Stripe
We are seeking a Lead Platform Architect to head our core developer infrastructure and distributed platform team.

Top Requirements:
1. 6+ years designing scalable, fault-tolerant distributed systems and microservices in high-throughput production environments.
2. Hands-on mastery of cloud infrastructure (AWS/GCP), container orchestration (Kubernetes, Docker), and resilient database architecture (PostgreSQL, Redis).
3. Demonstrated engineering leadership: ability to drive technical RFCs, mentor senior and junior developers, and elevate code quality across squads.`,
  companyName: 'Stripe',
};

export const CoverLetterPanel: React.FC<CoverLetterPanelProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
}) => {
  const [inputMode, setInputMode] = useState<'form' | 'raw'>('form');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = input.candidateCv
    ? input.candidateCv.trim().split(/\s+/).filter(Boolean).length
    : 0;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const extractedText = await parseCVFile(file);
      if (extractedText && extractedText.trim()) {
        onChange({ candidateCv: extractedText.trim() });
      }
    } catch (err) {
      console.error('Failed to parse file:', err);
      // Fallback
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          onChange({ candidateCv: content });
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleLoadSample = () => {
    onChange(SAMPLE_DATA);
  };

  const handleRawChange = (text: string) => {
    onChange({ rawTaggedInput: text });

    const cvMatch = text.match(
      /\[CANDIDATE CV\]:?\s*([\s\S]*?)(?=\[(?:JOB DESCRIPTION|COMPANY NAME)\]|$)/i
    );
    const jdMatch = text.match(
      /\[JOB DESCRIPTION\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|COMPANY NAME)\]|$)/i
    );
    const compMatch = text.match(
      /\[COMPANY NAME\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|JOB DESCRIPTION)\]|$)/i
    );

    const updates: Partial<CoverLetterInput> = {};
    if (cvMatch && cvMatch[1]) updates.candidateCv = cvMatch[1].trim();
    if (jdMatch && jdMatch[1]) updates.jobDescription = jdMatch[1].trim();
    if (compMatch && compMatch[1]) updates.companyName = compMatch[1].trim();

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  };

  const isSubmitDisabled =
    (!input.candidateCv.trim() && !input.rawTaggedInput?.trim()) ||
    (!input.jobDescription.trim() && !input.rawTaggedInput?.trim()) ||
    isLoading;

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Top Banner */}
      <div className="px-5 py-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Cover Letter & STAR Achievement Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
          >
            Load Sample (Alex @ Stripe)
          </button>

          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800 text-xs">
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

      <div className="p-5 sm:p-7 space-y-6">
        {inputMode === 'raw' ? (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Raw Input Block ([CANDIDATE CV], [JOB DESCRIPTION], [COMPANY NAME])
            </label>
            <p className="text-xs text-slate-400">
              Format: <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">[CANDIDATE CV]: ... [JOB DESCRIPTION]: ... [COMPANY NAME]: ...</code>
            </p>
            <textarea
              value={input.rawTaggedInput || ''}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[CANDIDATE CV]:&#10;Paste resume...&#10;&#10;[JOB DESCRIPTION]:&#10;Paste target job posting requirements...&#10;&#10;[COMPANY NAME]:&#10;Stripe"
              rows={12}
              className="w-full px-4 py-3 bg-slate-950/90 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-600 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
            />
          </div>
        ) : (
          <>
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Building className="w-4 h-4 text-indigo-400" />
                Target Company Name
                <span className="text-xs font-normal text-rose-400">*required</span>
              </label>
              <input
                type="text"
                value={input.companyName}
                onChange={(e) => onChange({ companyName: e.target.value })}
                placeholder="e.g., Stripe, Google, Datadog, Anthropic, Shopify"
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                Target Job Description (JD)
                <span className="text-xs font-normal text-rose-400">*required</span>
              </label>
              <textarea
                value={input.jobDescription}
                onChange={(e) => onChange({ jobDescription: e.target.value })}
                placeholder="Paste the target job description or requirements here. The AI recruiter will identify the top 3 core requirements..."
                rows={5}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
              />
            </div>

            {/* Candidate CV */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  Candidate CV / Resume Text
                  <span className="text-xs font-normal text-rose-400">*required</span>
                </label>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{wordCount} words</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md,.text"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                  {input.candidateCv && (
                    <button
                      type="button"
                      onClick={() => onChange({ candidateCv: '' })}
                      className="px-2 py-1 rounded bg-slate-800/50 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 border border-slate-700/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={input.candidateCv}
                onChange={(e) => onChange({ candidateCv: e.target.value })}
                placeholder="Paste candidate work history, key achievements, and skills..."
                rows={7}
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
              />
            </div>
          </>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
              isSubmitDisabled
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                : 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-indigo-400/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Crafting Cover Letter & STAR Bullets...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-indigo-200" />
                <span>Generate Optimized Cover Letter & 3 STAR Bullets</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
