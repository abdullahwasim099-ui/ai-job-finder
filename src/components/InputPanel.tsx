import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  MapPin,
  Briefcase,
  DollarSign,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Trash2,
  ArrowRight,
  Layers,
  Wand2,
} from 'lucide-react';
import { AnalysisInput } from '../types/career';
import { SAMPLE_PROFILES, SampleProfile } from '../data/sampleProfiles';

interface InputPanelProps {
  input: AnalysisInput;
  onChange: (updated: Partial<AnalysisInput>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onLoadSample: (sample: SampleProfile) => void;
}

const POPULAR_ROLES = [
  'Senior Software Engineer',
  'Lead Platform Architect',
  'Senior Product Manager',
  'Machine Learning Engineer',
  'Data Scientist',
  'DevOps / SRE Lead',
  'Head of Demand Generation',
  'Full Stack Developer',
];

const LOCATION_PRESETS = [
  'Remote (Global)',
  'Remote (US Only)',
  'London, UK (Hybrid)',
  'San Francisco, CA (Hybrid)',
  'New York, NY',
  'Berlin, Germany',
];

const SENIORITY_PRESETS = [
  'Entry-Level ($60k - $85k)',
  'Mid-Level ($90k - $130k)',
  'Senior ($135k - $175k)',
  'Lead / Staff ($180k - $220k+)',
  'Director / Executive ($220k+)',
];

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  onLoadSample,
}) => {
  const [showOptionalPreferences, setShowOptionalPreferences] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(!!input.targetJobDescription);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = input.candidateCv
    ? input.candidateCv.trim().split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = input.candidateCv ? input.candidateCv.length : 0;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        onChange({ candidateCv: content });
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearCv = () => {
    onChange({ candidateCv: '' });
  };

  const isSubmitDisabled = !input.candidateCv.trim() || !input.targetRole.trim() || isLoading;

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Sample Profiles Quick Selector Bar */}
      <div className="px-5 py-3.5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Quick Test Profiles:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_PROFILES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => onLoadSample(sample)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/70 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span>{sample.name}</span>
              <span className="text-[10px] text-slate-400 opacity-75 hidden sm:inline">({sample.badge})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Section 1: Candidate CV / Resume */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              Candidate CV / Resume Text
              <span className="text-xs font-normal text-rose-400">*required</span>
            </label>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="hidden sm:inline">
                {wordCount} words • {charCount} chars
              </span>
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
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1 transition-colors"
                title="Upload plain text or markdown CV file"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              {input.candidateCv && (
                <button
                  type="button"
                  onClick={handleClearCv}
                  className="px-2 py-1 rounded bg-slate-800/50 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 border border-slate-700/50 transition-colors"
                  title="Clear resume text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              value={input.candidateCv}
              onChange={(e) => onChange({ candidateCv: e.target.value })}
              placeholder="Paste the candidate's complete CV / Resume here, including work history, technical skills, education, certifications, and project accomplishments..."
              rows={9}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
            />
          </div>
        </div>

        {/* Section 2: Target Role & Location & Seniority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Target Role */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              Target Role or Field
              <span className="text-xs font-normal text-rose-400">*required</span>
            </label>
            <input
              type="text"
              value={input.targetRole}
              onChange={(e) => onChange({ targetRole: e.target.value })}
              placeholder="e.g., Senior Full-Stack Engineer, Lead Product Manager"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {/* Quick role suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1 self-center">Suggestions:</span>
              {POPULAR_ROLES.slice(0, 4).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => onChange({ targetRole: role })}
                  className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Location Preference */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              Location Preference
            </label>
            <input
              type="text"
              value={input.locationPreference}
              onChange={(e) => onChange({ locationPreference: e.target.value })}
              placeholder="e.g., Remote, London UK, Hybrid New York"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {/* Quick location chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {LOCATION_PRESETS.slice(0, 3).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => onChange({ locationPreference: loc })}
                  className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Target Salary / Seniority Level */}
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-400" />
              Target Salary Range or Seniority Level
            </label>
            <input
              type="text"
              value={input.targetSalaryOrSeniority}
              onChange={(e) => onChange({ targetSalaryOrSeniority: e.target.value })}
              placeholder="e.g., $160,000 - $190,000 / Senior Level"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
            />
            {/* Seniority chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {SENIORITY_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChange({ targetSalaryOrSeniority: preset })}
                  className="px-2 py-0.5 text-[11px] rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Expandable Optional Preferences & Target Job Description */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setShowOptionalPreferences(!showOptionalPreferences)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Optional Preferences (Culture, Industry, Key Skills)</span>
              {showOptionalPreferences ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowJobDescription(!showJobDescription)}
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Benchmark with specific Job Description (JD)</span>
              {showJobDescription ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Preferences dropdown */}
          {showOptionalPreferences && (
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Work Culture
                  </label>
                  <input
                    type="text"
                    value={input.userPreferences.workCulture || ''}
                    onChange={(e) =>
                      onChange({
                        userPreferences: { ...input.userPreferences, workCulture: e.target.value },
                      })
                    }
                    placeholder="e.g., Asynchronous, High autonomy, Startup"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Industry Preference
                  </label>
                  <input
                    type="text"
                    value={input.userPreferences.industry || ''}
                    onChange={(e) =>
                      onChange({
                        userPreferences: { ...input.userPreferences, industry: e.target.value },
                      })
                    }
                    placeholder="e.g., FinTech, Healthcare, B2B SaaS"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Key Hard Skills to Emphasize
                  </label>
                  <input
                    type="text"
                    value={input.userPreferences.keyHardSkills || ''}
                    onChange={(e) =>
                      onChange({
                        userPreferences: { ...input.userPreferences, keyHardSkills: e.target.value },
                      })
                    }
                    placeholder="e.g., Microservices, Kubernetes, PyTorch"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Job Description dropdown */}
          {showJobDescription && (
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 animate-in fade-in duration-200">
              <label className="block text-xs font-medium text-slate-300">
                Target Job Description / Posting Benchmark (Optional)
              </label>
              <textarea
                value={input.targetJobDescription || ''}
                onChange={(e) => onChange({ targetJobDescription: e.target.value })}
                placeholder="Paste the target job description or requirements here to run a precise gap & keyword audit against the actual job posting..."
                rows={4}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-500 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}
        </div>

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
                <span>Running ATS Parser & Career Advisor Engine...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-indigo-200" />
                <span>Calculate Compatibility & Parse Resume</span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </>
            )}
          </button>
          {!input.candidateCv.trim() && (
            <p className="text-center text-xs text-slate-500 mt-2">
              Tip: Click any test profile above (Alex Rivera, Sarah Chen, etc.) to test instantly!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
