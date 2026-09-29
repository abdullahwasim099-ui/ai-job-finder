import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileCode,
  Copy,
  Check,
  FileDown,
  Layers,
  ArrowRight,
  Briefcase,
  HelpCircle,
  Lightbulb,
  MessageSquare,
  Wand2,
} from 'lucide-react';
import { InterviewQuestionItem, InterviewAnswerFeedback } from '../types/career';
import { safeFetch } from '../utils/api';
import { SAMPLE_PROFILES, SampleProfile } from '../data/sampleProfiles';
import { exportInterviewFeedbackPdf } from '../utils/pdfExport';

interface InterviewCoachViewProps {
  initialCv?: string;
  initialRole?: string;
}

const SAMPLE_QUESTIONS_FALLBACK: InterviewQuestionItem[] = [
  {
    id: '1',
    question:
      'Describe a situation where a critical production system experienced high latency or downtime. What architectural trade-offs did you make to resolve it?',
    category: 'System Design & Incident Response',
    evaluatorRationale:
      'Evaluates ability to diagnose distributed system bottlenecks under pressure and lead root-cause mitigation.',
  },
  {
    id: '2',
    question:
      'Tell me about a time you had to persuade senior stakeholders or cross-functional engineers to adopt a major technical RFC or architecture change.',
    category: 'Behavioral & Leadership',
    evaluatorRationale:
      'Tests stakeholder alignment, technical persuasion, and executive communication for senior roles.',
  },
  {
    id: '3',
    question:
      'Walk me through how you benchmark and optimize database queries and caching layers when scaling to millions of daily active requests.',
    category: 'Technical Competency',
    evaluatorRationale:
      'Validates hands-on depth in data layer performance, indexing, and caching resilience.',
  },
];

const SAMPLE_ANSWER =
  'In my previous role at CloudScale, our primary Node.js microservice hit an unexpected 400% spike in traffic during a seasonal campaign, causing database CPU to peak at 95% and response latency to degrade from 120ms to 2.4s. I immediately initiated an incident bridge, identified unindexed queries locking the transaction pool, and executed a two-step remediation: first enabling aggressive Redis caching with TTL for idempotent reads, then rolling out non-blocking index additions. Within 30 minutes, query latency dropped back down to 85ms and we maintained 99.99% uptime throughout the surge.';

