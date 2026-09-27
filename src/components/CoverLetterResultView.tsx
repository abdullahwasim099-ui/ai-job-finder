import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  Download,
  Sparkles,
  FileCode,
  RotateCcw,
  CheckCircle2,
  Tag,
  Lightbulb,
  Building,
  Printer,
  FileDown,
} from 'lucide-react';
import { CoverLetterResult, CoverLetterInput } from '../types/career';
import { exportCoverLetterPdf } from '../utils/pdfExport';

interface CoverLetterResultViewProps {
  result: CoverLetterResult;
  input: CoverLetterInput;
  onEditInputs: () => void;
}

export const CoverLetterResultView: React.FC<CoverLetterResultViewProps> = ({
  result,
  input,
  onEditInputs,
}) => {
  const [activeTab, setActiveTab] = useState<'letter' | 'bullets' | 'advice' | 'json'>('letter');
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAllBullets, setCopiedAllBullets] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);
  const [editableBody, setEditableBody] = useState(result.coverLetter.body);

  const wordCount = editableBody.trim().split(/\s+/).filter(Boolean).length;
  const jsonString = JSON.stringify(result, null, 2);

  const handleCopySubject = () => {
    navigator.clipboard.writeText(result.coverLetter.subjectLine);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    navigator.clipboard.writeText(editableBody);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopySingleBullet = (bullet: string, idx: number) => {
    navigator.clipboard.writeText(bullet);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const handleCopyAllBullets = () => {
    const all = result.starBullets
      .map(
        (b, idx) =>
          `${idx + 1}. ${b.starVersion}\n   [Skills: ${b.keySkillsHighlighted.join(', ')}]`
      )
      .join('\n\n');
    navigator.clipboard.writeText(all);
    setCopiedAllBullets(true);
    setTimeout(() => setCopiedAllBullets(false), 2000);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadTxt = () => {
    const content = `SUBJECT: ${result.coverLetter.subjectLine}\n\n${editableBody}\n\n---\nTAILORED STAR BULLETS:\n` +
      result.starBullets.map((b, i) => `\n${i + 1}. ${b.starVersion}\nSkills: ${b.keySkillsHighlighted.join(', ')}`).join('\n') +
      `\n\n---\nATS MATCH ADVICE:\n${result.atsMatchAdvice}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${input.companyName || 'tailored'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-star-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Tailored for:</span>
          <span className="text-white font-semibold flex items-center gap-1">
            <Building className="w-3.5 h-3.5 text-indigo-400" />
            {input.companyName || 'Target Company'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportCoverLetterPdf(result, input, editableBody)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-all"
            title="Export Cover Letter & STAR Bullets to PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Download as PDF</span>
          </button>

          <button
            type="button"
            onClick={onEditInputs}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Modify JD or CV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTab('letter')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'letter'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Targeted Cover Letter</span>
          <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300">
            {wordCount}w
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bullets')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'bullets'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>STAR Bullets ({result.starBullets?.length || 0})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('advice')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'advice'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          <span>ATS Recruiter Advice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ml-auto ${
            activeTab === 'json'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Raw JSON (Strict Schema)</span>
        </button>
      </div>

      {/* Tab 1: Cover Letter */}
      {activeTab === 'letter' && (
        <div className="space-y-4">
          {/* Subject Line Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Optimized Email / Application Subject Line:
              </span>
              <p className="text-sm font-semibold text-white font-mono">
                {result.coverLetter.subjectLine}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopySubject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 shrink-0"
            >
              {copiedSubject ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Subject</span>
                </>
              )}
            </button>
          </div>

          {/* Letter Body Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-bold text-white">Concise 3-Paragraph Cover Letter</h4>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded font-semibold border ${
                    wordCount <= 250
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                  }`}
                >
                  {wordCount} words (Requirement: &lt; 250 words)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyBody}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/20 text-slate-200 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 text-xs font-semibold transition-colors"
                >
                  {copiedBody ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied Letter!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => exportCoverLetterPdf(result, input, editableBody)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download as PDF</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Editable Text Area for Live Tweaking */}
            <div className="space-y-1">
              <textarea
                value={editableBody}
                onChange={(e) => setEditableBody(e.target.value)}
                rows={11}
                className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 font-sans resize-y"
              />
              <p className="text-[11px] text-slate-500 italic">
                Tip: You can edit or personalize this text directly before copying or downloading.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 3 STAR Bullets */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                3 High-Impact STAR Rewritten Bullets
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Tailored directly to the top 3 requirements identified from the job description
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => exportCoverLetterPdf(result, input, editableBody)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30 transition-colors"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download as PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyAllBullets}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-indigo-600/20 text-slate-300 hover:text-indigo-200 border border-slate-700 hover:border-indigo-500/40 transition-colors"
              >
              {copiedAllBullets ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">All Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy All 3 Bullets</span>
                </>
              )}
            </button>
          </div>
        </div>

          <div className="space-y-4">
            {result.starBullets?.map((bullet, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 hover:border-indigo-500/40 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold flex items-center justify-center border border-indigo-500/30">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white">
                      Requirement #{idx + 1} Alignment
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingleBullet(bullet.starVersion, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
                  >
                    {copiedBulletIdx === idx ? (
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
                </div>

                {/* Original */}
                <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                    Original CV Achievement / Concept:
                  </span>
                  <p className="text-xs text-slate-400 italic">"{bullet.original}"</p>
                </div>

                {/* Rewritten STAR */}
                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      STAR Method (Situation • Task • Action • Result):
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      Quantified Metric
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                    • {bullet.starVersion}
                  </p>
                </div>

                {/* Key skills highlighted */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <Tag className="w-3.5 h-3.5 text-cyan-400 mr-1" />
                  <span className="text-[11px] text-slate-400 mr-1">Skills Highlighted:</span>
                  {bullet.keySkillsHighlighted?.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-200 border border-cyan-500/20 text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: ATS Match Advice */}
      {activeTab === 'advice' && (
        <div className="bg-slate-900/80 border border-indigo-500/30 rounded-xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Senior Recruiter ATS Match Strategy</h4>
              <p className="text-xs text-slate-400">
                How to navigate applicant tracking systems and position yourself ahead of competitors
              </p>
            </div>
          </div>

          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-slate-200 text-sm leading-relaxed space-y-3">
            <p className="whitespace-pre-line">{result.atsMatchAdvice}</p>
          </div>
        </div>
      )}

      {/* Tab 4: Raw JSON */}
      {activeTab === 'json' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                Raw JSON (Strict Schema Compliance)
              </h4>
              <p className="text-xs text-slate-400">
                Exact output schema: coverLetter (subjectLine, body), starBullets (original, starVersion, keySkillsHighlighted), atsMatchAdvice
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadJson}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .json</span>
              </button>
            </div>
          </div>

          <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-[480px] leading-relaxed selection:bg-indigo-500/40">
            {jsonString}
          </pre>
        </div>
      )}
    </div>
  );
};
