# GitStory (PortfolioAI) - Design Document

## Overview

GitStory is an AI-powered career readiness platform that transforms GitHub projects into interview-ready portfolio stories. The system analyzes code repositories, generates professional narratives, identifies skill gaps, recommends projects, and provides mock interview practice.

**Architecture Philosophy:** Serverless-first, API-driven, AI-enhanced

**Core Technologies:**

- Frontend: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Backend: Vercel Serverless Functions
- Database: Supabase (PostgreSQL + Auth)
- AI: OpenAI GPT-4
- APIs: GitHub REST API, Octokit
- Deployment: Vercel

---

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
│              (Next.js 14 App Router)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ├─── Static Pages (SSG)
                     ├─── Dynamic Pages (SSR)
                     └─── Client Components (CSR)
                     │
┌────────────────────┴────────────────────────────────────┐
│              Vercel Serverless Functions                │
│                   (API Routes)                          │
├─────────────────────────────────────────────────────────┤
│  /api/auth/*        │  GitHub OAuth flow                │
│  /api/github/*      │  Repo fetching, analysis          │
│  /api/ai/*          │  Story/bullet generation          │
│  /api/analysis/*    │  Portfolio scoring, gaps          │
│  /api/interview/*   │  Mock interview simulator         │
│  /api/jobs/*        │  Job matching, recommendations    │
└────────┬────────────┴──────────────┬───────────────────┘
         │                           │
         │                           │
    ┌────┴─────┐              ┌─────┴──────┐
    │ Supabase │              │  External  │
    │          │              │    APIs    │
    │ - Auth   │              │            │
    │ - DB     │              │ - GitHub   │
    │ - Storage│              │ - OpenAI   │
    └──────────┘              └────────────┘
```

### Data Flow

**1. User Authentication:**

```
User → GitHub OAuth → Callback → Supabase Auth → JWT Token → Client
```

**2. Portfolio Analysis:**

```
User → Select Repos → API → GitHub API → Fetch Data →
Analysis Engine → Score Calculation → Cache → Display
```

**3. AI Generation:**

```
User → Request Story → API → Prepare Context → OpenAI API →
Generate Content → Post-process → Cache → Display
```

---

## Components and Interfaces

### Frontend Components

#### 1. Layout Components

- `RootLayout` - Global layout with navigation, auth state
- `DashboardLayout` - Sidebar navigation for authenticated users
- `Header` - Top navigation with user menu
- `Sidebar` - Left navigation with sections

#### 2. Page Components

- `LandingPage` - Marketing page with features, pricing, CTA
- `DashboardPage` - Overview with portfolio score, quick actions
- `ProjectsPage` - List of analyzed projects with scores
- `ProjectDetailPage` - Single project with generated content
- `RecommendationsPage` - Suggested projects to build
- `InterviewPage` - Mock interview simulator
- `SettingsPage` - User preferences, API keys

#### 3. Feature Components

- `PortfolioScoreCard` - Displays 0-100 score with breakdown
- `ProjectCard` - Project summary with tech stack, complexity
- `StoryGenerator` - STAR format story with regenerate option
- `BulletGenerator` - Resume bullets with variations
- `SkillGapAnalysis` - Visual gap display with recommendations
- `ProjectRecommendation` - Detailed project suggestion card
- `MockInterviewChat` - Chat interface for AI interview
- `JobMatchScore` - Match percentage with gap analysis
- `READMEPreview` - Generated README with copy button

#### 4. UI Components (Reusable)

- `Button` - Primary, secondary, ghost variants
- `Card` - Container with header, body, footer
- `Badge` - Tech stack tags, status indicators
- `Progress` - Linear and circular progress bars
- `Modal` - Dialog for confirmations, forms
- `Toast` - Notifications for success, error, info
- `Skeleton` - Loading states
- `Tabs` - Tabbed navigation within pages

### API Routes

#### Authentication (`/api/auth/`)

- `GET /api/auth/github` - Initiate GitHub OAuth
- `GET /api/auth/callback` - Handle OAuth callback
- `POST /api/auth/logout` - Clear session
- `GET /api/auth/session` - Get current user session

#### GitHub Integration (`/api/github/`)

- `GET /api/github/repos` - Fetch user's repositories
- `GET /api/github/repo/:id` - Get single repo details
- `GET /api/github/commits/:id` - Get commit history
- `GET /api/github/languages/:id` - Get language breakdown
- `POST /api/github/analyze` - Trigger repo analysis

#### AI Generation (`/api/ai/`)

- `POST /api/ai/story` - Generate STAR format story
- `POST /api/ai/bullets` - Generate resume bullets
- `POST /api/ai/readme` - Generate README content
- `POST /api/ai/interview-question` - Generate interview Q
- `POST /api/ai/interview-feedback` - Evaluate answer

#### Analysis (`/api/analysis/`)

- `POST /api/analysis/portfolio-score` - Calculate score
- `POST /api/analysis/skill-gaps` - Identify gaps
- `POST /api/analysis/complexity` - Analyze project complexity
- `GET /api/analysis/recommendations` - Get project suggestions

#### Jobs (`/api/jobs/`)

- `POST /api/jobs/match` - Match portfolio to job description
- `GET /api/jobs/requirements/:role` - Get role requirements
- `GET /api/jobs/market-data` - Get salary, demand data

---

## Data Models

### Database Schema (Supabase/PostgreSQL)

#### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  github_id INTEGER UNIQUE NOT NULL,
  github_username VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  avatar_url TEXT,
  target_role VARCHAR(100), -- 'frontend', 'backend', 'fullstack', 'devops'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  github_repo_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  url TEXT NOT NULL,
  languages JSONB, -- {"JavaScript": 45.2, "TypeScript": 30.1, ...}
  stars INTEGER DEFAULT 0,
  forks INTEGER DEFAULT 0,
  last_commit_date TIMESTAMP,
  complexity_score INTEGER, -- 0-100
  analyzed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Generated Content Table

```sql
CREATE TABLE generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'story', 'bullet', 'readme', 'linkedin'
  content TEXT NOT NULL,
  metadata JSONB, -- Additional data like word count, tone, etc.
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Portfolio Scores Table

```sql
CREATE TABLE portfolio_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL, -- 0-100
  project_quality_score INTEGER,
  tech_diversity_score INTEGER,
  documentation_score INTEGER,
  consistency_score INTEGER,
  breakdown JSONB, -- Detailed scoring breakdown
  calculated_at TIMESTAMP DEFAULT NOW()
);
```

#### Skill Gaps Table

```sql
CREATE TABLE skill_gaps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  target_role VARCHAR(100) NOT NULL,
  present_skills JSONB, -- ["React", "Node.js", ...]
  missing_skills JSONB, -- ["TypeScript", "Testing", ...]
  gap_priority JSONB, -- {"essential": [...], "preferred": [...]}
  analyzed_at TIMESTAMP DEFAULT NOW()
);
```

#### Project Recommendations Table

```sql
CREATE TABLE project_recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  tech_stack JSONB,
  difficulty VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  time_estimate VARCHAR(50), -- '2-3 weeks'
  gaps_filled JSONB, -- Skills this project teaches
  learning_resources JSONB, -- Links to tutorials, docs
  priority INTEGER, -- 1-5, higher = more important
  status VARCHAR(50) DEFAULT 'suggested', -- 'suggested', 'in_progress', 'completed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Mock Interviews Table

```sql
CREATE TABLE mock_interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  questions JSONB, -- Array of questions asked
  answers JSONB, -- Array of user answers
  feedback JSONB, -- AI feedback for each answer
  overall_score INTEGER, -- 0-100
  completed_at TIMESTAMP DEFAULT NOW()
);
```

#### Job Matches Table

```sql
CREATE TABLE job_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255),
  job_description TEXT,
  required_skills JSONB,
  match_percentage INTEGER, -- 0-100
  matched_skills JSONB,
  missing_skills JSONB,
  recommended_projects JSONB, -- Which projects to highlight
  created_at TIMESTAMP DEFAULT NOW()
);
```

### TypeScript Interfaces

```typescript
// User
interface User {
  id: string;
  githubId: number;
  githubUsername: string;
  email?: string;
  avatarUrl?: string;
  targetRole?: "frontend" | "backend" | "fullstack" | "devops";
  createdAt: Date;
  updatedAt: Date;
}

// Project
interface Project {
  id: string;
  userId: string;
  githubRepoId: number;
  name: string;
  description?: string;
  url: string;
  languages: Record<string, number>; // language: percentage
  stars: number;
  forks: number;
  lastCommitDate?: Date;
  complexityScore?: number;
  analyzedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Score
interface PortfolioScore {
  id: string;
  userId: string;
  overallScore: number; // 0-100
  projectQualityScore: number;
  techDiversityScore: number;
  documentationScore: number;
  consistencyScore: number;
  breakdown: {
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
  };
  calculatedAt: Date;
}

// Generated Content
interface GeneratedContent {
  id: string;
  projectId: string;
  contentType: "story" | "bullet" | "readme" | "linkedin";
  content: string;
  metadata?: {
    wordCount?: number;
    tone?: string;
    version?: number;
  };
  createdAt: Date;
}

// Skill Gap
interface SkillGap {
  id: string;
  userId: string;
  targetRole: string;
  presentSkills: string[];
  missingSkills: string[];
  gapPriority: {
    essential: string[];
    preferred: string[];
    niceToHave: string[];
  };
  analyzedAt: Date;
}

// Project Recommendation
interface ProjectRecommendation {
  id: string;
  userId: string;
  projectName: string;
  description: string;
  techStack: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  timeEstimate: string;
  gapsFilled: string[];
  learningResources: {
    title: string;
    url: string;
    type: "tutorial" | "docs" | "video" | "article";
  }[];
  priority: number;
  status: "suggested" | "in_progress" | "completed";
  createdAt: Date;
}

// Mock Interview
interface MockInterview {
  id: string;
  userId: string;
  projectId: string;
  questions: string[];
  answers: string[];
  feedback: {
    question: string;
    answer: string;
    score: number;
    strengths: string[];
    improvements: string[];
  }[];
  overallScore: number;
  completedAt: Date;
}

// Job Match
interface JobMatch {
  id: string;
  userId: string;
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string[];
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendedProjects: string[]; // Project IDs to highlight
  createdAt: Date;
}
```

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: GitHub OAuth Round Trip

_For any_ valid GitHub user, completing the OAuth flow should result in a valid session token that can be used to fetch user data
**Validates: Requirements 1.1**

### Property 2: Portfolio Score Consistency

_For any_ user portfolio, recalculating the score with the same data should produce the same result (deterministic scoring)
**Validates: Requirements 1.3**

### Property 3: STAR Story Completeness

_For any_ generated STAR story, it must contain all four components: Situation, Task, Action, and Result
**Validates: Requirements 2.2**

### Property 4: Resume Bullet Length Constraint

_For any_ generated resume bullet point, the character count should not exceed 150 characters
**Validates: Requirements 3.4**

### Property 5: Skill Gap Identification

_For any_ target role and user portfolio, the identified skill gaps should be the set difference between role requirements and present skills
**Validates: Requirements 4.2**

### Property 6: Project Recommendation Prioritization

_For any_ set of project recommendations, they should be ordered by the number of skill gaps they fill (descending)
**Validates: Requirements 5.1**

### Property 7: Mock Interview Question Relevance

_For any_ project selected for mock interview, all generated questions should reference technologies or concepts present in that project
**Validates: Requirements 6.1**

### Property 8: Job Match Percentage Bounds

_For any_ job match calculation, the match percentage should be between 0 and 100 inclusive
**Validates: Requirements 7.2**

### Property 9: README Markdown Validity

_For any_ generated README, parsing it as Markdown should not produce errors
**Validates: Requirements 8.3**

### Property 10: Dashboard Data Consistency

_For any_ user dashboard, the displayed portfolio score should match the most recent score in the database
**Validates: Requirements 9.5**

---

## Error Handling

### Error Categories

#### 1. Authentication Errors

- `AUTH_FAILED`: GitHub OAuth failed
- `SESSION_EXPIRED`: User session expired
- `UNAUTHORIZED`: User not authorized for resource

**Handling:** Redirect to login, clear session, show friendly message

#### 2. API Errors

- `GITHUB_RATE_LIMIT`: GitHub API rate limit exceeded
- `GITHUB_NOT_FOUND`: Repository not found
- `OPENAI_ERROR`: OpenAI API error
- `OPENAI_RATE_LIMIT`: OpenAI rate limit exceeded

**Handling:** Cache responses, queue requests, show retry option

#### 3. Validation Errors

- `INVALID_INPUT`: User input validation failed
- `MISSING_REQUIRED_FIELD`: Required field missing
- `INVALID_FORMAT`: Data format incorrect

**Handling:** Show inline validation errors, prevent submission

#### 4. System Errors

- `DATABASE_ERROR`: Database operation failed
- `NETWORK_ERROR`: Network request failed
- `UNKNOWN_ERROR`: Unexpected error

**Handling:** Log error, show generic message, offer retry

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
}
```

### Retry Strategy

- **Exponential Backoff:** For rate limits, network errors
- **Max Retries:** 3 attempts
- **Timeout:** 30 seconds per request
- **Circuit Breaker:** Disable failing services temporarily

---

## Testing Strategy

### Unit Testing

**Framework:** Vitest + Testing Library

**Coverage:**

- Utility functions (scoring algorithms, text processing)
- React components (rendering, interactions)
- API route handlers (request/response logic)
- Database queries (CRUD operations)

**Example Tests:**

- Portfolio score calculation with various inputs
- STAR story parser validates all components
- Resume bullet length validator
- Skill gap set difference logic

### Property-Based Testing

**Framework:** fast-check (JavaScript property testing)

**Configuration:** Minimum 100 iterations per property

**Tests:**

- **Property 1:** OAuth round trip (generate random user data, verify session)
- **Property 2:** Portfolio score consistency (same input = same output)
- **Property 3:** STAR story completeness (all stories have S, T, A, R)
- **Property 4:** Resume bullet length (all bullets ≤ 150 chars)
- **Property 5:** Skill gap correctness (gaps = required - present)
- **Property 6:** Recommendation ordering (sorted by gaps filled)
- **Property 7:** Interview question relevance (questions match project tech)
- **Property 8:** Job match bounds (0 ≤ match ≤ 100)
- **Property 9:** README validity (valid Markdown)
- **Property 10:** Dashboard consistency (score matches DB)

**Tagging Format:**

```typescript
// Feature: GitStory, Property 2: Portfolio Score Consistency
test("portfolio score is deterministic", () => {
  fc.assert(
    fc.property(fc.portfolioData(), (data) => {
      const score1 = calculatePortfolioScore(data);
      const score2 = calculatePortfolioScore(data);
      expect(score1).toEqual(score2);
    }),
    { numRuns: 100 }
  );
});
```

### Integration Testing

**Framework:** Playwright

**Coverage:**

- End-to-end user flows
- GitHub OAuth flow
- Portfolio analysis flow
- Story generation flow
- Mock interview flow

**Example Tests:**

- User logs in → sees dashboard → analyzes project → generates story
- User completes mock interview → receives feedback
- User pastes job description → sees match score

### Manual Testing

**Focus:**

- UI/UX polish
- AI-generated content quality
- Error message clarity
- Mobile responsiveness

---

## Kiro Integration Strategy

### 1. Spec-Driven Development

**Usage:**

- Created requirements.md with 10 user stories, 50+ acceptance criteria
- Creating design.md with architecture, data models, properties
- Will create tasks.md with day-by-day implementation plan

**Benefit:** Structured approach prevents scope creep, ensures completeness

**Documentation:** Include screenshots of spec files in Kiro writeup

### 2. Vibe Coding

**Usage:**

- "Build GitHub OAuth flow with error handling"
- "Create PortfolioScoreCard component with animations"
- "Implement portfolio scoring algorithm"
- "Generate STAR story from project data"

**Benefit:** Rapid prototyping, 10x faster than manual coding

**Documentation:** Save chat logs showing impressive code generation

### 3. Agent Hooks

**Planned Hooks:**

**Hook 1: Test on Save**

```json
{
  "name": "test-on-save",
  "trigger": "onFileSave",
  "filePattern": "**/*.{ts,tsx}",
  "action": "runCommand",
  "command": "npm test -- --run"
}
```

**Hook 2: Update Docs**

```json
{
  "name": "update-docs",
  "trigger": "onFileSave",
  "filePattern": "**/api/**/*.ts",
  "action": "sendMessage",
  "message": "Update API documentation for changed files"
}
```

**Hook 3: Lint on Commit**

```json
{
  "name": "lint-on-commit",
  "trigger": "preCommit",
  "action": "runCommand",
  "command": "npm run lint"
}
```

**Benefit:** Automated quality checks, faster feedback loop

**Documentation:** Show .kiro/hooks/ directory with hook definitions

### 4. Steering Docs

**Planned Steering:**

**Steering 1: AI Tone** (`.kiro/steering/ai-tone.md`)

```markdown
# AI Content Generation Guidelines

