import React, { useState, useRef } from 'react';
import {
  Search,
  ExternalLink,
  Copy,
  Check,
  Briefcase,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  Upload,
  Trash2,
  Code2,
  User,
  Sliders,
  Sparkles,
  HelpCircle,
  FileCode,
  Tag,
  Wrench,
  Wand2,
  Globe,
  RotateCcw,
  Loader2,
} from 'lucide-react';
import { CareerMatcherResult, CareerMatcherInput } from '../types/career';
import { safeFetch } from '../utils/api';
import { SAMPLE_PROFILES, SampleProfile } from '../data/sampleProfiles';
import { parseCVFile } from '../utils/fileParser';

interface CareerMatcherViewProps {
  initialCv?: string;
}

const WORK_TYPES = ['Full-time', 'Contract', 'Part-time', 'Apprenticeship'];

const LOCATION_PRESETS = [
  'Remote',
  'San Francisco, CA',
  'New York, NY',
  'London, UK',
  'Austin, TX',
  'Berlin, Germany',
];

const INITIAL_INPUT: CareerMatcherInput = {
  candidateCv: '',
  targetLocation: 'Remote',
  preferredWorkType: 'Full-time',
};

export const CareerMatcherView: React.FC<CareerMatcherViewProps> = ({ initialCv = '' }) => {
  const [input, setInput] = useState<CareerMatcherInput>({
    ...INITIAL_INPUT,
    candidateCv: initialCv,
  });
  const [inputMode, setInputMode] = useState<'form' | 'raw'>('form');
  const [result, setResult] = useState<CareerMatcherResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy states
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

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
        setInput((prev) => ({ ...prev, candidateCv: extractedText.trim() }));
      }
    } catch (err) {
      console.error('File parsing error:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result;
        if (typeof content === 'string') {
          setInput((prev) => ({ ...prev, candidateCv: content }));
        }
      };
      reader.readAsText(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = (sample: SampleProfile) => {
    setInput({
      candidateCv: sample.data.candidateCv,
      targetLocation: sample.data.locationPreference || 'Remote',
      preferredWorkType: 'Full-time',
    });
    setErrorMessage(null);
  };

  const handleRawChange = (text: string) => {
    setInput((prev) => ({ ...prev, rawTaggedInput: text }));

    const cvMatch = text.match(
      /\[CANDIDATE CV\]:?\s*([\s\S]*?)(?=\[(?:TARGET LOCATION|PREFERRED WORK TYPE)\]|$)/i
    );
    const locMatch = text.match(
      /\[TARGET LOCATION\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|PREFERRED WORK TYPE)\]|$)/i
    );
    const wtMatch = text.match(
      /\[PREFERRED WORK TYPE\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|TARGET LOCATION)\]|$)/i
    );

    const updates: Partial<CareerMatcherInput> = {};
    if (cvMatch && cvMatch[1]) updates.candidateCv = cvMatch[1].trim();
    if (locMatch && locMatch[1]) updates.targetLocation = locMatch[1].trim();
    if (wtMatch && wtMatch[1]) updates.preferredWorkType = wtMatch[1].trim();

    if (Object.keys(updates).length > 0) {
      setInput((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleSubmit = async () => {
    const isRaw = !!input.rawTaggedInput?.trim();
    if (!isRaw && !input.candidateCv.trim()) {
      setErrorMessage('Please provide candidate CV text.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await safeFetch('/api/career-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to match career parameters.');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Career match error:', err);
      setErrorMessage(err.message || 'An error occurred while generating job matches.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyBoolean = () => {
    if (!result?.jobMatchStrategy.booleanSearchKeywords) return;
    navigator.clipboard.writeText(result.jobMatchStrategy.booleanSearchKeywords);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
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

      {/* Input Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-7 space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              AI Job Matcher & Search Strategist
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick sample buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Sample:
              </span>
              {SAMPLE_PROFILES.slice(0, 2).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleLoadSample(s)}
                  className="px-2 py-0.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                >
                  {s.name}
                </button>
              ))}
            </div>

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
              Raw Tagged Input Block
            </label>
            <p className="text-xs text-slate-400">
              Format: <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">[CANDIDATE CV]: ... [TARGET LOCATION]: ... [PREFERRED WORK TYPE]: ...</code>
            </p>
            <textarea
              value={input.rawTaggedInput || ''}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[CANDIDATE CV]:&#10;Paste resume...&#10;&#10;[TARGET LOCATION]:&#10;Remote&#10;&#10;[PREFERRED WORK TYPE]:&#10;Full-time"
              rows={10}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <>
            {/* Candidate CV */}
            <div className="space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Candidate CV / Resume Text
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
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                  </button>
                  {input.candidateCv && (
                    <button
                      type="button"
                      onClick={() => setInput((p) => ({ ...p, candidateCv: '' }))}
                      className="px-2 py-1 rounded bg-slate-800/50 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 border border-slate-700/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <textarea
                value={input.candidateCv}
                onChange={(e) => setInput({ ...input, candidateCv: e.target.value })}
                placeholder="Paste candidate work history, tech skills, and achievements..."
                rows={7}
                className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            {/* Location & Preferred Work Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Target Location
                </label>
                <input
                  type="text"
                  value={input.targetLocation}
                  onChange={(e) => setInput({ ...input, targetLocation: e.target.value })}
                  placeholder="e.g., Remote, London, San Francisco"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LOCATION_PRESETS.slice(0, 4).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setInput({ ...input, targetLocation: loc })}
                      className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 border border-slate-700/60"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  Preferred Work Type
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {WORK_TYPES.map((wt) => (
                    <button
                      key={wt}
                      type="button"
                      onClick={() => setInput({ ...input, preferredWorkType: wt })}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                        input.preferredWorkType === wt
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {wt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || (!input.candidateCv.trim() && !input.rawTaggedInput?.trim())}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Analyzing Skills & Synthesizing External Search URLs...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Build Targeted Job Search Parameters & External Links</span>
              <ArrowRight className="w-4 h-4 opacity-80" />
            </>
          )}
        </button>

        {isLoading && (
          <div className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3 mt-4 text-left">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Matcher Progress</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Extracting raw system credentials and location tags...</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-indigo-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
                <span>Identifying missing technical keys & generating boolean filters...</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-800 shrink-0" />
                <span>Formatting search URLs for LinkedIn, Indeed and Google Jobs...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="text-base font-bold text-white">
                  Targeted Job Match Strategy & Live Search Links
                </h4>
                <p className="text-xs text-slate-400">
                  Constructed functional URLs for LinkedIn, Indeed, and Google Jobs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
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
          </div>

          {/* 1. Candidate Profile Overview */}
          <div className="p-5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-white">
                  {result.candidateProfile.extractedName || 'Candidate Profile'}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {result.candidateProfile.primaryTitle}
                </span>
              </div>

              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {result.candidateProfile.experienceLevel} Level
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Core Skills */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" /> Core Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.candidateProfile.coreSkills?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools & Technologies */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Wrench className="w-3.5 h-3.5 text-cyan-400" /> Tools & Technologies
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.candidateProfile.toolsAndTechnologies?.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-200 border border-cyan-500/20 text-xs font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Job Match Strategy (Titles, Boolean string, Suggested filters) */}
          <div className="p-5 bg-slate-950/70 rounded-xl border border-slate-800 space-y-4">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Target Job Titles & Recommended Filters
            </h5>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 mr-1">Target Titles:</span>
              {result.jobMatchStrategy.targetJobTitles?.map((title, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold"
                >
                  {title}
                </span>
              ))}
            </div>

            {/* Boolean Search String */}
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  Optimized Boolean Search String:
                </span>
                <code className="text-xs text-indigo-200 font-mono select-all">
                  {result.jobMatchStrategy.booleanSearchKeywords}
                </code>
              </div>

              <button
                type="button"
                onClick={handleCopyBoolean}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 shrink-0"
              >
                {copiedQuery ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Query</span>
                  </>
                )}
              </button>
            </div>

            {/* Suggested filters */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Suggested Filters:
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Remote Allowed: {result.jobMatchStrategy.suggestedFilters.remoteAllowed ? 'Yes (Remote Enabled)' : 'On-Site / Hybrid'}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Filter Level: {result.jobMatchStrategy.suggestedFilters.experienceLevel}
              </span>
            </div>
          </div>

          {/* 3. Live Functional External Search Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Direct Functional Job Search Portals
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* LinkedIn */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#70B5F9]">LinkedIn Jobs</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#0A66C2]/20 text-[#70B5F9] font-mono">
                      URL-Encoded
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Pre-filtered with boolean keywords and location
                  </p>
                </div>

                <a
                  href={result.externalSearchLinks.linkedInUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <span>Search on LinkedIn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Indeed */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-300">Indeed Jobs</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-600/20 text-blue-300 font-mono">
                      URL-Encoded
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    Targeted by title and location filters
                  </p>
                </div>

                <a
                  href={result.externalSearchLinks.indeedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <span>Search on Indeed</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Google Jobs */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-300">Google Jobs</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                      Optimized Query
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 font-mono">
                    "{result.externalSearchLinks.googleJobsQuery}"
                  </p>
                </div>

                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(result.externalSearchLinks.googleJobsQuery)}&ibp=htl;jobs`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <span>Search on Google Jobs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 4. Diagnostic Questions */}
          {result.diagnosticQuestions?.length > 0 && (
            <div className="p-5 bg-slate-950/80 border border-indigo-500/20 rounded-xl space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                Follow-Up Diagnostic Questions to Refine Your Search
              </h5>
              <div className="space-y-2">
                {result.diagnosticQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Raw JSON Inspector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" /> Strict Raw JSON (Clean Output):
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
