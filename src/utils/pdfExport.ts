import { jsPDF } from 'jspdf';
import { CoverLetterResult, CoverLetterInput, ExpertAtsResult } from '../types/career';

/**
 * Exports the generated cover letter and STAR bullet analysis to a professional A4 PDF.
 */
export function exportCoverLetterPdf(
  result: CoverLetterResult,
  input: CoverLetterInput,
  editableBody?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawFooter();
    }
  };

  const drawFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 145, 155);
      doc.text(
        'Generated via CareerPulse • Confidential Candidate Application Portfolio',
        margin,
        pageHeight - 12
      );
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 12);
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(79, 70, 229); // indigo-600 accent bar
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Title in header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text('CAREERPULSE PROFESSIONAL DOSSIER', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(199, 210, 254);
  const companyStr = input.companyName ? `Tailored for ${input.companyName}` : 'Tailored Application';
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`${companyStr} • ${dateStr}`, margin, 21);

  y = 40;

  // SECTION 1: COVER LETTER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text('I. TAILORED COVER LETTER', margin, y);
  y += 6;

  // Subject line box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Subject:', margin + 3.5, y + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const subjectText = result.coverLetter.subjectLine || 'Application for Open Role';
  const splitSubject = doc.splitTextToSize(subjectText, contentWidth - 25);
  doc.text(splitSubject, margin + 18, y + 7.5);

  y += 18;

  // Cover Letter Body
  const letterBody = editableBody || result.coverLetter.body;
  const paragraphs = letterBody.split('\n\n').filter((p) => p.trim().length > 0);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  paragraphs.forEach((para) => {
    const lines = doc.splitTextToSize(para.trim(), contentWidth);
    const height = lines.length * 5;
    checkPageBreak(height + 4);
    doc.text(lines, margin, y);
    y += height + 4.5;
  });

  y += 4;
  checkPageBreak(25);

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  // SECTION 2: 3 STAR BULLETS
  checkPageBreak(15);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text('II. TAILORED STAR METHOD BULLET POINTS', margin, y);
  y += 6;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Engineered using Situation, Task, Action, and Quantifiable Results matching top job requirements:',
    margin,
    y
  );
  y += 6;

  result.starBullets.forEach((bullet, idx) => {
    const starLines = doc.splitTextToSize(`• ${bullet.starVersion}`, contentWidth - 6);
    const skillsText = `Skills: ${bullet.keySkillsHighlighted.join(', ')}`;
    const cardHeight = starLines.length * 4.5 + 14;

    checkPageBreak(cardHeight + 4);

    // Bullet card box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, 'FD');

    // Number tag
    doc.setFillColor(79, 70, 229);
    doc.circle(margin + 5, y + 5.5, 2.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.text(`${idx + 1}`, margin + 4.2, y + 6.3);

    // Requirement alignment header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Core Requirement Alignment #${idx + 1}`, margin + 10, y + 6.5);

    // STAR Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(starLines, margin + 4, y + 12);

    // Key Skills Tag
    const skillY = y + 12 + starLines.length * 4.5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(14, 116, 144); // Cyan
    doc.text(skillsText, margin + 4, skillY);

    y += cardHeight + 4;
  });

  y += 2;
  checkPageBreak(30);

  // SECTION 3: ATS STRATEGY ADVICE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(79, 70, 229);
  doc.text('III. ATS SCREENING & RECRUITER STRATEGY', margin, y);
  y += 6;

  const adviceLines = doc.splitTextToSize(result.atsMatchAdvice, contentWidth - 8);
  const adviceBoxHeight = adviceLines.length * 4.5 + 8;

  checkPageBreak(adviceBoxHeight + 5);

  doc.setFillColor(254, 252, 232); // amber-50
  doc.setDrawColor(254, 240, 138); // amber-200
  doc.roundedRect(margin, y, contentWidth, adviceBoxHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 63, 18);
  doc.text(adviceLines, margin + 4, y + 6);

  y += adviceBoxHeight + 6;

  drawFooter();

  // Save the document
  const fileName = `CareerPulse-${(input.companyName || 'Application').replace(/[^a-zA-Z0-9]/g, '_')}-Dossier.pdf`;
  doc.save(fileName);
}

/**
 * Exports the ATS Gap Analysis results into a clean executive PDF report.
 */
