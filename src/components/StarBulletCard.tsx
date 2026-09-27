import React, { useState } from 'react';
import { Check, Copy, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { AtsOptimizedBullet } from '../types/career';

interface StarBulletCardProps {
  bullet: AtsOptimizedBullet;
  index: number;
}

export const StarBulletCard: React.FC<StarBulletCardProps> = ({ bullet, index }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(bullet.optimizedBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-all space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-semibold text-slate-300">
            STAR Formatted Optimization
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>Copy Bullet</span>
            </>
          )}
        </button>
      </div>

      {/* Original Concept */}
      <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-lg">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
          Original / Draft Concept:
        </span>
        <p className="text-xs sm:text-sm text-slate-400 italic">
          "{bullet.originalConcept}"
        </p>
      </div>

      {/* Arrow divider */}
      <div className="flex items-center gap-2 px-1">
        <div className="h-px bg-indigo-500/20 flex-1" />
        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          STAR Transformation
        </span>
        <div className="h-px bg-indigo-500/20 flex-1" />
      </div>

      {/* Optimized Bullet */}
      <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-lg">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            ATS-Engineered STAR Bullet:
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            Action + Context + Impact
          </span>
        </div>
        <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
          • {bullet.optimizedBullet}
        </p>
      </div>

      {/* Impact & Reason */}
      <div className="flex items-start gap-2 pt-1 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="text-slate-300 font-medium">ATS & Recruiter Edge: </span>
          <span>{bullet.impactReason}</span>
        </div>
      </div>
    </div>
  );
};
