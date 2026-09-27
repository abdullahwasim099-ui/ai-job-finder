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
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  targetRole: string;
  candidateNameSnippet: string;
  overallScore: number;
  result: CareerAnalysisResult;
  input: AnalysisInput;
}