export const InterviewCoachView: React.FC<InterviewCoachViewProps> = ({
  initialCv = '',
  initialRole = '',
}) => {
  const [candidateCv, setCandidateCv] = useState(initialCv);
  const [targetRole, setTargetRole] = useState(initialRole || 'Lead Platform Architect');
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

  // Selected question & answer state
  const [selectedQuestionIdx, setSelectedQuestionIdx] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<InterviewAnswerFeedback | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Speech recognition / Mic state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Copy states
  const [copiedExemplar, setCopiedExemplar] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  const activeQuestion = questions[selectedQuestionIdx] || questions[0];

  const handleLoadSample = (sample: SampleProfile) => {
    setCandidateCv(sample.data.candidateCv);
    setTargetRole(sample.targetRole);
    setErrorMessage(null);
  };

  // Mode 1: Generate Questions
  const handleGenerateQuestions = async () => {
    if (!candidateCv.trim()) {
      setErrorMessage('Please provide candidate CV text to tailor questions.');
      return;
    }
    if (!targetRole.trim()) {
      setErrorMessage('Please specify the target role.');
      return;
    }

    setIsGeneratingQuestions(true);
    setErrorMessage(null);
    setFeedback(null);

    try {
      const response = await safeFetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidateCv, targetRole }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate interview questions.');
      }

      setQuestions(data.questions || SAMPLE_QUESTIONS_FALLBACK);
      setSelectedQuestionIdx(0);
      setUserAnswer('');
    } catch (err: any) {
      console.error('Question generation error:', err);
      // Fallback gracefully to realistic questions if API key is not ready
      setQuestions(SAMPLE_QUESTIONS_FALLBACK);
      setSelectedQuestionIdx(0);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  // Mode 2: Evaluate Answer
  const handleEvaluateAnswer = async () => {
    if (!activeQuestion) {
      setErrorMessage('Please select or generate a question first.');
      return;
    }
    if (!userAnswer.trim()) {
      setErrorMessage('Please type or record your interview response first.');
      return;
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      const response = await safeFetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestion.question,
          userAnswer,
          targetRole,
          candidateCv,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to evaluate answer.');
      }

      setFeedback(data);
    } catch (err: any) {
      console.error('Answer evaluation error:', err);
      setErrorMessage(err.message || 'An error occurred while evaluating your answer.');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Toggle voice recognition
  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMessage('Speech Recognition is not supported by your browser. Please type your answer.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setUserAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);
  };

  const handleCopyExemplar = () => {
    if (!feedback?.exemplarAnswer) return;
    navigator.clipboard.writeText(feedback.exemplarAnswer);
    setCopiedExemplar(true);
    setTimeout(() => setCopiedExemplar(false), 2000);
  };

  const handleCopyJson = () => {
    if (!feedback) return;
    navigator.clipboard.writeText(JSON.stringify(feedback, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Error Banner */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs sm:text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Setup / Question Generation Section */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Mode 1: Generate Tailored Interview Questions
            </h3>
          </div>

          {/* Quick sample loader */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Sample:
            </span>
            {SAMPLE_PROFILES.slice(0, 2).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleLoadSample(s)}
                className="px-2 py-0.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Target Role Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Lead Platform Architect, Senior AI PM"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Candidate Resume / CV Summary
            </label>
            <textarea
              value={candidateCv}
              onChange={(e) => setCandidateCv(e.target.value)}
              placeholder="Paste candidate background, tools, achievements..."
              rows={2}
              className="w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono resize-y"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerateQuestions}
          disabled={isGeneratingQuestions || !targetRole.trim() || !candidateCv.trim()}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 transition-all cursor-pointer"
        >
          {isGeneratingQuestions ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Synthesizing Realistic Questions...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>Generate 3 Realistic Behavioral & Technical Questions</span>
            </>
          )}
        </button>
      </div>

      {/* Question Selector & Simulator */}
      {questions.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Select Question to Practice:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedQuestionIdx(idx);
                    setFeedback(null);
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all relative ${
                    selectedQuestionIdx === idx
                      ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {q.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Q{idx + 1}</span>
                  </div>
                  <p className="text-xs font-semibold line-clamp-2">{q.question}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Question Spotlight */}
          {activeQuestion && (
            <div className="p-4 bg-slate-950 rounded-xl border border-indigo-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-300">
                <span>Active Question (#{selectedQuestionIdx + 1}):</span>
                <span className="text-[11px] text-slate-400">
                  Category: {activeQuestion.category}
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                "{activeQuestion.question}"
              </p>
              {activeQuestion.evaluatorRationale && (
                <p className="text-xs text-slate-400 flex items-start gap-1.5 pt-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-300">Interviewer Rationale:</strong>{' '}
                    {activeQuestion.evaluatorRationale}
                  </span>
                </p>
              )}
            </div>
          )}

          {/* Answer Input Area */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                Mode 2: Your Interview Response
              </label>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">{wordCount} words</span>

                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
                    isRecording
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 hover:text-white border-slate-700'
                  }`}
                  title={isRecording ? 'Stop Voice Recording' : 'Dictate with Voice'}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Recording...' : 'Dictate'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserAnswer(SAMPLE_ANSWER)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium"
                >
                  Insert Sample STAR Answer
                </button>
              </div>
            </div>

            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Structure your answer using the STAR method: What was the Situation and Task? What specific Actions did you lead? What were the quantifiable Results/impact metrics?..."
              rows={7}
              className="w-full p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans resize-y"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleEvaluateAnswer}
                disabled={isEvaluating || !userAnswer.trim()}
                className="px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer transition-all"
              >
                {isEvaluating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    <span>Scoring & Evaluating Response...</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Evaluate Answer (Score 1-10 & Feedback)</span>
                    <ArrowRight className="w-4 h-4 opacity-80" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Evaluation Feedback Card */}
      {feedback && activeQuestion && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-indigo-400" />
              <div>
                <h4 className="text-base font-bold text-white">Interview Coach Evaluation Report</h4>
                <p className="text-xs text-slate-400">Strict Mode 2 Evaluation & STAR Feedback</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  exportInterviewFeedbackPdf(
                    activeQuestion.question,
                    userAnswer,
                    feedback,
                    targetRole
                  )
                }
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/30"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download PDF Dossier</span>
              </button>

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
          </div>

          {/* Score Header */}
          <div className="p-5 bg-slate-950/70 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl border shadow-lg ${
                  feedback.score >= 8
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
                    : feedback.score >= 6
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-amber-500/10'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-rose-500/10'
                }`}
              >
                {feedback.score}/10
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Assessment Score
                </span>
                <h5 className="text-base font-bold text-white">
                  {feedback.score >= 8
                    ? 'Outstanding Interview Response'
                    : feedback.score >= 6
                    ? 'Solid Response with Measurable Gaps'
                    : 'Requires More Structure & Metric Quantification'}
                </h5>
              </div>
            </div>

            <div className="text-xs text-slate-400 sm:text-right">
              <span>Practiced for: </span>
              <strong className="text-slate-200">{targetRole}</strong>
            </div>
          </div>

          {/* Strengths vs Improvement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Key Strengths
                </h5>
              </div>
              <ul className="space-y-2">
                {feedback.strengths?.map((s, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-emerald-950/20 border border-emerald-500/10 text-xs text-emerald-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div className="bg-slate-950/60 border border-amber-500/20 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Areas For Improvement
                </h5>
              </div>
              <ul className="space-y-2">
                {feedback.areasForImprovement?.map((a, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-amber-950/20 border border-amber-500/10 text-xs text-amber-200 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Model Exemplar Response (STAR Format) */}
          <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Model Exemplar Response (STAR Format)
                </h5>
              </div>

              <button
                type="button"
                onClick={handleCopyExemplar}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700"
              >
                {copiedExemplar ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copy Exemplar</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-lg border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed font-sans">
              "{feedback.exemplarAnswer}"
            </div>
          </div>

          {/* Raw JSON View */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" />
              Strict Output JSON (Mode 2 Schema):
            </span>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-48 leading-relaxed">
              {JSON.stringify(feedback, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
