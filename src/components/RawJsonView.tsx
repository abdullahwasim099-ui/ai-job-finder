import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, Printer } from 'lucide-react';
import { CareerAnalysisResult } from '../types/career';

interface RawJsonViewProps {
  result: CareerAnalysisResult;
}

export const RawJsonView: React.FC<RawJsonViewProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const jsonString = JSON.stringify(result, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careerpulse-ats-analysis-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadMarkdown = () => {
    let md = `# CareerPulse ATS Analysis & Career Advisor Report\n\n`;
    md += `## 1. Role Match Overview\n`;
    md += `- **Overall Score:** ${result.roleMatch.overallScore}%\n`;
    md += `- **Skills Match:** ${result.roleMatch.breakdown.skillsMatch}%\n`;
    md += `- **Experience Match:** ${result.roleMatch.breakdown.experienceMatch}%\n`;
    md += `- **Education/Certification Match:** ${result.roleMatch.breakdown.qualificationMatch}%\n`;
    md += `- **Verdict:** ${result.roleMatch.verdict}\n\n`;

    md += `## 2. Profile Summary\n`;
    md += `- **Extracted Seniority:** ${result.profileSummary.extractedSeniority}\n`;
    md += `- **Years of Experience:** ${result.profileSummary.yearsOfExperience}\n`;
    md += `- **Top Hard Skills:** ${result.profileSummary.topHardSkills.join(', ')}\n`;
    md += `- **Top Soft Skills:** ${result.profileSummary.topSoftSkills.join(', ')}\n\n`;

    md += `## 3. Strengths & Gaps\n`;
    md += `### Key Strengths:\n`;
    result.strengthsAndGaps.keyStrengths.forEach((s) => (md += `- ${s}\n`));
    md += `\n### Missing Skills / ATS Keywords:\n`;
    result.strengthsAndGaps.missingSkillsOrKeywords.forEach((m) => (md += `- ${m}\n`));
    md += `\n### Improvement Suggestions:\n`;
    result.strengthsAndGaps.improvementSuggestions.forEach((i) => (md += `- ${i}\n`));

    md += `\n## 4. ATS-Optimized Bullets (STAR Method)\n`;
    result.atsOptimizedBullets.forEach((b, idx) => {
      md += `### Bullet ${idx + 1}\n`;
      md += `- **Original Concept:** ${b.originalConcept}\n`;
      md += `- **Optimized STAR Bullet:** ${b.optimizedBullet}\n`;
      md += `- **Impact / Reason:** ${b.impactReason}\n\n`;
    });

    md += `## 5. Job Search Strategy\n`;
    md += `- **Target Titles:** ${result.searchStrategy.targetJobTitles.join(', ')}\n`;
    md += `- **Keywords:** ${result.searchStrategy.recommendedKeywords.join(', ')}\n`;
    md += `### Optimized Queries:\n`;
    result.searchStrategy.optimizedSearchQueries.forEach((q) => (md += `- "${q}"\n`));

    if (result.diagnosticQuestions && result.diagnosticQuestions.length > 0) {
      md += `\n## 6. Diagnostic Questions\n`;
      result.diagnosticQuestions.forEach((q, idx) => (md += `${idx + 1}. ${q}\n`));
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `careerpulse-report-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Strict Output Schema & JSON Inspector</h4>
            <p className="text-xs text-slate-400">
              Validated unformatted JSON structure matching prompt requirements
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? (
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

          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (.md)</span>
          </button>
        </div>
      </div>

      <div className="relative">
        <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-[460px] leading-relaxed selection:bg-indigo-500/40">
          {jsonString}
        </pre>
      </div>
    </div>
  );
};