export function exportAtsReportPdf(result: ExpertAtsResult, targetRole: string) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ATS RESUME PARSER & GAP ANALYSIS REPORT', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254);
  doc.text(
    `Candidate: ${result.profile.name || 'Candidate'} • Target: ${targetRole}`,
    margin,
    21
  );

  y = 38;

  // Score Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(79, 70, 229);
  doc.text(`${result.compatibility.overallScore}%`, margin + 6, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Overall ATS Match Score', margin + 30, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Skills: ${result.compatibility.skillsMatchScore}%  |  Experience: ${result.compatibility.experienceMatchScore}%  |  Seniority: ${result.profile.seniorityLevel} (${result.profile.yearsExperience} yrs)`,
    margin + 30,
    y + 15
  );

  y += 28;

  // Verdict
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('Strategic Verdict:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const verdictLines = doc.splitTextToSize(result.compatibility.verdict, contentWidth);
  doc.text(verdictLines, margin, y);
  y += verdictLines.length * 4.5 + 8;

  // Strengths & Critical Gaps
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text('Key Strengths:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  result.gapAnalysis.topStrengths.forEach((str) => {
    const l = doc.splitTextToSize(`• ${str}`, contentWidth);
    doc.text(l, margin, y);
    y += l.length * 4.5;
  });

  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(225, 29, 72);
  doc.text('Critical Gaps & Missing Keywords:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text(`Missing Keywords: ${result.gapAnalysis.missingKeywords.join(', ')}`, margin, y);
  y += 6;

  result.gapAnalysis.criticalGaps.forEach((gap) => {
    const l = doc.splitTextToSize(`• ${gap}`, contentWidth);
    doc.text(l, margin, y);
    y += l.length * 4.5;
  });

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text('Diagnostic Follow-Up Questions:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  result.diagnosticQuestions.forEach((q, i) => {
    const l = doc.splitTextToSize(`${i + 1}. ${q}`, contentWidth);
    doc.text(l, margin, y);
    y += l.length * 4.5 + 2;
  });

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(140, 145, 155);
  doc.text(
    'Generated via CareerPulse ATS Engine • Confidential Candidate Assessment',
    margin,
    pageHeight - 12
  );

  doc.save(`CareerPulse-ATS-Report-${targetRole.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

/**
 * Exports AI Interview Coach Question & Feedback evaluation to a professional PDF dossier.
 */
export function exportInterviewFeedbackPdf(
  question: string,
  userAnswer: string,
  feedback: {
    score: number;
    strengths: string[];
    areasForImprovement: string[];
    exemplarAnswer: string;
  },
  targetRole: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawFooter();
    }
  };

  const drawFooter = () => {
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(140, 145, 155);
      doc.text(
        'Generated via CareerPulse AI Interview Coach • Confidential Evaluation',
        margin,
        pageHeight - 12
      );
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 12);
    }
  };

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(0, 28, pageWidth, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('AI INTERVIEW COACH EVALUATION DOSSIER', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(199, 210, 254);
  const dateStr = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Target Role: ${targetRole || 'Interview Practice'} • ${dateStr}`, margin, 21);

  y = 38;

  // Score Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(feedback.score >= 8 ? 5 : feedback.score >= 6 ? 217 : 225, feedback.score >= 8 ? 150 : feedback.score >= 6 ? 119 : 29, feedback.score >= 8 ? 105 : feedback.score >= 6 ? 6 : 72);
  doc.text(`${feedback.score} / 10`, margin + 6, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('Interview Coach Assessment Score', margin + 34, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const statusStr =
    feedback.score >= 8
      ? 'Outstanding STAR execution with strong impact quantification'
      : feedback.score >= 6
      ? 'Good foundation with specific opportunities to sharpen metrics'
      : 'Requires more concrete STAR structure, action verbs, and quantifiable results';
  doc.text(statusStr, margin + 34, y + 15);

  y += 28;

  // Interview Question
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(79, 70, 229);
  doc.text('INTERVIEW QUESTION:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  const qLines = doc.splitTextToSize(`"${question}"`, contentWidth);
  doc.text(qLines, margin, y);
  y += qLines.length * 4.5 + 6;

  // Candidate Answer
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('CANDIDATE RESPONSE EVALUATED:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  const aLines = doc.splitTextToSize(userAnswer, contentWidth);
  checkPageBreak(aLines.length * 4.2 + 8);
  doc.text(aLines, margin, y);
  y += aLines.length * 4.2 + 8;

  // Strengths
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(5, 150, 105);
  doc.text('KEY STRENGTHS IDENTIFIED:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  feedback.strengths.forEach((str) => {
    const l = doc.splitTextToSize(`• ${str}`, contentWidth);
    checkPageBreak(l.length * 4.2 + 2);
    doc.text(l, margin, y);
    y += l.length * 4.2;
  });

  y += 5;

  // Areas for Improvement
  checkPageBreak(25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(217, 119, 6);
  doc.text('AREAS FOR IMPROVEMENT:', margin, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  feedback.areasForImprovement.forEach((area) => {
    const l = doc.splitTextToSize(`• ${area}`, contentWidth);
    checkPageBreak(l.length * 4.2 + 2);
    doc.text(l, margin, y);
    y += l.length * 4.2;
  });

  y += 6;

  // Model Exemplar Answer (STAR)
  checkPageBreak(40);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text('MODEL EXEMPLAR RESPONSE (STAR METHOD):', margin, y);
  y += 5;

  const exLines = doc.splitTextToSize(feedback.exemplarAnswer, contentWidth - 8);
  const exHeight = exLines.length * 4.2 + 8;

  checkPageBreak(exHeight + 5);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(margin, y, contentWidth, exHeight, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(exLines, margin + 4, y + 5.5);

  y += exHeight + 8;

  drawFooter();

  doc.save(`CareerPulse-Interview-Prep-${targetRole.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
