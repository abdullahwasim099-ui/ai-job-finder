import { AnalysisInput } from '../types/career';

export interface SampleProfile {
  id: string;
  name: string;
  title: string;
  badge: string;
  targetRole: string;
  data: AnalysisInput;
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  {
    id: 'fullstack-lead',
    name: 'Alex Rivera',
    title: 'Senior Software Engineer -> Lead Platform Architect',
    badge: 'Tech / Engineering',
    targetRole: 'Lead Platform Architect',
    data: {
      candidateCv: `ALEX RIVERA
Email: alex.rivera@example.com | GitHub: github.com/arivera | Location: Austin, TX

SUMMARY:
Results-driven Full Stack Engineer with 6+ years of experience designing and scaling web platforms and distributed microservices. Specialized in TypeScript, React, Node.js, GraphQL, PostgreSQL, and AWS cloud architecture. Passionate about developer tooling, performance engineering, and system resilience.

EXPERIENCE:
Senior Full Stack Engineer | CloudScale Inc. (2022 – Present)
- Built microservices using Node.js and TypeScript handling over 15M daily requests.
- Worked on React frontend architecture, reducing bundle size and improving initial page load.
- Maintained Docker containers and Kubernetes clusters on AWS (EKS, RDS, S3).
- Mentored 4 junior and mid-level engineers in code review practices and test-driven development.
- Managed database migrations and indexing in PostgreSQL to optimize query performance.

Full Stack Developer | NexaTech Solutions (2019 – 2022)
- Developed client portals using React, Redux, and RESTful APIs with Node.js/Express.
- Integrated Stripe billing and OAuth 2.0 authentication workflows.
- Collaborated with UI/UX designers to implement accessible, responsive design components.
- Wrote unit and integration tests using Jest and Cypress, maintaining 85%+ coverage.

EDUCATION & CERTIFICATIONS:
- B.S. in Computer Science, University of Texas at Austin (2019)
- AWS Certified Solutions Architect – Associate (2023)

TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript (ES6+), Python, SQL
- Frontend: React, Next.js, Redux Toolkit, Tailwind CSS, Webpack/Vite
- Backend: Node.js, Express, Fastify, NestJS, GraphQL, REST APIs
- Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (EC2, S3, Lambda, RDS), Docker, CI/CD (GitHub Actions)`,
      targetRole: 'Lead Platform Architect',
      locationPreference: 'Remote (US/Global)',
      targetSalaryOrSeniority: '$180,000 - $210,000 / Staff-Lead Level',
      userPreferences: {
        workCulture: 'Engineering-first, high autonomy, asynchronous',
        industry: 'Cloud Infrastructure / Developer Tooling / B2B SaaS',
        keyHardSkills: 'Distributed Systems, System Architecture, High-throughput microservices, AWS',
      },
      targetJobDescription: `We are looking for a Lead Platform Architect to head our core infrastructure and distributed platform team. 
Key Requirements:
- 7+ years of software engineering experience with at least 2+ years leading architectural initiatives.
- Deep expertise in distributed systems, event-driven architectures (Kafka/SQS), and multi-region AWS infrastructure.
- Proven track record evaluating technical trade-offs, driving RFC architecture proposals, and aligning cross-functional engineering teams.
- Strong knowledge of observability (Datadog/OpenTelemetry), zero-downtime deployments, and platform scalability to 50M+ requests.`,
    },
  },
  {
    id: 'product-manager',
    name: 'Sarah Chen',
    title: 'Product Manager -> Senior AI Product Manager',
    badge: 'Product & Strategy',
    targetRole: 'Senior AI Product Manager',
    data: {
      candidateCv: `SARAH CHEN
Email: sarah.chen@example.com | LinkedIn: linkedin.com/in/sarahchen-pm | Location: San Francisco, CA

PROFESSIONAL SUMMARY:
Data-informed Product Manager with 4+ years of experience leading cross-functional squads to build B2B SaaS products from zero to one. Proven track record in user discovery, product analytics, experimentation, and roadmap prioritization. Recently spearheaded integration of LLM-powered productivity workflows.

EXPERIENCE:
Product Manager | TaskFlow AI (2022 – Present)
- Led a 9-person squad of engineers, designers, and data scientists to launch an AI workflow assistant feature.
- Conducted 40+ user interviews to identify high-friction points in enterprise document search.
- Defined product requirements documents (PRDs), user stories, and acceptance criteria in Jira.
- Tracked adoption and retention using Amplitude and Mixpanel, achieving 35% weekly active feature usage.
- Ran A/B tests on onboarding funnels, lifting free-to-paid conversion.

Associate Product Manager | VentureDesk (2020 – 2022)
- Managed roadmap for the customer analytics dashboard used by 1,200+ paying companies.
- Collaborated with customer success and sales teams to synthesize enterprise feedback into quarterly backlog.
- Analyzed churn indicators and implemented user onboarding tooltips that reduced 30-day drop-off.

EDUCATION:
- B.A. in Economics & Cognitive Science, UC Berkeley (2020)
- Pragmatic Institute Certified (PMC-III)

SKILLS:
- Product: PRD Authoring, Agile/Scrum, User Journey Mapping, Sprint Grooming, Prioritization (RICE/Kano)
- Analytics: SQL, Amplitude, Mixpanel, Google Analytics, Tableau
- Technical Familiarity: LLM prompting, API design fundamentals, Vector databases, Python basics`,
      targetRole: 'Senior AI Product Manager',
      locationPreference: 'Hybrid (San Francisco / Bay Area)',
      targetSalaryOrSeniority: '$165,000 - $195,000 / Senior Level',
      userPreferences: {
        workCulture: 'Fast-paced, product-led growth, collaborative',
        industry: 'Enterprise SaaS / Applied AI',
        keyHardSkills: 'GenAI Product Strategy, LLM evaluations, Agentic workflows, Model latency trade-offs',
      },
      targetJobDescription: `Role: Senior AI Product Manager
We are seeking an experienced Senior AI Product Manager to drive our flagship generative AI enterprise solution.
Requirements:
- 4-6 years of software product management experience, with hands-on experience launching machine learning or LLM-powered capabilities.
- Deep understanding of AI UX paradigms, prompt engineering, RAG architectures, model evaluation metrics, and guardrails.
- Excellent stakeholder management and experience defining GTM pricing/packaging for enterprise AI features.`,
    },
  },
  {
    id: 'data-to-ml',
    name: 'Marcus Brody',
    title: 'Data Analyst -> Machine Learning Engineer (Gap Analysis)',
    badge: 'Data & AI Pivot',
    targetRole: 'Machine Learning Engineer',
    data: {
      candidateCv: `MARCUS BRODY
Email: mbrody@example.com | Location: Chicago, IL

SUMMARY:
Data Analyst with 3 years of experience in business intelligence, SQL data pipelines, and exploratory data analysis. Skilled in converting complex database schemas into actionable stakeholder dashboards. Proficient in Python scripting, statistical analysis, and predictive modeling using Scikit-Learn.

WORK EXPERIENCE:
Data Analyst | Apex Retail Analytics (2022 – Present)
- Developed and maintained 15+ executive Tableau dashboards tracking weekly sales performance across 80 retail stores.
- Wrote complex SQL queries, views, and stored procedures in Snowflake and BigQuery.
- Built a customer churn prediction script in Python using Scikit-Learn and Logistic Regression.
- Automated daily ETL extraction workflows using Python scripts and cron jobs.

Junior Business Analyst | Horizon Media (2021 – 2022)
- Cleaned and prepared large ad impression datasets in Excel and PostgreSQL.
- Conducted cohort analysis to evaluate effectiveness of multi-channel marketing campaigns.
- Created presentation decks summarizing monthly KPI variances for senior leadership.

EDUCATION:
- B.S. in Applied Statistics, University of Illinois (2021)

SKILLS:
- Languages: SQL (Snowflake, BigQuery, Postgres), Python (Pandas, NumPy, Scikit-Learn, Matplotlib)
- BI Tools: Tableau, PowerBI, Looker Studio, Excel (Advanced)
- Concepts: A/B testing, Linear Regression, Data Wrangling, Descriptive Statistics`,
      targetRole: 'Machine Learning Engineer',
      locationPreference: 'Remote or Chicago, IL',
      targetSalaryOrSeniority: '$125,000 - $145,000 / Mid-Level',
      userPreferences: {
        workCulture: 'Mentorship-oriented, strong engineering practices',
        industry: 'FinTech or E-Commerce',
        keyHardSkills: 'MLOps, PyTorch/TensorFlow, Model Deployment, FastApi, Docker',
      },
      targetJobDescription: `Position: Machine Learning Engineer
Looking for an ML Engineer to develop, deploy, and monitor production recommendation and prediction models.
Requirements:
- Strong CS background and Python software engineering proficiency (OOP, testing, packaging).
- Experience training deep learning and gradient boosted models (PyTorch, XGBoost).
- Experience with MLOps pipelines (MLflow, Kubeflow, Docker, AWS SageMaker).
- API deployment experience (FastAPI, gRPC) and real-time inference optimization.`,
    },
  },
  {
    id: 'marketing-lead',
    name: 'Elena Rostova',
    title: 'Growth Marketing Manager -> Head of Demand Generation',
    badge: 'Growth & Marketing',
    targetRole: 'Head of Demand Generation',
    data: {
      candidateCv: `ELENA ROSTOVA
Email: elena.rostova@example.com | London, UK | Open to Remote

PROFILE:
Growth Marketing Manager with 5 years experience in B2B inbound and performance demand generation. Expert in paid acquisition (Google Ads, LinkedIn Ads), lifecycle email campaigns, and marketing automation systems (HubSpot, Marketo).

EXPERIENCE:
Growth Marketing Manager | ScaleUp Technologies (2022 – Present)
- Managed £1.2M annual performance marketing budget across Google Search, LinkedIn Ads, and YouTube.
- Increased inbound qualified sales leads by 42% year-over-year while lowering customer acquisition cost (CAC).
- Designed automated lead scoring workflows in HubSpot integrated with Salesforce CRM.
- Partnered with product marketing to launch 4 quarterly product release campaigns.

Digital Marketing Specialist | GrowthHub Agency (2020 – 2022)
- Executed SEM and paid social campaigns for 8 tech B2B clients.
- Authored SEO-optimized blog posts that generated 50K+ monthly organic visits.
- Created weekly conversion tracking reports in Google Analytics (GA4) and Looker.

EDUCATION:
- B.A. in Marketing Communications, King's College London (2020)
- Google Ads & HubSpot Inbound Certified

SKILLS:
- Performance: Google Ads, LinkedIn Campaign Manager, Meta Ads, Retargeting
- Automation: HubSpot, Marketo, Salesforce, Zapier
- Analytics: GA4, Looker Studio, Amplitude, Lead Attribution`,
      targetRole: 'Head of Demand Generation',
      locationPreference: 'London, UK / Hybrid or Remote',
      targetSalaryOrSeniority: '£85,000 - £100,000 / Senior Leadership',
      userPreferences: {
        workCulture: 'Data-driven, fast execution, cross-functional',
        industry: 'Enterprise Software / CyberSecurity / FinTech',
        keyHardSkills: 'Multi-touch attribution, Pipeline forecasting, ABM (Account-Based Marketing), Budget management',
      },
      targetJobDescription: `Role: Head of Demand Generation
We are seeking a strategic Head of Demand Gen to own our global pipeline generation across enterprise accounts.
Requirements:
- 6+ years in B2B tech demand generation with at least 2 years managing 7-figure budgets and leading teams.
- Mastery of Account-Based Marketing (ABM) tools (Demandbase/6sense) and full-funnel attribution models.
- Proven capability partnering directly with sales leadership to hit ARR and pipeline quota targets.`,
    },
  },
];
