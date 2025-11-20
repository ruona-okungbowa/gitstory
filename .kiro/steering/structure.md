# Project Structure

## Directory Organization

```
app/                    # Next.js App Router
├── api/               # API routes (serverless functions)
│   ├── ai/           # AI-powered endpoints (readme, story, bullets)
│   ├── analysis/     # Portfolio scoring, skill gaps, recommendations
│   ├── auth/         # GitHub OAuth callbacks
│   ├── github/       # GitHub API proxies
│   ├── projects/     # Project CRUD operations
│   └── test/         # Development test endpoints
├── dashboard/        # Dashboard page
├── login/            # Login page
├── projects/         # Projects listing page
└── page.tsx          # Landing page

components/            # React components
lib/                   # Utility functions and clients
├── analysis/         # Skill extraction, gap analysis, dependency parsing
├── auth/             # Auth provider components
├── data/             # Static data (templates, role requirements)
├── github/           # GitHub API client and helpers
├── openai/           # OpenAI client, prompts, caching
├── scoring/          # Portfolio scoring logic
├── supabase/         # Supabase clients (browser, server, middleware)
└── utils/            # General utilities (badges, validation)

types/                 # TypeScript type definitions
__tests__/            # Test files
```

## Naming Conventions

- **Files**: kebab-case for utilities, PascalCase for components
- **API Routes**: RESTful structure using Next.js file-based routing
- **Database columns**: snake_case (matches Supabase)
- **TypeScript types**: PascalCase interfaces, camelCase properties

## Architecture Patterns

### API Routes

- Use Next.js Route Handlers (`route.ts`)
- Always validate user authentication via Supabase
- Return `NextResponse.json()` with appropriate status codes
- Handle errors with try-catch and descriptive messages

### Data Layer

- Supabase for all database operations
- Use `createClient()` from `lib/supabase/server` in API routes
- Use `createClient()` from `lib/supabase/client` in client components
- Types: `*Row` interfaces for DB queries, regular interfaces for app logic

### AI Integration

- Centralized OpenAI client in `lib/openai/client.ts`
- Default model: `gpt-4o-mini`
- Prompts stored in `lib/openai/prompts.ts`
- Cache generated content in `generated_content` table (24hr TTL)

### GitHub Integration

- Use Octokit client from `lib/github/client.ts`
- Access token from Supabase session (`provider_token`)
- Check rate limits before heavy operations

## Import Aliases

Use `@/*` for absolute imports from project root:

```typescript
import { createClient } from "@/lib/supabase/server";
import { Project } from "@/types";
```

## Key Conventions

- Server components by default, use `"use client"` only when needed
- Async/await for all API calls
- Error boundaries for user-facing errors
- Environment variables validated at runtime
