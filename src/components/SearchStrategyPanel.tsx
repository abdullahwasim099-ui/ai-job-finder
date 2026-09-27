import React, { useState } from 'react';
import { Search, ExternalLink, Copy, Check, Briefcase, Hash, Globe } from 'lucide-react';
import { SearchStrategy } from '../types/career';

interface SearchStrategyPanelProps {
  searchStrategy: SearchStrategy;
  locationPreference?: string;
}

export const SearchStrategyPanel: React.FC<SearchStrategyPanelProps> = ({
  searchStrategy,
  locationPreference,
}) => {
  const [copiedQueryIdx, setCopiedQueryIdx] = useState<number | null>(null);

  const handleCopy = (query: string, idx: number) => {
    navigator.clipboard.writeText(query);
    setCopiedQueryIdx(idx);
    setTimeout(() => setCopiedQueryIdx(null), 2000);
  };

  const getLinkedInSearchUrl = (query: string) => {
    const loc = locationPreference ? `&location=${encodeURIComponent(locationPreference)}` : '';
    return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}${loc}`;
  };

  const getIndeedSearchUrl = (query: string) => {
    const loc = locationPreference ? `&l=${encodeURIComponent(locationPreference)}` : '';
    return `https://www.indeed.com/jobs?q=${encodeURIComponent(query)}${loc}`;
  };

  const getGoogleJobsSearchUrl = (query: string) => {
    const term = `${query} ${locationPreference || ''} jobs`.trim();
    return `https://www.google.com/search?q=${encodeURIComponent(term)}&ibp=htl;jobs`;
  };

  return (
    <div className="space-y-6">
      {/* Recommended Job Titles & Keyword Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Titles */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Target & Adjacent Job Titles</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchStrategy.targetJobTitles?.map((title, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 text-xs font-medium"
              >
                {title}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Keywords */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Hash className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">Recommended Search Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchStrategy.recommendedKeywords?.map((keyword, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-200 border border-cyan-500/20 text-xs font-medium"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Optimized Queries with Quick Links */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            <div>
              <h4 className="text-sm font-bold text-white">Optimized Boolean Job Search Queries</h4>
              <p className="text-xs text-slate-400">
                Precision search strings crafted for LinkedIn, Indeed, and Google Jobs algorithms
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {searchStrategy.optimizedSearchQueries?.map((query, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="font-mono text-xs text-indigo-200/90 break-all select-all flex-1">
                "{query}"
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleCopy(query, idx)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                  title="Copy search query string"
                >
                  {copiedQueryIdx === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <a
                  href={getLinkedInSearchUrl(query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0A66C2]/20 hover:bg-[#0A66C2]/30 text-[#70B5F9] text-xs font-medium border border-[#0A66C2]/40 transition-colors"
                  title="Search on LinkedIn"
                >
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={getIndeedSearchUrl(query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-medium border border-blue-500/40 transition-colors"
                  title="Search on Indeed"
                >
                  <span>Indeed</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={getGoogleJobsSearchUrl(query)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium border border-emerald-500/40 transition-colors"
                  title="Search on Google Jobs"
                >
                  <span>Google</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
