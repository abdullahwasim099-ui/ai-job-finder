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
} from 'lucide-react';
import { LiveJobSearchResult, LiveJobSearchInput, LiveJobListing } from '../types/career';

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
      const response = await fetch('/api/live-job-search', {
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

      {/* Input Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl p-5 sm:p-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Executive Live Job Finder
              </h3>
              <p className="text-xs text-slate-400">
                Grounding via Google Search for active LinkedIn, Indeed, Glassdoor & Company listings
              </p>
            </div>
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

        {inputMode === 'raw' ? (
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Raw Input Block ([TARGET ROLE], [LOCATION], [SKILLS])
            </label>
            <p className="text-xs text-slate-400">
              Format: <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">[TARGET ROLE]: ... [LOCATION]: ... [SKILLS]: ...</code>
            </p>
            <textarea
              value={input.rawSystemInput || ''}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[TARGET ROLE]:&#10;Lead Platform Architect&#10;&#10;[LOCATION]:&#10;Remote&#10;&#10;[SKILLS]:&#10;Distributed Systems, Node.js, AWS, Kubernetes, Kafka"
              rows={8}
              className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Role Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Target Role Title
                </label>
                <input
                  type="text"
                  value={input.targetRole}
                  onChange={(e) => setInput({ ...input, targetRole: e.target.value })}
                  placeholder="e.g., Lead Platform Architect"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setInput({ ...input, targetRole: r })}
                      className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Location (City / Country or Remote)
                </label>
                <input
                  type="text"
                  value={input.location}
                  onChange={(e) => setInput({ ...input, location: e.target.value })}
                  placeholder="e.g., Remote, San Francisco, London"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => setInput({ ...input, location: loc })}
                      className="px-2 py-0.5 text-[11px] rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Target Skills & Tech Stack
              </label>
              <input
                type="text"
                value={input.skills}
                onChange={(e) => setInput({ ...input, skills: e.target.value })}
                placeholder="e.g., Distributed Systems, Microservices, Node.js, AWS, Kubernetes, Kafka"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading || (!input.targetRole.trim() && !input.rawSystemInput?.trim())}
          className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Grounding Live Jobs via Google Search...</span>
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              <span>Find 4 to 6 Real Active Job Postings</span>
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
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <div>
                <h4 className="text-base font-bold text-white">
                  Real Active Job Postings ({result.listings?.length || 0} Found)
                </h4>
                <p className="text-xs text-slate-400">
                  Grounded in Google Search results across LinkedIn, Indeed, Glassdoor & Employer portals
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

          {/* Market Summary */}
          {result.groundingSummary && (
            <div className="p-4 bg-indigo-950/20 border border-indigo-500/30 rounded-xl text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-indigo-300 mr-1.5">Executive Market Brief:</span>
                <span>{result.groundingSummary}</span>
              </div>
            </div>
          )}

          {/* Active Job Postings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.listings?.map((job, idx) => (
              <div
                key={idx}
                className="p-5 bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-lg"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-sm font-bold text-white line-clamp-1">
                        {job.jobTitle}
                      </h5>
                      <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 mt-0.5">
                        <Building className="w-3.5 h-3.5" /> {job.company}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                        job.workplaceType?.toLowerCase().includes('remote')
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : job.workplaceType?.toLowerCase().includes('hybrid')
                          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {job.workplaceType}
                    </span>
                  </div>

                  {/* Location & Salary */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
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
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 pt-1 border-t border-slate-800/60">
                      {job.snippet}
                    </p>
                  )}

                  {/* Top 3 Required Skills */}
                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
                      Top 3 Required Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.topRequiredSkills?.slice(0, 3).map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-medium"
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
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                  >
                    <span>View Direct Posting</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  {onSelectListingForScorer && (
                    <button
                      type="button"
                      onClick={() => onSelectListingForScorer(job)}
                      className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                      title="Score your CV against this posting"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Search Citations */}
          {result.searchSources?.length > 0 && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                Verified Google Search Citations & Sources:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.searchSources.slice(0, 6).map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1 transition-colors"
                  >
                    <span className="truncate max-w-[200px]">{src.title}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Strict Raw JSON Inspector */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Strict Raw JSON (Grounded):
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
