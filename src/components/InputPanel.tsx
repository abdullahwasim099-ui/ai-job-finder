import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Trash2,
  ArrowRight,
  Layers,
  Wand2,
  Code2,
  CheckCircle,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { AnalysisInput } from '../types/career';
import { SAMPLE_PROFILES, SampleProfile } from '../data/sampleProfiles';

interface InputPanelProps {
  input: AnalysisInput;
  onChange: (updated: Partial<AnalysisInput>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onLoadSample: (sample: SampleProfile) => void;
  cvText?: string;
  setCvText?: (text: string) => void;
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

// Browser-side document parsing helper functions
const parsePdfFile = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const pdfjsLib = (window as any).pdfjsLib;
  if (!pdfjsLib) {
    throw new Error('PDF.js library is not loaded. Please wait a moment or reload.');
  }
  // Setup standard worker from CDN
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
};

const parseDocxFile = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  const mammoth = (window as any).mammoth;
  if (!mammoth) {
    throw new Error('Mammoth.js library is not loaded. Please wait a moment or reload.');
  }
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

const parseTxtFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string || '');
    };
    reader.onerror = (err) => reject(err);
    reader.readAsText(file);
  });
};

export const InputPanel: React.FC<InputPanelProps> = ({
  input,
  onChange,
  onSubmit,
  isLoading,
  onLoadSample,
  cvText,
  setCvText,
}) => {
  const [inputMode, setInputMode] = useState<'form' | 'raw'>('form');
  const [showOptionalPreferences, setShowOptionalPreferences] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parsing States
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [parsingError, setParsingError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const activeCvText = input.candidateCv || '';
  const wordCount = activeCvText.trim().split(/\s+/).filter(Boolean).length;
  const charCount = activeCvText.length;

  const currentMode = input.mode || 'expert_ats';

  const processFile = async (file: File) => {
    setIsParsing(true);
    setParsingError(null);
    setUploadedFileName(file.name);

    try {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      let extractedText = '';

      if (fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await parsePdfFile(arrayBuffer);
      } else if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        extractedText = await parseDocxFile(arrayBuffer);
      } else if (fileType === 'txt' || fileType === 'md' || fileType === 'text') {
        extractedText = await parseTxtFile(file);
      } else {
        throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT/MD files.');
      }

      if (!extractedText.trim()) {
        throw new Error('Could not extract any readable text from the document. Please verify it contains text layer.');
      }

      // Sync both input and custom state
      onChange({ candidateCv: extractedText });
      if (setCvText) {
        setCvText(extractedText);
      }
    } catch (err: any) {
      console.error('File parsing error:', err);
      setParsingError(err.message || 'Error occurred while parsing the file.');
      setUploadedFileName(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearCv = () => {
    onChange({ candidateCv: '' });
    if (setCvText) {
      setCvText('');
    }
    setUploadedFileName(null);
    setParsingError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleRawInputChange = (text: string) => {
    onChange({ rawSystemInput: text });

    const cvMatch = text.match(/\[CANDIDATE CV\]:?\s*([\s\S]*?)(?=\[(?:TARGET ROLE|LOCATION)\]|$)/i);
    const roleMatch = text.match(/\[TARGET ROLE\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|LOCATION)\]|$)/i);
    const locMatch = text.match(/\[LOCATION\]:?\s*([\s\S]*?)(?=\[(?:CANDIDATE CV|TARGET ROLE)\]|$)/i);

    const updates: Partial<AnalysisInput> = {};
    if (cvMatch && cvMatch[1]) {
      updates.candidateCv = cvMatch[1].trim();
      if (setCvText) setCvText(cvMatch[1].trim());
    }
    if (roleMatch && roleMatch[1]) updates.targetRole = roleMatch[1].trim();
    if (locMatch && locMatch[1]) updates.locationPreference = locMatch[1].trim();

    if (Object.keys(updates).length > 0) {
      onChange(updates);
    }
  };

  const handleGenerateRawSample = () => {
    const sampleText = `[CANDIDATE CV]:
ALEX RIVERA
Email: alex.rivera@example.com | Location: Austin, TX | Remote
Senior Full-Stack Engineer with 6+ years of experience designing and scaling microservices with TypeScript, React, Node.js, and AWS. Built distributed platforms handling 15M+ daily requests. Scaled Kubernetes clusters on AWS (EKS, RDS, S3). Mentored 4 engineers and improved team test coverage to 85%+. Certified AWS Solutions Architect.

[TARGET ROLE]:
Lead Platform Architect

[LOCATION]:
Remote (US/Global)`;

    const cvTextSample = `ALEX RIVERA
Email: alex.rivera@example.com | Location: Austin, TX | Remote
Senior Full-Stack Engineer with 6+ years of experience designing and scaling microservices with TypeScript, React, Node.js, and AWS. Built distributed platforms handling 15M+ daily requests. Scaled Kubernetes clusters on AWS (EKS, RDS, S3). Mentored 4 engineers and improved team test coverage to 85%+. Certified AWS Solutions Architect.`;

    onChange({
      rawSystemInput: sampleText,
      candidateCv: cvTextSample,
      targetRole: 'Lead Platform Architect',
      locationPreference: 'Remote (US/Global)',
    });
    if (setCvText) {
      setCvText(cvTextSample);
    }
  };

  const isSubmitDisabled =
    (!activeCvText.trim() && !input.rawSystemInput?.trim()) ||
    (!input.targetRole.trim() && !input.rawSystemInput?.trim()) ||
    isLoading ||
    isParsing;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
      {/* Top Header: Schema & Input Style Toggle */}
      <div className="px-5 py-4 bg-zinc-950/80 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        {/* Schema Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400">Analysis Spec:</span>
          <div className="flex items-center p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => onChange({ mode: 'expert_ats' })}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentMode === 'expert_ats'
                  ? 'bg-zinc-100 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Expert ATS Parser (Clean Spec)
            </button>
            <button
              type="button"
              onClick={() => onChange({ mode: 'comprehensive' })}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                currentMode === 'comprehensive'
                  ? 'bg-zinc-100 text-zinc-950 shadow-md font-bold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Career Advisor & STAR Bullets
            </button>
          </div>
        </div>

        {/* Input format toggle */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-zinc-400 hidden sm:inline">Input Format:</span>
          <button
            type="button"
            onClick={() => setInputMode('form')}
            className={`px-2.5 py-1 rounded-lg border transition-all ${
              inputMode === 'form'
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 font-semibold'
                : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Form Fields
          </button>
          <button
            type="button"
            onClick={() => setInputMode('raw')}
            className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
              inputMode === 'raw'
                ? 'bg-zinc-800 border-zinc-700 text-zinc-200 font-semibold'
                : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>[TAGGED] Raw Text</span>
          </button>
        </div>
      </div>

      {/* Quick Test Profiles Selector Bar */}
      <div className="px-5 py-3 bg-zinc-950/40 border-b border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
          <Layers className="w-4 h-4 text-zinc-400" />
          <span>Quick Test Profiles:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_PROFILES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => {
                onLoadSample(sample);
                setUploadedFileName(null);
                setParsingError(null);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-zinc-800/50 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/60 transition-all flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span>{sample.name}</span>
              <span className="text-[10px] text-zinc-500 hidden sm:inline">
                ({sample.badge})
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Raw Tagged Input View */}
        {inputMode === 'raw' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-zinc-400" />
                Raw Tagged Input Format
              </label>
              <button
                type="button"
                onClick={handleGenerateRawSample}
                className="text-xs text-zinc-400 hover:text-zinc-300 underline underline-offset-4"
              >
                Insert Sample Tagged Block
              </button>
            </div>
            <p className="text-xs text-zinc-400">
              Paste directly in the system input format:{' '}
              <code className="text-zinc-300 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-800">
                [CANDIDATE CV]: ... [TARGET ROLE]: ... [LOCATION]: ...
              </code>
            </p>
            <textarea
              value={input.rawSystemInput || ''}
              onChange={(e) => handleRawInputChange(e.target.value)}
              placeholder="[CANDIDATE CV]:&#10;Paste candidate resume here...&#10;&#10;[TARGET ROLE]:&#10;Lead Software Engineer&#10;&#10;[LOCATION]:&#10;Remote / London / San Francisco"
              rows={12}
              className="w-full px-4 py-3 bg-zinc-950/90 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 font-mono text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-zinc-700/50 transition-all resize-y"
            />
          </div>
        ) : (
          /* Form Fields Mode: Pristine 2-Column Grid Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column (Span 6): File Uploader & Raw Fallback Text */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    Resume / CV Document
                    <span className="text-xs font-normal text-rose-400">*required</span>
                  </label>
                  {activeCvText && (
                    <button
                      type="button"
                      onClick={handleClearCv}
                      className="text-xs text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Resume</span>
                    </button>
                  )}
                </div>

                {/* Drag & Drop Area */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative p-6 sm:p-8 rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-white bg-zinc-800/80'
                      : 'border-zinc-800 bg-zinc-950/40 hover:bg-zinc-950/70 hover:border-zinc-700'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.md,.text"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {isParsing ? (
                    <div className="space-y-3 py-2">
                      <RefreshCw className="w-8 h-8 text-zinc-400 animate-spin mx-auto" />
                      <div className="text-sm font-medium text-zinc-300">Extracting content & text layer...</div>
                      <div className="text-xs text-zinc-500">Parsing PDF.js / Mammoth arrays dynamically</div>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="space-y-2 py-1">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-300 border border-zinc-800">
                        <FileCheck2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                      </div>
                      <div className="text-sm font-bold text-zinc-200 max-w-xs truncate mx-auto">
                        {uploadedFileName}
                      </div>
                      <div className="text-xs text-emerald-400 font-medium">
                        Successfully parsed client-side!
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 py-1">
                      <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-zinc-400 border border-zinc-800">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-zinc-200 block">
                          Drag & drop resume file here
                        </span>
                        <span className="text-xs text-zinc-500 block mt-0.5">
                          or click to browse from local directories
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono bg-zinc-900/50 px-2.5 py-1 rounded-md border border-zinc-800/80 inline-block">
                        PDF • DOCX • TXT • MD
                      </div>
                    </div>
                  )}
                </div>

                {/* Parsing Errors Display */}
                {parsingError && (
                  <div className="p-3 bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{parsingError}</span>
                  </div>
                )}

                {/* Textarea Fallback for Raw Pasting & Proofreading */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-400">
                      Fallback / Extracted Raw CV Text
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {wordCount} words • {charCount} characters
                    </span>
                  </div>
                  <textarea
                    value={activeCvText}
                    onChange={(e) => {
                      onChange({ candidateCv: e.target.value });
                      if (setCvText) {
                        setCvText(e.target.value);
                      }
                    }}
                    placeholder="Paste or edit the extracted resume text here directly if needed..."
                    rows={6}
                    className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 font-mono text-xs leading-relaxed focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Right Column (Span 6): Target Job Description & Preference Fields */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Target Job Description Area */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  Target Job Description
                  <span className="text-xs font-normal text-zinc-500">(Recommended for precise ATS matching)</span>
                </label>
                <textarea
                  value={input.targetJobDescription || ''}
                  onChange={(e) => onChange({ targetJobDescription: e.target.value })}
                  placeholder="Paste the target job description details here to identify exact skill gaps, keyword matching, and benchmark ATS compatibility scores..."
                  rows={6}
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-600 text-xs sm:text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all resize-y"
                />
              </div>

              {/* Target Role Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-zinc-400" />
                  Target Job Title / Role
                  <span className="text-xs font-normal text-rose-400">*required</span>
                </label>
                <input
                  type="text"
                  value={input.targetRole}
                  onChange={(e) => onChange({ targetRole: e.target.value })}
                  placeholder="e.g., Lead Platform Architect, Senior Product Manager"
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {POPULAR_ROLES.slice(0, 4).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => onChange({ targetRole: role })}
                      className="px-2 py-0.5 text-[10px] rounded bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/30 transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Location Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  Location Preference / Target Location
                </label>
                <input
                  type="text"
                  value={input.locationPreference}
                  onChange={(e) => onChange({ locationPreference: e.target.value })}
                  placeholder="e.g., Remote, London UK, San Francisco"
                  className="w-full px-3.5 py-2.5 bg-zinc-950/80 border border-zinc-800 rounded-xl text-zinc-100 placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LOCATION_PRESETS.slice(0, 3).map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => onChange({ locationPreference: loc })}
                      className="px-2 py-0.5 text-[10px] rounded bg-zinc-800/40 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-700/30 transition-colors"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Optional preferences toggle */}
        {currentMode === 'comprehensive' && inputMode === 'form' && (
          <div className="space-y-3 pt-4 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={() => setShowOptionalPreferences(!showOptionalPreferences)}
              className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
              <span>Optional Preferences (Culture, Industry, Key Skills)</span>
              {showOptionalPreferences ? (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {showOptionalPreferences && (
              <div className="p-4 bg-zinc-950/60 border border-zinc-800 rounded-xl space-y-4 animate-in slide-in-from-top-1 duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
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
                      placeholder="e.g., Asynchronous, Autonomy"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
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
                      placeholder="e.g., FinTech, SaaS"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Key Hard Skills
                    </label>
                    <input
                      type="text"
                      value={input.userPreferences.keyHardSkills || ''}
                      onChange={(e) =>
                        onChange({
                          userPreferences: { ...input.userPreferences, keyHardSkills: e.target.value },
                        })
                      }
                      placeholder="e.g., Microservices, AWS"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg border ${
              isSubmitDisabled
                ? 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed border-zinc-800'
                : 'bg-white text-zinc-950 border-zinc-200 hover:bg-zinc-100 active:translate-y-0 cursor-pointer shadow-zinc-950/20'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 text-zinc-950 animate-spin" />
                <span>Evaluating Candidate Against Target Role...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-zinc-950" />
                <span>
                  {currentMode === 'expert_ats'
                    ? 'Execute ATS Gap Analysis & Generate Clean JSON'
                    : 'Analyze Resume & Optimize STAR Bullets'}
                </span>
                <ArrowRight className="w-4 h-4 ml-1 opacity-80" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