When generating content for GitStory:

- Use professional but encouraging tone
- Avoid jargon unless necessary
- Quantify achievements when possible
- Use action verbs (built, implemented, optimized)
- Keep sentences concise (<25 words)
- Focus on impact and results
```

**Steering 2: Code Standards** (`.kiro/steering/code-standards.md`)

```markdown
# TypeScript Code Standards

- Use TypeScript strict mode
- Prefer functional components with hooks
- Use async/await over promises
- Handle errors explicitly
- Add JSDoc comments for complex functions
- Use meaningful variable names
```

**Steering 3: Resume Writing** (`.kiro/steering/resume-standards.md`)

```markdown
# Resume Bullet Point Standards

- Start with action verb (Developed, Implemented, Optimized)
- Include quantified results (50% faster, 100+ users)
- Mention specific technologies
- Keep under 150 characters
- Focus on impact, not just tasks
```

**Benefit:** Consistent, high-quality outputs across all AI generation

**Documentation:** Show steering docs and before/after examples

### 5. MCP (Model Context Protocol)

**Planned MCP Servers:**

**MCP 1: GitHub API with Caching**

```json
{
  "mcpServers": {
    "github-cached": {
      "command": "node",
      "args": [".kiro/mcp/github-server.js"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Features:**

- Cache GitHub API responses (reduce rate limits)
- Batch requests for efficiency
- Automatic retry with exponential backoff

**MCP 2: Job Board API**

```json
{
  "mcpServers": {
    "job-boards": {
      "command": "node",
      "args": [".kiro/mcp/job-server.js"]
    }
  }
}
```

**Features:**

- Aggregate data from multiple job boards
- Extract skill requirements from job descriptions
- Provide salary and demand data

**Benefit:** Extend Kiro's capabilities, reduce API costs, improve reliability

**Documentation:** Show .kiro/settings/mcp.json and custom server code

---

## Performance Optimization

### Caching Strategy

**1. GitHub API Responses**

- Cache repo data for 1 hour
- Cache commit history for 24 hours
- Cache language breakdown for 24 hours

**2. AI-Generated Content**

- Cache generated stories, bullets, READMEs
- Invalidate on project update
- Store in database for reuse

**3. Portfolio Scores**

- Cache score for 1 hour
- Recalculate on project changes
- Store historical scores for trends

### Database Optimization

**Indexes:**

```sql
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_generated_content_project_id ON generated_content(project_id);
CREATE INDEX idx_portfolio_scores_user_id ON portfolio_scores(user_id);
CREATE INDEX idx_skill_gaps_user_id ON skill_gaps(user_id);
```

**Query Optimization:**

- Use SELECT only needed columns
- Paginate large result sets
- Use JSONB indexes for metadata queries

### Frontend Optimization

**Code Splitting:**

- Lazy load routes with Next.js dynamic imports
- Split large components
- Load AI features on demand

**Image Optimization:**

- Use Next.js Image component
- Serve WebP format
- Lazy load below-fold images

**Bundle Size:**

- Tree-shake unused code
- Use dynamic imports for heavy libraries
- Analyze bundle with webpack-bundle-analyzer

---

## Security Considerations

### Authentication

- Use Supabase Auth with GitHub OAuth
- Store JWT tokens in httpOnly cookies
- Implement CSRF protection
- Rotate tokens regularly

### API Security

- Rate limit API routes (10 req/min per user)
- Validate all inputs
- Sanitize user-generated content
- Use environment variables for secrets

### Data Privacy

- Don't store GitHub access tokens long-term
- Encrypt sensitive data at rest
- Implement data deletion on user request
- GDPR compliance (data export, deletion)

### Content Security

- Sanitize AI-generated content (prevent XSS)
- Validate Markdown before rendering
- Implement Content Security Policy headers
- Use HTTPS only

---

## Deployment Strategy

### Vercel Deployment

**Configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "env": {
    "GITHUB_CLIENT_ID": "@github-client-id",
    "GITHUB_CLIENT_SECRET": "@github-client-secret",
    "OPENAI_API_KEY": "@openai-api-key",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key"
  }
}
```

**Environments:**

- **Development:** Local (localhost:3000)
- **Preview:** Vercel preview deployments (per PR)
- **Production:** gitstory.dev (main branch)

### Monitoring

**Tools:**

- Vercel Analytics (page views, performance)
- Sentry (error tracking)
- Supabase Dashboard (database metrics)
- OpenAI Usage Dashboard (API costs)

**Alerts:**

- Error rate > 5%
- API response time > 5s
- Database connection failures
- OpenAI rate limit approaching

---

## Scalability Plan

### Current Architecture (MVP)

- Supports: 1,000 concurrent users
- Cost: ~$100/month (Vercel + Supabase + OpenAI)

### Future Scaling (Post-Hackathon)

- **10,000 users:** Add Redis caching, CDN
- **100,000 users:** Migrate to dedicated database, queue system
- **1M+ users:** Microservices, Kubernetes, multi-region

---

## Success Metrics

### Technical Metrics

- API response time < 2s (p95)
- Error rate < 1%
- Uptime > 99.5%
- Test coverage > 80%

### User Metrics

- Portfolio score improvement: +20 points average
- Time to generate content: < 5 minutes
- Mock interview completion rate: > 60%
- User satisfaction: > 4/5 stars

### Business Metrics

- Conversion rate (free → pro): > 5%
- Monthly active users: 1,000+ (3 months post-launch)
- Revenue: $5k MRR (6 months post-launch)

---

## Next Steps

1. **Review this design document**
2. **Create tasks.md** - Day-by-day implementation plan
3. **Setup project** - Initialize Next.js, install dependencies
4. **Start Day 2** - Implement GitHub OAuth

**Ready to create tasks.md?**

---

## Task 14 Implementation Notes (Added 2025-11-20)

### README Generation Architecture

**Files Structure:**

```
lib/
  openai/
    generateReadme.ts       # Main OpenAI-powered README generation
  github/
    fetchReadme.ts          # Fetch existing README from GitHub API
  utils/
    validateMarkdown.ts     # Validate Markdown syntax
    generateBadges.ts       # Generate shields.io badges
app/api/
  ai/readme/
    route.ts                # Main README generation endpoint
  test/readme/
    route.ts                # Test endpoint
```

**README Sections to Generate:**

1. Title with badges (shields.io format)
2. Description (2-3 sentences)
3. Features (bullet list)
4. Tech Stack
5. Installation instructions
6. Usage examples
7. API Documentation (if backend project)
8. Screenshots (placeholder)
9. Contributing guidelines
10. License (MIT)
11. Contact information

**OpenAI Prompt Strategy:**

- Provide project metadata (name, description, languages, stars, URL)
- Include existing README if enhancement mode
- Request proper Markdown formatting
- Specify heading hierarchy and code blocks
- Request shields.io badge format

**Validation (Property 9):**

- Check for headings (#)
- Verify minimum content length (>100 chars)
- Check for unclosed code blocks (``` count must be even)
- Validate required sections present

**Badge Generation:**

- Language badge (top language)
- Stars badge (if > 0)
- License badge (MIT)
- Format: shields.io standard

**Caching Strategy:**

- 24-hour cache in generated_content table
- content_type: 'readme'
- Return cached if < 24 hours old

**Enhancement Mode:**

- Fetch existing README from GitHub
- Pass to OpenAI with "enhance and improve" instruction
- Preserve good existing content while improving structure

**API Endpoint:**

- POST /api/ai/readme
- Body: { projectId: string, enhance?: boolean }
- Returns: { readme: string, cached: boolean, generatedAt: string }

---

---

## Feature 11: Portfolio Website Generation Architecture

### Overview

Generates a complete, deployable portfolio website from GitHub projects and automatically deploys to GitHub Pages.

### Components

#### 1. Portfolio Template System

**File:** `lib/templates/portfolio-template.ts`

**Responsibilities:**

- Generate responsive HTML/CSS using Tailwind CDN
- Create sections: Hero, Projects, Skills, Contact
- Use modern design with gradients and animations
- Support dark theme with purple/pink accent colors

**Template Structure:**

```
- Navigation (fixed, backdrop blur)
- Hero Section (name, bio, CTA)
- Projects Grid (3 columns, cards with hover effects)
- Skills Section (badge grid)
- Contact Section (GitHub, LinkedIn, Email)
- Footer (generated by GitStory)
```

#### 2. AI Content Generation

**File:** `lib/openai/generatePortfolioContent.ts`

**Functions:**

- `generatePortfolioBio()`: Creates 2-3 sentence developer bio
- `generateProjectDescription()`: Creates compelling 1-2 sentence project descriptions

**AI Strategy:**

- Analyze tech stack across all projects
- Highlight technical expertise
- Create personable but professional tone
- Emphasize building and innovation

#### 3. GitHub Pages Deployment

**File:** `lib/github/deployToPages.ts`

**Responsibilities:**

- Check if `username.github.io` repo exists
- Create repo if doesn't exist
- Update `index.html` if repo exists
- Handle GitHub API authentication
- Return live URL

**Deployment Flow:**

```
1. Check repo existence
2. If exists: Get current index.html SHA
3. If not exists: Create new repo
4. Create/update index.html with base64 content
5. Return URL: https://username.github.io
```

#### 4. API Endpoint

**File:** `app/api/ai/portfolio-site/route.ts`

**Request:**

```json
POST /api/ai/portfolio-site
{} // No body needed, uses authenticated user
```

**Response:**

```json
{
  "success": true,
  "url": "https://username.github.io",
  "repoName": "username.github.io",
  "message": "Portfolio site deployed successfully!"
}
```

**Process:**

1. Authenticate user
2. Fetch top 6 projects by stars
3. Generate bio with AI
4. Generate project descriptions with AI
5. Extract skills from all projects
6. Generate HTML from template
7. Deploy to GitHub Pages
8. Return live URL

### Data Flow

```
User Request
    ↓
Fetch Projects (Supabase)
    ↓
Generate Bio (OpenAI)
    ↓
Generate Descriptions (OpenAI)
    ↓
Extract Skills (Local)
    ↓
Generate HTML (Template)
    ↓
Deploy to GitHub Pages (Octokit)
    ↓
Return URL
```

### Caching Strategy

- No caching (always generate fresh)
- User can regenerate anytime
- GitHub Pages handles hosting/caching

### Error Handling

- GitHub API rate limits: Return error with retry message
- No projects: Return 404 with helpful message
- Deployment failure: Return error with GitHub repo link
- AI generation failure: Use fallback descriptions

---

## Feature 12: Live Voice Interview Simulator Architecture

### Overview

Real-time voice interview practice using OpenAI Whisper (speech-to-text) and TTS (text-to-speech) for natural conversation flow.

### Components

#### 1. Voice Recording System

**File:** `lib/audio/voiceRecorder.ts` (Client-side)

**Responsibilities:**

- Capture microphone audio using Web Audio API
- Detect silence for auto-submission (2 seconds)
- Convert audio to format for Whisper API
- Show visual recording indicator

**Browser APIs:**

- `MediaRecorder` for audio capture
- `AudioContext` for silence detection
- `Blob` for audio data handling

#### 2. Speech-to-Text Integration

**File:** `lib/openai/speechToText.ts`

**Responsibilities:**

- Send audio to OpenAI Whisper API
- Transcribe user's spoken answer
- Handle errors and retries
- Return transcribed text

**API:**

```typescript
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-1");

  const response = await openai.audio.transcriptions.create({
    file: audioBlob,
    model: "whisper-1",
  });

  return response.text;
}
```

#### 3. Text-to-Speech Integration

**File:** `lib/openai/textToSpeech.ts`

**Responsibilities:**

- Convert AI questions/feedback to speech
- Use OpenAI TTS API
- Return audio URL for playback
- Handle voice selection (alloy, echo, fable, onyx, nova, shimmer)

**API:**

```typescript
async function generateSpeech(text: string): Promise<string> {
  const response = await openai.audio.speech.create({
    model: "tts-1",
    voice: "nova", // Professional female voice
    input: text,
  });

  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64"); // Return as base64 for client playback
}
```

#### 4. Interview Question Generation

**File:** `lib/openai/generateInterviewQuestions.ts`

**Responsibilities:**

- Analyze selected project
- Generate 5-7 relevant technical questions
- Include behavioral questions
- Vary difficulty (easy, medium, hard)

**Question Types:**

- Technical implementation: "How did you implement X?"
- Architecture decisions: "Why did you choose Y?"
- Challenges: "What was the biggest challenge?"
- Scalability: "How would you scale this?"
- Trade-offs: "What trade-offs did you make?"

#### 5. Answer Evaluation

**File:** `lib/openai/evaluateAnswer.ts`

**Responsibilities:**

- Analyze transcribed answer
- Score on: completeness, technical accuracy, clarity
- Generate specific feedback
- Provide improvement suggestions

**Evaluation Criteria:**

```typescript
interface AnswerEvaluation {
  score: number; // 0-100
  completeness: number; // 0-100
  technicalAccuracy: number; // 0-100
  clarity: number; // 0-100
  strengths: string[];
  improvements: string[];
  feedback: string; // Spoken feedback
}
```

#### 6. API Endpoints

**Start Interview:**

```typescript
POST /api/interview/voice/start
{
  "projectId": "uuid"
}

Response:
{
  "interviewId": "uuid",
  "firstQuestion": "Tell me about this project...",
  "questionAudio": "base64_audio_data"
}
```

**Submit Answer:**

```typescript
POST /api/interview/voice/answer
{
  "interviewId": "uuid",
  "audioData": "base64_audio_blob"
}

Response:
{
  "transcription": "I built this using React...",
  "evaluation": {
    "score": 85,
    "feedback": "Great explanation! You clearly...",
    "strengths": ["Clear communication", "Technical depth"],
    "improvements": ["Could mention scalability"]
  },
  "feedbackAudio": "base64_audio_data",
  "nextQuestion": "How did you handle state management?",
  "nextQuestionAudio": "base64_audio_data",
  "isComplete": false
}
```

**End Interview:**

```typescript
POST /api/interview/voice/end
{
  "interviewId": "uuid"
}

Response:
{
  "summary": {
    "overallScore": 82,
    "technicalDepth": 85,
    "communication": 80,
    "questionsAnswered": 5,
    "transcript": [...],
    "recommendations": [...]
  }
}
```

### Data Flow

```
User Clicks "Start Interview"
    ↓
Generate Questions (OpenAI)
    ↓
Convert Question to Speech (OpenAI TTS)
    ↓
Play Audio to User
    ↓
User Speaks Answer (Browser MediaRecorder)
    ↓
Detect Silence → Auto Submit
    ↓
Transcribe Audio (OpenAI Whisper)
    ↓
Evaluate Answer (OpenAI GPT)
    ↓
Generate Feedback (OpenAI GPT)
    ↓
Convert Feedback to Speech (OpenAI TTS)
    ↓
Play Feedback Audio
    ↓
Next Question or End Interview
```

### Database Schema

```sql
CREATE TABLE voice_interviews (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  questions JSONB, -- Array of questions
  answers JSONB, -- Array of {question, transcription, audio_url, evaluation}
  overall_score INTEGER,
  technical_depth_score INTEGER,
  communication_score INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

### Client Component Structure

```typescript
// components/VoiceInterviewSimulator.tsx
"use client";

export function VoiceInterviewSimulator({ projectId }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [transcript, setTranscript] = useState<Message[]>([]);
  const [isAISpeaking, setIsAISpeaking] = useState(false);

  // Start recording
  // Detect silence
  // Submit audio
  // Play AI response
  // Show transcript
}
```

### Performance Considerations

- **Audio Processing:** Use Web Workers for heavy processing
- **Streaming:** Consider streaming audio for faster response
- **Caching:** Cache TTS audio for common phrases
- **Compression:** Compress audio before sending to API

### Error Handling

- Microphone permission denied: Show instructions
- Network errors: Retry with exponential backoff
- Whisper API errors: Show transcription failed message
- TTS API errors: Fall back to text-only mode
- Silence detection false positives: Add manual submit button

---
