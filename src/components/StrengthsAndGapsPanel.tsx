import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertOctagon,
  Lightbulb,
  Copy,
  Check,
  Cpu,
  HeartHandshake,
  Tag,
} from 'lucide-react';
import { StrengthsAndGaps, ProfileSummary } from '../types/career';

interface StrengthsAndGapsPanelProps {
  strengthsAndGaps: StrengthsAndGaps;
  profileSummary: ProfileSummary;
}

export const StrengthsAndGapsPanel: React.FC<StrengthsAndGapsPanelProps> = ({
  strengthsAndGaps,
  profileSummary,
}) => {
  const [copiedKeywords, setCopiedKeywords] = useState(false);

  const handleCopyMissingKeywords = () => {
    if (!strengthsAndGaps.missingSkillsOrKeywords?.length) return;
    navigator.clipboard.writeText(strengthsAndGaps.missingSkillsOrKeywords.join(', '));
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Extracted Skills Matrix Overview */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-indigo-400" />
          Extracted Competencies & Skill Matrix
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hard Skills */}
          <div className="space-y-2 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Top Hard & Technical Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profileSummary.topHardSkills?.length > 0 ? (
                profileSummary.topHardSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 text-indigo-200 border border-indigo-500/20 font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None specifically extracted</span>
              )}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="space-y-2 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-cyan-400" />
              Leadership & Soft Skills
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profileSummary.topSoftSkills?.length > 0 ? (
                profileSummary.topSoftSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs rounded-lg bg-cyan-500/10 text-cyan-200 border border-cyan-500/20 font-medium"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">None specifically extracted</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Strengths vs Gaps Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-slate-900/80 border border-emerald-500/20 rounded-xl p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Target Role Strengths</h4>
              <p className="text-[11px] text-slate-400">Core capabilities that match requirements</p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {strengthsAndGaps.keyStrengths?.map((str, idx) => (
              <li
                key={idx}
                className="text-xs sm:text-sm text-slate-200 flex items-start gap-2.5 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/10"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Missing Skills / ATS Keywords */}
        <div className="bg-slate-900/80 border border-rose-500/20 rounded-xl p-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <AlertOctagon className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Missing ATS Keywords & Gaps</h4>
                <p className="text-[11px] text-slate-400">Essential keywords missing from CV</p>
              </div>
            </div>

            {strengthsAndGaps.missingSkillsOrKeywords?.length > 0 && (
              <button
                type="button"
                onClick={handleCopyMissingKeywords}
                className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                title="Copy all missing keywords"
              >
                {copiedKeywords ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {strengthsAndGaps.missingSkillsOrKeywords?.length > 0 ? (
              strengthsAndGaps.missingSkillsOrKeywords.map((gap, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs text-rose-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  <span>{gap}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-400 italic">
                No major skill gaps detected! Your profile aligns closely with this role.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Improvement Suggestions */}
      <div className="bg-slate-900/80 border border-indigo-500/20 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Actionable Steps to Bridge Gaps</h4>
            <p className="text-[11px] text-slate-400">High-leverage steps to raise ATS score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {strengthsAndGaps.improvementSuggestions?.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex items-start gap-2"
            >
              <span className="font-bold text-indigo-400 shrink-0 mt-0.5">{idx + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
