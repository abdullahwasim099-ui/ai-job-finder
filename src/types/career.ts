export interface ExpertAtsProfile {
  name: string | null;
  seniorityLevel: 'Entry' | 'Mid' | 'Senior' | 'Lead' | string;
  yearsExperience: number;
  technicalSkills: string[];
  softSkills: string[];
  toolsAndFrameworks: string[];
}

export interface ExpertAtsCompatibility {
  overallScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  verdict: string;
}

export interface ExpertAtsGapAnalysis {
  topStrengths: string[];
  missingKeywords: string[];
  criticalGaps: string[];
}

export interface ExpertAtsSearchOptimization {
  recommendedJobTitles: string[];
  searchQueries: string[];
}

export interface ExpertAtsResult {
  profile: ExpertAtsProfile;
  compatibility: ExpertAtsCompatibility;
  gapAnalysis: ExpertAtsGapAnalysis;
  searchOptimization: ExpertAtsSearchOptimization;
  diagnosticQuestions: string[];
}

export interface ProfileSummary {
  extractedSeniority: string;
  yearsOfExperience: string;
  topHardSkills: string[];
  topSoftSkills: string[];
}

export interface RoleMatchBreakdown {
  skillsMatch: number;
  experienceMatch: number;
  qualificationMatch: number;
}

export interface RoleMatch {
  overallScore: number;
  breakdown: RoleMatchBreakdown;
  verdict: string;
}

export interface StrengthsAndGaps {
  keyStrengths: string[];
  missingSkillsOrKeywords: string[];
  improvementSuggestions: string[];
}

export interface AtsOptimizedBullet {
  originalConcept: string;
  optimizedBullet: string;
  impactReason: string;
}

export interface SearchStrategy {
  targetJobTitles: string[];
  recommendedKeywords: string[];
  optimizedSearchQueries: string[];
}

export interface CareerAnalysisResult {
  profileSummary: ProfileSummary;
  roleMatch: RoleMatch;
  strengthsAndGaps: StrengthsAndGaps;
  atsOptimizedBullets: AtsOptimizedBullet[];
  searchStrategy: SearchStrategy;
  diagnosticQuestions: string[];
}

export interface AnalysisInput {
  candidateCv: string;
  targetRole: string;
  locationPreference: string;
  targetSalaryOrSeniority: string;
  userPreferences: {
    workCulture?: string;
    industry?: string;
    keyHardSkills?: string;
  };
  targetJobDescription?: string;
  diagnosticAnswers?: { question: string; answer: string }[];
  rawSystemInput?: string;
  mode?: 'expert_ats' | 'comprehensive';
}

// Turn 3: Cover Letter & STAR Bullets
export interface StarBulletItem {
  original: string;
  starVersion: string;
  keySkillsHighlighted: string[];
}

export interface CoverLetterContent {
  subjectLine: string;
  body: string;
}

export interface CoverLetterResult {
  coverLetter: CoverLetterContent;
  starBullets: StarBulletItem[];
  atsMatchAdvice: string;
}

export interface CoverLetterInput {
  candidateCv: string;
  jobDescription: string;
  companyName: string;
  rawTaggedInput?: string;
}

// Turn 4: AI Interview Coach
export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: string;
  evaluatorRationale?: string;
}

export interface InterviewAnswerFeedback {
  score: number; // 1-10
  strengths: string[];
  areasForImprovement: string[];
  exemplarAnswer: string;
}

// Turn 5: AI Career Matcher & Search Strategist
export interface CandidateProfileMatch {
  extractedName: string | null;
  experienceLevel: 'Entry' | 'Mid' | 'Senior' | string;
  primaryTitle: string;
  coreSkills: string[];
  toolsAndTechnologies: string[];
}

export interface SuggestedFilters {
  remoteAllowed: boolean;
  experienceLevel: string;
}

export interface JobMatchStrategy {
  targetJobTitles: string[];
  booleanSearchKeywords: string;
  suggestedFilters: SuggestedFilters;
}

export interface ExternalSearchLinks {
  indeedUrl: string;
  linkedInUrl: string;
  googleJobsQuery: string;
}

export interface CareerMatcherResult {
  candidateProfile: CandidateProfileMatch;
  jobMatchStrategy: JobMatchStrategy;
  externalSearchLinks: ExternalSearchLinks;
  diagnosticQuestions: string[];
}

export interface CareerMatcherInput {
  candidateCv: string;
  targetLocation: string;
  preferredWorkType: 'Full-time' | 'Apprenticeship' | 'Contract' | 'Part-time' | string;
  rawTaggedInput?: string;
}

// Turn 6: ATS Scoring Engine against Target Job Postings
export interface AtsScoringMatchResults {
  jobTitle: string;
  company: string;
  overallMatchScore: number;
  skillsMatchPercentage: number;
  experienceMatchPercentage: number;
}

export interface AtsScoringCompatibilityDetails {
  matchingSkills: string[];
  missingCriticalSkills: string[];
  atsKeywordGaps: string[];
}

export interface AtsScoringApplicationAdvice {
  verdict: 'Strong Match' | 'Moderate Match' | 'Weak Match' | string;
  customizationTip: string;
}

export interface AtsPostingScoreResult {
  matchResults: AtsScoringMatchResults;
  compatibilityDetails: AtsScoringCompatibilityDetails;
  applicationAdvice: AtsScoringApplicationAdvice;
}

export interface AtsPostingScoreInput {
  parsedCvProfile: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  rawTaggedInput?: string;
}

// Turn 7: Professional Career Copywriter (Cover Letter & Application Answers)
export interface CopywriterCoverLetter {
  subject: string;
  salutation: string;
  bodyParagraphs: string[];
  closing: string;
}

export interface CopywriterApplicationAnswer {
  question: string;
  suggestedAnswer: string;
}

export interface CopywriterResult {
  coverLetter: CopywriterCoverLetter;
  standardApplicationAnswers: CopywriterApplicationAnswer[];
}

export interface CopywriterInput {
  candidateCv: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  rawTaggedInput?: string;
}

// Turn 8: Executive Live Job Finder with Google Search Grounding
export interface LiveJobListing {
  jobTitle: string;
  company: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'Onsite' | string;
  estimatedSalary: string;
  topRequiredSkills: string[];
  postingUrl: string;
  snippet?: string;
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface LiveJobSearchResult {
  listings: LiveJobListing[];
  groundingSummary: string;
  searchSources: GroundingSource[];
}

export interface LiveJobSearchInput {
  targetRole: string;
  location: string;
  skills: string;
  rawSystemInput?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  targetRole: string;
  candidateNameSnippet: string;
  overallScore?: number;
  mode: 'expert_ats' | 'comprehensive' | 'cover_letter' | 'interview_coach' | 'career_matcher' | 'ats_posting_scorer' | 'career_copywriter' | 'live_job_finder';
  expertResult?: ExpertAtsResult;
  result?: CareerAnalysisResult;
  coverLetterResult?: CoverLetterResult;
  interviewFeedback?: InterviewAnswerFeedback;
  careerMatcherResult?: CareerMatcherResult;
  atsPostingScoreResult?: AtsPostingScoreResult;
  copywriterResult?: CopywriterResult;
  liveJobSearchResult?: LiveJobSearchResult;
  input?: AnalysisInput;
  coverLetterInput?: CoverLetterInput;
  careerMatcherInput?: CareerMatcherInput;
  atsPostingScoreInput?: AtsPostingScoreInput;
  copywriterInput?: CopywriterInput;
  liveJobSearchInput?: LiveJobSearchInput;
}
