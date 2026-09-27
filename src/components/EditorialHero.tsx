import React from 'react';
import {
  ArrowRight,
  Radar,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  Globe2,
  FileCheck2,
} from 'lucide-react';
import heroImage from '../assets/images/executive_career_hero_1790500010396.jpg';

interface EditorialHeroProps {
  activeToolName: string;
  onCtaClick?: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({
  activeToolName,
  onCtaClick,
}) => {
  return (
    <div className="relative w-full overflow-visible">
      {/* SECTION A: Upper Asymmetric Hero Layout */}
      <div
        className="w-full relative overflow-visible"
        style={{ paddingTop: '120px', paddingBottom: '40px' }}
      >
        {/* Editorial Structural Grid: 2/3 vs 1/3 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-10 items-center overflow-visible">
          {/* Left Column (Columns 1 to 8): Heading & Sub-grid */}
          <div className="col-span-12 lg:col-span-8 z-10 text-left space-y-7">
            {/* Typographic Kicker (No Pill, Anti-Slop Discipline) */}
            <div className="flex items-center gap-3 text-left">
              <span className="w-8 h-px bg-indigo-500" />
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-indigo-400 font-semibold">
                EXECUTIVE CAREER INTELLIGENCE · VERIFIED GROUNDING
              </span>
            </div>

            {/* Main Headline: Spanning Columns 1-8, tight leading 0.95, text-5xl to text-7xl */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-100 tracking-tight leading-[0.95] text-left">
              Algorithmic ATS <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-cyan-300">
                precision & live
              </span>{' '}
              <br />
              market capture.
            </h1>

            {/* Sub-grid Underneath Main Heading: Primary CTA directly beside compact body paragraph */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-3 text-left">
              {/* Primary CTA (Columns 1-5) */}
              <div className="sm:col-span-5 text-left">
                <button
                  type="button"
                  onClick={onCtaClick}
                  className="w-full sm:w-auto py-3.5 px-7 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
                >
                  <span>Launch Executive Intelligence</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Compact Body Paragraph (Columns 6-12) */}
              <div className="sm:col-span-7 text-left border-l border-slate-800/80 pl-5">
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal text-left">
                  Deconstruct applicant tracking systems with precision. Real-time skill gap
                  benchmarking, automated STAR copycrafting, and Google-grounded executive job
                  tracking without hallucinations.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (Columns 7 to 12): Hero Image extending to right viewport edge */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 relative overflow-visible lg:-mr-12 xl:-mr-24 2xl:-mr-36">
            <div className="relative group overflow-visible">
              {/* Ambient background glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-cyan-500/10 rounded-3xl blur-2xl -z-10 opacity-70" />

              {/* Primary Hero Image */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800/90 shadow-2xl bg-slate-950">
                <img
                  src={heroImage}
                  alt="Executive Career Intelligence Telemetry"
                  className="w-full h-[280px] sm:h-[360px] lg:h-[420px] object-cover object-center filter contrast-105"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Secondary Floating Media Card: Overlaps bottom-left corner by -40px vertically and -60px horizontally */}
              <div className="absolute z-20 p-4 sm:p-5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/70 max-w-[280px] sm:max-w-[320px] text-left transition-transform duration-300 hover:scale-[1.02] -bottom-[40px] -left-[20px] sm:-left-[60px]">
                {/* Header badge */}
                <div className="flex items-center justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                      LIVE GROUNDED TELEMETRY
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">96.4%</span>
                </div>

                {/* Metric title */}
                <div className="text-sm font-extrabold text-white leading-tight mb-1 text-left">
                  Executive ATS Pass Ratio
                </div>
                <p className="text-[11px] text-slate-400 leading-snug text-left mb-3">
                  Zero hallucination threshold · Active portal indexing across LinkedIn & Indeed.
                </p>

                {/* Progress metric bar */}
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
                  <div className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full w-[96.4%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION BLEED: Main Visual Showcase Container
          Negative bottom margin: mb-[-96px] (-6rem) with relative z-20, forcing it to bleed down into Section B */}
      <div className="relative z-20 mb-[-96px] mt-12 w-full">
        {/* Feature Grid with Card Stacking in an Offset Cascade:
            Card 1 at translate-y-0
            Card 2 at translate-y-8
            Card 3 at translate-y-16
            Ultra-fine 1px semi-transparent border (border border-white/10), backdrop-blur-md, without heavy drop shadows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {/* Card 1: translate-y-0 */}
          <div className="relative transform translate-y-0 p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-left transition-transform hover:-translate-y-1 duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-400">
                01 / ATS PARSER & GAP ENGINE
              </span>
              <Cpu className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="text-2xl font-black text-white tracking-tight mb-1">
              94.8% Match Matrix
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Bi-directional keyword vectoring against Workday, Greenhouse & Lever scoring algorithms.
            </p>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>CRITICAL GAPS IDENTIFIED</span>
              <span className="text-emerald-400 font-bold">ACTIVE</span>
            </div>
          </div>

          {/* Card 2: translate-y-8 */}
          <div className="relative transform translate-y-0 md:translate-y-8 p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-left transition-transform hover:translate-y-7 duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                02 / LIVE SEARCH GROUNDING
              </span>
              <Globe2 className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="text-2xl font-black text-white tracking-tight mb-1">
              Google Grounded Portals
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Discovers 4 to 6 verified, active listings on LinkedIn, Indeed, and direct company careers.
            </p>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>ZERO HALLUCINATIONS</span>
              <span className="text-cyan-400 font-bold">VERIFIED</span>
            </div>
          </div>

          {/* Card 3: translate-y-16 */}
          <div className="relative transform translate-y-0 md:translate-y-16 p-6 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-white/10 text-left transition-transform hover:translate-y-15 duration-300">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-violet-400">
                03 / STAR COPY SYNTHESIZER
              </span>
              <FileCheck2 className="w-4 h-4 text-violet-400" />
            </div>

            <div className="text-2xl font-black text-white tracking-tight mb-1">
              &lt; 250 Words Strict
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Converts complex career achievements into quantifiable STAR bullets & portal responses.
            </p>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>RECRUITER READY</span>
              <span className="text-violet-400 font-bold">READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
