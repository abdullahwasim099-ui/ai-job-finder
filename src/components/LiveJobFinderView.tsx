import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Building,
  DollarSign,
  Tag,
  ExternalLink,
  Sparkles,
  Search,
  Check,
  Copy,
  Globe,
  Code2,
  Wand2,
  FileCode,
  ShieldCheck,
  Layers,
  ArrowRight,
  Briefcase,
  Sliders,
  Send,
  Loader2,
} from 'lucide-react';
import { LiveJobSearchResult, LiveJobSearchInput, LiveJobListing } from '../types/career';
import { safeFetch } from '../utils/api';

interface LiveJobFinderViewProps {
  initialRole?: string;
  initialLocation?: string;
  initialSkills?: string;
  onSelectListingForScorer?: (listing: LiveJobListing) => void;
}

const PRESET_ROLES = [
  'Lead Platform Architect',
  'Senior Staff AI Engineer',
  'Principal Distributed Systems Engineer',
  'Head of Cloud Infrastructure',
];

const PRESET_LOCATIONS = ['Remote', 'San Francisco, CA', 'New York, NY', 'London, UK', 'Austin, TX'];

export const LiveJobFinderView: React.FC<LiveJobFinderViewProps> = ({
  initialRole = 'Lead Platform Architect',
  initialLocation = 'Remote',
  initialSkills = 'Distributed Systems, Microservices, Node.js, AWS, Kubernetes, Kafka',
  onSelectListingForScorer,
}) => {
  const [input, setInput] = useState<LiveJobSearchInput>({
    targetRole: initialRole,
    location: initialLocation,
    skills: initialSkills,
  });

  const [inputMode, setInputMode] = useState<'form' | 'raw'>('form');
  const [result, setResult] = useState<LiveJobSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);

  const handleRawChange = (text: string) => {
    setInput((prev) => ({ ...prev, rawSystemInput: text }));

    const roleMatch = text.match(
      /\[TARGET ROLE\]:?\s*([\s\S]*?)(?=\[(?:LOCATION|SKILLS)\]|$)/i
    );
    const locMatch = text.match(
      /\[LOCATION\]:?\s*([\s\S]*?)(?=\[(?:TARGET ROLE|SKILLS)\]|$)/i
    );
    const skillsMatch = text.match(/\[SKILLS\]:?\s*([\s\S]*?)$/i);

    const updates: Partial<LiveJobSearchInput> = {};
    if (roleMatch && roleMatch[1]) updates.targetRole = roleMatch[1].trim();
    if (locMatch && locMatch[1]) updates.location = locMatch[1].trim();
    if (skillsMatch && skillsMatch[1]) updates.skills = skillsMatch[1].trim();

    if (Object.keys(updates).length > 0) {
      setInput((prev) => ({ ...prev, ...updates }));
    }
  };

  const handleSearch = async () => {
    const isRaw = !!input.rawSystemInput?.trim();
    if (!isRaw && !input.targetRole.trim()) {
      setErrorMessage('Please specify the target role.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await safeFetch('/api/live-job-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search live jobs.');
      }

      setResult(data);
    } catch (err: any) {
      console.error('Live search error:', err);
      setErrorMessage(err.message || 'An error occurred while finding live job postings.');
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
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs sm:text-sm">
          {errorMessage}
        </div>
      )}

      {/* Input Section - Borderless Container separated by hair-line border and whitespace */}
      <div className="border-t border-slate-800/80 pt-6 space-y-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
              <Compass className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Executive Live Job Finder
              </h3>
              <p className="text-xs text-slate-400">
                Grounding via Google Search for active LinkedIn, Indeed, Glassdoor & Company listings
              </p>
            </div>
          </div>

          {/* Interactive Floating Pill Mode Filter */}
          <div className="flex items-center p-1 bg-slate-950/90 rounded-full border border-slate-800 text-xs shadow-inner">
            <button
              type="button"
              onClick={() => setInputMode('form')}
              className={`px-3 py-1 rounded-full transition-all ${
                inputMode === 'form'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Form
            </button>
            <button
              type="button"
              onClick={() => setInputMode('raw')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                inputMode === 'raw'
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>[TAGGED]</span>
            </button>
          </div>
        </div>

        {inputMode === 'raw' ? (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Raw Input Block ([TARGET ROLE], [LOCATION], [SKILLS])
            </label>
            <p className="text-xs text-slate-500">
              Format: <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">[TARGET ROLE]: ... [LOCATION]: ... [SKILLS]: ...</code>
            </p>
            <textarea
              value={input.rawSystemInput || ''}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[TARGET ROLE]:&#10;Lead Platform Architect&#10;&#10;[LOCATION]:&#10;Remote&#10;&#10;[SKILLS]:&#10;Distributed Systems, Node.js, AWS, Kubernetes, Kafka"
              rows={8}
              className="w-full p-4 bg-slate-950/90 border border-slate-800 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Role Title */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={input.targetRole}
                  onChange={(e) => setInput({ ...input, targetRole: e.target.value })}
                  placeholder="e.g., Lead Platform Architect"
                  className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {PRESET_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setInput({ ...input, targetRole: r })}
                      className="px-2.5 py-1 text-[11px] rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/50 transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">
                  Location (City / Country or Remote)
                </label>
                <input
                  type="text"
                  value={input.location}
                  onChange={(e) => setInput({ ...input, location: e.target.value })}
                  placeholder="e.g., Remote, San Francisco, London"
                  className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {PRESET_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setInput({ ...input, location: loc })}
                      className="px-2.5 py-1 text-[11px] rounded-full bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/50 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Target Skills & Tech Stack
              </label>
              <input
                type="text"
                value={input.skills}
                onChange={(e) => setInput({ ...input, skills: e.target.value })}
                placeholder="e.g., Distributed Systems, Microservices, Node.js, AWS, Kubernetes, Kafka"
                className="w-full px-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading || (!input.targetRole.trim() && !input.rawSystemInput?.trim())}
          className="w-full py-3.5 px-6 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer transition-all group"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Grounding Live Jobs via Google Search...</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Find 4 to 6 Real Active Job Postings</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {isLoading && (
          <div className="p-5 bg-slate-950/80 border border-slate-800/80 rounded-xl space-y-3.5 mt-4">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-white animate-spin shrink-0" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Grounded Job Search Progress</span>
            </div>
            <div className="space-y-2.5 text-left">
              <div className="flex items-center gap-2.5 text-xs text-emerald-400">
                <Check className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                <span>Initializing target role and key skills indices...</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-indigo-400 animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
                <span>Querying live job markets on LinkedIn, Indeed & employer portals using Google Search grounding...</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-500">
                <div className="w-3.5 h-3.5 rounded-full border border-slate-800 shrink-0" />
                <span>Parsing ATS match percentages and creating active listings index...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section - Borderless with Hairline Divider */}
      {result && (
        <div className="border-t border-slate-800/80 pt-8 space-y-6 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Real Active Job Postings ({result.listings?.length || 0} Found)
                </h4>
                <p className="text-xs text-slate-400">
                  Grounded in Google Search results across LinkedIn, Indeed, Glassdoor & Employer portals
                </p>
              </div>
            </div>

            {/* Floating Pill Utility Badge */}
            <button
              type="button"
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
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

          {/* Market Summary */}
          {result.groundingSummary && (
            <div className="p-4 bg-indigo-950/20 border-l-2 border-indigo-500 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-300 mr-1.5">Executive Market Brief:</span>
                <span>{result.groundingSummary}</span>
              </div>
            </div>
          )}

          {/* Active Job Postings Grid - Asymmetric Corner Radii + Sharp Hover Border Transition + Internal Element Shift */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {result.listings?.map((job, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-950/80 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none border border-slate-800 hover:border-indigo-400/80 transition-colors duration-150 flex flex-col justify-between space-y-4 group shadow-md"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-bold text-white line-clamp-1 group-hover:translate-x-1 transition-transform duration-150">
                        {job.jobTitle}
                      </h5>
                      <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 mt-0.5 group-hover:translate-x-1 transition-transform duration-150">
                        <Building className="w-3.5 h-3.5" /> {job.company}
                      </span>
                    </div>

                    {/* Floating Pill Workplace Filter Badge */}
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        job.workplaceType?.toLowerCase().includes('remote')
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : job.workplaceType?.toLowerCase().includes('hybrid')
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {job.workplaceType}
                    </span>
                  </div>

                  {/* Location & Salary */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 group-hover:translate-x-1 transition-transform duration-150">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {job.location}
                    </span>

                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.estimatedSalary}
                    </span>
                  </div>

                  {/* Snippet */}
                  {job.snippet && (
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 pt-1 border-t border-slate-800/60 group-hover:translate-x-1 transition-transform duration-150">
                      {job.snippet}
                    </p>
                  )}

                  {/* Top 3 Required Skills */}
                  <div className="pt-2">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-500 block mb-1.5">
                      Top 3 Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.topRequiredSkills?.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <a
                    href={job.postingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <span>View Direct Posting</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {onSelectListingForScorer && (
                    <button
                      type="button"
                      onClick={() => onSelectListingForScorer(job)}
                      className="py-2 px-3 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      title="Score your CV against this posting"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Search Citations as Floating Pill Badges */}
          {result.searchSources?.length > 0 && (
            <div className="p-4 border-t border-slate-800/80 space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Verified Google Search Citations:
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {result.searchSources.slice(0, 6).map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] px-3 py-1 rounded-full bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 hover:border-indigo-500/50 flex items-center gap-1.5 transition-colors"
                  >
                    <span className="truncate max-w-[200px]">{src.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Strict Raw JSON Inspector */}
          <div className="space-y-2 pt-4 border-t border-slate-800/80">
            <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Strict Raw JSON (Grounded):
            </span>
            <pre className="p-4 bg-slate-950/90 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-56 leading-relaxed">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
