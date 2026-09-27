import React, { useState, useRef } from 'react';
import {
  FileText,
  Mail,
  Copy,
  Check,
  Building,
  Briefcase,
  Code2,
  Wand2,
  Download,
  FileDown,
  Sparkles,
  HelpCircle,
  FileCode,
  RotateCcw,
  CheckCircle2,
  MessageSquare,
  Upload,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import { CopywriterResult, CopywriterInput } from '../types/career';
import { SAMPLE_PROFILES, SampleProfile } from '../data/sampleProfiles';
import { jsPDF } from 'jspdf';

interface CareerCopywriterViewProps {
  initialCv?: string;
}

const DEFAULT_SAMPLE_JOB = {
  title: 'Lead Platform Architect',
  company: 'Stripe',
  description: `Stripe is looking for a Lead Platform Architect to steer our global developer infrastructure.
Responsibilities:
- Architect high-throughput distributed microservices handling billions in financial volume.
- Optimize multi-region PostgreSQL clusters, Redis caches, and Kafka event streams.
- Mentor senior engineers, drive architecture RFCs, and maintain 99.999% availability.
Requirements:
- 7+ years building resilient distributed backends with Node.js/Go and cloud native architecture (AWS/GCP, Kubernetes).
- Deep expertise in Kafka streaming, event sourcing, and high-concurrency transactional databases.
- Proven leadership in cross-functional technical RFC reviews.`,
};

export const CareerCopywriterView: React.FC<CareerCopywriterViewProps> = ({ initialCv = '' }) => {
  const [input, setInput] = useState<CopywriterInput>({
    candidateCv: initialCv || SAMPLE_PROFILES[0].data.candidateCv,
    jobTitle: DEFAULT_SAMPLE_JOB.title,
    companyName: DEFAULT_SAMPLE_JOB.company,
    jobDescription: DEFAULT_SAMPLE_JOB.description,
  });

  const [inputMode, setInputMode] = useState<'form' | 'raw'>('form');
  const [result, setResult] = useState<CopywriterResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'letter' | 'answers' | 'json'>('letter');

  // Copy states
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedFullLetter, setCopiedFullLetter] = useState(false);
  const [copiedAnswerIdx, setCopiedAnswerIdx] = useState<number | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setInput((prev) => ({ ...prev, candidateCv: content }));
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLoadSample = (sample: SampleProfile) => {
    setInput({
      candidateCv: sample.data.candidateCv,
      jobTitle: sample.targetRole,
      companyName: 'Stripe',
      jobDescription: DEFAULT_SAMPLE_JOB.description,
    });
    setErrorMessage(null);
  };

  const handleRawChange = (text: string) => {
    setInput((prev) => ({ ...prev, rawTaggedInput: text }));

    const cvMatch = text.match(
      /\[CANDIDATE CV\]:?\s*([\s\S]*?)(?=\[(?:JOB TITLE|COMPANY NAME|JOB DESCRIPTION)\]|$)/i
    );
    const titleMatch = text.match(
      /\[JOB TITLE\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|COMPANY NAME|JOB DESCRIPTION)\]|$)/i
    );
    const compMatch = text.match(
      /\[COMPANY NAME\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|JOB TITLE|JOB DESCRIPTION)\]|$)/i
    );
    const descMatch = text.match(/\[JOB DESCRIPTION\]:?\s*([\s\S]*?)$/i);

    const updates: Partial<CopywriterInput> = {};
    if (cvMatch && cvMatch[1]) updates.candidateCv = cvMatch[1].trim();
    if (titleMatch && titleMatch[1]) updates.jobTitle = titleMatch[1].trim();
    if (compMatch && compMatch[1]) updates.companyName = compMatch[1].trim();
    if (descMatch && descMatch[1]) updates.jobDescription = descMatch[1].trim();

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
    if (!isRaw && !input.jobDescription.trim()) {
      setErrorMessage('Please provide target job description.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/career-copywriter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tailored copy.');
      }

      setResult(data);
      setActiveTab('letter');
    } catch (err: any) {
      console.error('Copywriter error:', err);
      setErrorMessage(err.message || 'An error occurred while generating copy.');
    } finally {
      setIsLoading(false);
    }
  };

  // Word count of body paragraphs
  const letterBodyText = result ? result.coverLetter.bodyParagraphs.join('\n\n') : '';
  const wordCount = letterBodyText.trim().split(/\s+/).filter(Boolean).length;

  const handleCopySubject = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.coverLetter.subject);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyFullLetter = () => {
    if (!result) return;
    const full = `Subject: ${result.coverLetter.subject}\n\n${result.coverLetter.salutation}\n\n${result.coverLetter.bodyParagraphs.join('\n\n')}\n\n${result.coverLetter.closing}`;
    navigator.clipboard.writeText(full);
    setCopiedFullLetter(true);
    setTimeout(() => setCopiedFullLetter(false), 2000);
  };

  const handleCopyAnswer = (ans: string, idx: number) => {
    navigator.clipboard.writeText(ans);
    setCopiedAnswerIdx(idx);
    setTimeout(() => setCopiedAnswerIdx(null), 2000);
  };

  const handleCopyJson = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleExportPdf = () => {
    if (!result) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    // Header banner
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, 28, 'F');
    doc.setFillColor(79, 70, 229);
    doc.rect(0, 28, pageWidth, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('CAREER APPLICATION DOSSIER', margin, 14);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(199, 210, 254);
    doc.text(
      `Role: ${input.jobTitle} • Company: ${input.companyName || 'Target Company'}`,
      margin,
      21
    );

    y = 38;

    // Subject
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text(`Subject: ${result.coverLetter.subject}`, margin, y);
    y += 8;

    // Salutation
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(result.coverLetter.salutation, margin, y);
    y += 7;

    // Body
    result.coverLetter.bodyParagraphs.forEach((p) => {
      const lines = doc.splitTextToSize(p, contentWidth);
      doc.text(lines, margin, y);
      y += lines.length * 4.5 + 4;
    });

    // Closing
    y += 2;
    doc.text(result.coverLetter.closing, margin, y);
    y += 12;

    // Section 2: Standard Application Answers
    if (result.standardApplicationAnswers?.length > 0) {
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, margin + contentWidth, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(79, 70, 229);
      doc.text('STANDARD APPLICATION QUESTIONS & ANSWERS', margin, y);
      y += 7;

      result.standardApplicationAnswers.forEach((item, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(`Q${idx + 1}: ${item.question}`, margin, y);
        y += 5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(51, 65, 85);
        const ansLines = doc.splitTextToSize(item.suggestedAnswer, contentWidth);
        doc.text(ansLines, margin, y);
        y += ansLines.length * 4.2 + 6;
      });
    }

    doc.save(`Cover-Letter-${(input.companyName || 'Application').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
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
              <Mail className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Professional Career Copywriter (Cover Letter & Answers)
              </h3>
              <p className="text-xs text-slate-400">
                Tailored &lt;250-word cover letter and candidate response using details from the Candidate CV and target job posting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleLoadSample(SAMPLE_PROFILES[0])}
              className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors"
            >
              Load Sample (Alex @ Stripe)
            </button>

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
        </div>

        {inputMode === 'raw' ? (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Raw Input Block ([CANDIDATE CV], [JOB TITLE], [COMPANY NAME], [JOB DESCRIPTION])
            </label>
            <p className="text-xs text-slate-500">
              Format: <code className="text-indigo-300 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">[CANDIDATE CV]: ... [JOB TITLE]: ... [COMPANY NAME]: ... [JOB DESCRIPTION]: ...</code>
            </p>
            <textarea
              value={input.rawTaggedInput || ''}
              onChange={(e) => handleRawChange(e.target.value)}
              placeholder="[CANDIDATE CV]:&#10;Paste candidate resume...&#10;&#10;[JOB TITLE]:&#10;Lead Platform Architect&#10;&#10;[COMPANY NAME]:&#10;Stripe&#10;&#10;[JOB DESCRIPTION]:&#10;Full job posting description..."
              rows={12}
              className="w-full p-4 bg-slate-950/90 border border-slate-800 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none text-slate-100 font-mono text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Candidate CV */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Candidate CV / Resume
                </label>
                <div className="flex items-center gap-2">
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
                    className="px-2.5 py-1 text-xs rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 flex items-center gap-1 transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                  </button>
                  {input.candidateCv && (
                    <button
                      type="button"
                      onClick={() => setInput((p) => ({ ...p, candidateCv: '' }))}
                      className="px-2 py-1 text-xs rounded-full bg-slate-900 hover:bg-rose-900/30 text-slate-400 hover:text-rose-300 border border-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <textarea
                value={input.candidateCv}
                onChange={(e) => setInput({ ...input, candidateCv: e.target.value })}
                placeholder="Paste candidate work achievements and technical skills..."
                rows={11}
                className="w-full p-4 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-xs font-mono focus:outline-none focus:border-indigo-500 transition-colors resize-y"
              />
            </div>

            {/* Job Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={input.jobTitle}
                    onChange={(e) => setInput({ ...input, jobTitle: e.target.value })}
                    placeholder="e.g., Lead Platform Architect"
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300 block">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={input.companyName}
                    onChange={(e) => setInput({ ...input, companyName: e.target.value })}
                    placeholder="e.g., Stripe, Datadog"
                    className="w-full px-3.5 py-2.5 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Target Job Description (LinkedIn / Indeed)
                </label>
                <textarea
                  value={input.jobDescription}
                  onChange={(e) => setInput({ ...input, jobDescription: e.target.value })}
                  placeholder="Paste the job requirements and role description..."
                  rows={8}
                  className="w-full p-4 bg-slate-950/90 border border-slate-800 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-slate-100 text-xs sm:text-sm font-sans focus:outline-none focus:border-indigo-500 transition-colors resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading || !input.candidateCv.trim() || !input.jobDescription.trim()}
          className="w-full py-3.5 px-6 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer transition-all group"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Drafting Tailored &lt;250-Word Letter & Answers...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span>Write Tailored Cover Letter & Application Answers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>

      {/* Results Section - Borderless with Hairline Divider */}
      {result && (
        <div className="border-t border-slate-800/80 pt-8 space-y-6 text-left">
          {/* Header banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                <Mail className="w-4 h-4 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white tracking-tight">
                  Tailored Cover Letter & Standard Application Answers
                </h4>
                <p className="text-xs text-slate-400">
                  Targeted for {input.jobTitle} at {input.companyName || 'Target Company'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download as PDF</span>
              </button>

              <button
                type="button"
                onClick={handleCopyFullLetter}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              >
                {copiedFullLetter ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Letter Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Nav Tabs as Floating Pill Filter */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
            <button
              type="button"
              onClick={() => setActiveTab('letter')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'letter'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Tailored Cover Letter</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300">
                {wordCount}w
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('answers')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'answers'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Standard Application Answers ({result.standardApplicationAnswers?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('json')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ml-auto ${
                activeTab === 'json'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Strict JSON</span>
            </button>
          </div>

          {/* TAB 1: Cover Letter */}
          {activeTab === 'letter' && (
            <div className="space-y-4">
              {/* Subject card with Asymmetric Corners and sharp border hover */}
              <div className="p-4 bg-slate-950/80 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none border border-slate-800 hover:border-indigo-400/80 transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-2 group">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-0.5 group-hover:translate-x-1 transition-transform duration-150">
                    Subject Line:
                  </span>
                  <span className="text-sm font-semibold text-white font-mono group-hover:translate-x-1 transition-transform duration-150">
                    {result.coverLetter.subject}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySubject}
                  className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs hover:bg-slate-800 border border-slate-800 shrink-0"
                >
                  {copiedSubject ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy Subject</span>
                    </>
                  )}
                </button>
              </div>

              {/* Letter presentation card */}
              <div className="p-6 sm:p-8 bg-slate-950/80 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <span className="text-xs text-indigo-400 font-semibold font-mono">
                    {result.coverLetter.salutation}
                  </span>
                  <span
                    className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                      wordCount <= 250
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {wordCount} words (Constraint: &lt; 250 words)
                  </span>
                </div>

                <div className="space-y-4 text-sm sm:text-[15px] leading-relaxed text-slate-200">
                  {result.coverLetter.bodyParagraphs?.map((para, idx) => (
                    <p key={idx}>{para}</p>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-800/80 text-sm text-slate-300 font-medium">
                  {result.coverLetter.closing}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Standard Application Answers */}
          {activeTab === 'answers' && (
            <div className="space-y-4">
              {result.standardApplicationAnswers?.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-slate-950/80 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none border border-slate-800 hover:border-indigo-400/80 transition-colors duration-150 space-y-3 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-150">
                      <span className="w-5 h-5 rounded-tl-md rounded-br-md rounded-tr-none rounded-bl-none bg-indigo-500/20 text-indigo-300 text-[11px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      {item.question}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopyAnswer(item.suggestedAnswer, idx)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-slate-300 text-xs hover:bg-slate-800 border border-slate-800"
                    >
                      {copiedAnswerIdx === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span>Copy Answer</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="p-4 bg-slate-900/60 rounded-tl-xl rounded-br-xl rounded-tr-none rounded-bl-none text-xs sm:text-sm text-slate-200 leading-relaxed border border-slate-800/80 group-hover:translate-x-1 transition-transform duration-150">
                    "{item.suggestedAnswer}"
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Strict JSON Inspector */}
          {activeTab === 'json' && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-400 flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Strict Raw JSON (Expected Schema):
                </span>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
                >
                  {copiedJson ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-950/90 rounded-tl-2xl rounded-br-2xl rounded-tr-none rounded-bl-none border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-72 leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
