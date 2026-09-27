import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Helper to initialize Gemini API client with User-Agent as per guidelines
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const analysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    profileSummary: {
      type: Type.OBJECT,
      properties: {
        extractedSeniority: { type: Type.STRING },
        yearsOfExperience: { type: Type.STRING },
        topHardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        topSoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['extractedSeniority', 'yearsOfExperience', 'topHardSkills', 'topSoftSkills'],
    },
    roleMatch: {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER },
        breakdown: {
          type: Type.OBJECT,
          properties: {
            skillsMatch: { type: Type.INTEGER },
            experienceMatch: { type: Type.INTEGER },
            qualificationMatch: { type: Type.INTEGER },
          },
          required: ['skillsMatch', 'experienceMatch', 'qualificationMatch'],
        },
        verdict: { type: Type.STRING },
      },
      required: ['overallScore', 'breakdown', 'verdict'],
    },
    strengthsAndGaps: {
      type: Type.OBJECT,
      properties: {
        keyStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingSkillsOrKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        improvementSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['keyStrengths', 'missingSkillsOrKeywords', 'improvementSuggestions'],
    },
    atsOptimizedBullets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalConcept: { type: Type.STRING },
          optimizedBullet: { type: Type.STRING },
          impactReason: { type: Type.STRING },
        },
        required: ['originalConcept', 'optimizedBullet', 'impactReason'],
      },
    },
    searchStrategy: {
      type: Type.OBJECT,
      properties: {
        targetJobTitles: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
        optimizedSearchQueries: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['targetJobTitles', 'recommendedKeywords', 'optimizedSearchQueries'],
    },
    diagnosticQuestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: [
    'profileSummary',
    'roleMatch',
    'strengthsAndGaps',
    'atsOptimizedBullets',
    'searchStrategy',
    'diagnosticQuestions',
  ],
};

const SYSTEM_INSTRUCTION = `You are an advanced AI Career Advisor and ATS Resume Parser engine. Your purpose is to analyze a candidate's CV/Resume text alongside their provided career preferences, calculate role compatibility scores, identify skill gaps, and provide actionable, structured job application guidance.

### INPUT REQUIREMENTS:
You will receive input containing:
1. Candidate CV Text
2. Target Role or Field
3. Location Preference (e.g., "Remote", "London, UK", "Hybrid")
4. Target Salary Range or Seniority Level
5. Optional User Preferences (Work culture, industry preference, key hard skills)
6. Optional Job Description or Candidate Answers to previous diagnostic questions

### CORE RESPONSIBILITIES:
1. COMPREHENSIVE CV ANALYSIS:
   - Extract primary hard skills, soft skills, tools, and technical competencies.
   - Summarize total years of relevant experience.
   - Categorize current seniority level (Entry-Level, Mid-Level, Senior, Lead).

2. JOB MATCHING & SCORING:
   - Calculate an overall "Match Score" (0% to 100%) against the target role.
   - Break down scoring into 3 categories: Skills Match (0-100), Experience Match (0-100), and Education/Certification Match (0-100).

3. GAP & STRENGTH ANALYSIS:
   - List key candidate strengths that directly align with the target role.
   - List specific skill gaps, missing keywords, or missing credentials required for standard ATS screenings.
   - Suggest 3-5 concrete improvement actions to bridge these gaps.

4. ATS RESUME OPTIMIZATION:
   - Provide 3–5 tailored, high-impact bullet points rewritten using the STAR method (Situation, Task, Action, Result) with strong action verbs and quantified metrics where possible.
   - For each bullet point:
     * originalConcept: the original weak/generic bullet or duty from the CV
     * optimizedBullet: the rewritten STAR bullet starting with an active verb and quantified impact
     * impactReason: why this bullet outperforms in ATS scans and catches recruiter attention

5. TAILORED SEARCH & QUESTION GUIDANCE:
   - Generate optimized search queries for job engines (e.g., LinkedIn, Indeed, Google Jobs) tailored to their target role, skills, and location.
   - Generate 3 crucial diagnostic questions to ask the candidate to further refine their profile or clarify missing qualifications.

### CRITICAL RULES:
1. Do NOT hallucinate skills or qualifications not present or logically implied by the candidate's CV.
2. If the CV lacks necessary detail, mark specific scores accordingly and populate diagnosticQuestions to obtain missing details.
3. Ensure all JSON keys match the exact names specified.`;

// API route to parse and analyze resume
app.post('/api/analyze', async (req, res) => {
  try {
    const {
      candidateCv,
      targetRole,
      locationPreference,
      targetSalaryOrSeniority,
      userPreferences,
      targetJobDescription,
      diagnosticAnswers,
    } = req.body;

    if (!candidateCv || !candidateCv.trim()) {
      return res.status(400).json({ error: 'Candidate CV text is required.' });
    }

    if (!targetRole || !targetRole.trim()) {
      return res.status(400).json({ error: 'Target role or field is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check the Secrets panel.',
      });
    }

    let prompt = `Analyze this candidate CV against the target role and preferences:

=== CANDIDATE CV TEXT ===
${candidateCv}

=== TARGET ROLE / FIELD ===
${targetRole}

=== LOCATION PREFERENCE ===
${locationPreference || 'Not specified (assume Flexible/Remote)'}

=== TARGET SALARY / SENIORITY ===
${targetSalaryOrSeniority || 'Not specified'}

=== USER PREFERENCES ===
- Work Culture: ${userPreferences?.workCulture || 'Any'}
- Industry: ${userPreferences?.industry || 'Any'}
- Key Hard Skills Highlighted: ${userPreferences?.keyHardSkills || 'None specified'}
`;

    if (targetJobDescription && targetJobDescription.trim()) {
      prompt += `\n=== TARGET JOB DESCRIPTION (BENCHMARK) ===\n${targetJobDescription.trim()}\n`;
    }

    if (diagnosticAnswers && Array.isArray(diagnosticAnswers) && diagnosticAnswers.length > 0) {
      prompt += `\n=== CANDIDATE ANSWERS TO PREVIOUS DIAGNOSTIC QUESTIONS (REFINEMENT) ===\n`;
      diagnosticAnswers.forEach((ans: { question: string; answer: string }, idx: number) => {
        prompt += `Q${idx + 1}: ${ans.question}\nA${idx + 1}: ${ans.answer}\n`;
      });
      prompt += `\nIncorporate these verified candidate answers into the updated analysis, adjusting scores, strengths, and ATS bullets accordingly.\n`;
    }

    prompt += `\nPerform the comprehensive CV analysis, ATS scoring, gap detection, STAR bullet optimization, and search strategy. Adhere strictly to the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: analysisResponseSchema,
        temperature: 0.2,
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('No response text received from Gemini model.');
    }

    const parsedData = JSON.parse(textOutput);
    return res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/analyze:', err);
    return res.status(500).json({
      error: err.message || 'An unexpected error occurred during resume analysis.',
    });
  }
});

// Setup server and Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerPulse server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
