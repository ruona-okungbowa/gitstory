# Tech Stack

## Framework & Runtime

- **Next.js 16** with App Router (React Server Components)
- **React 19** with TypeScript
- **Node.js 20+**

## Core Libraries

- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL + Auth with SSR)
- **AI**: OpenAI SDK (GPT-4o-mini default model)
- **GitHub API**: Octokit v5
- **Testing**: Vitest with React Testing Library

## Code Quality

- **Linting**: ESLint 9 with Next.js config
- **Formatting**: Prettier (double quotes, 2 spaces, 80 char width, semicolons)
- **Type Safety**: TypeScript strict mode enabled

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Building
npm run build            # Production build
npm start                # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run format:check     # Check formatting

# Testing
npm test                 # Run tests in watch mode
npm run test:run         # Run tests once
npm run test:ui          # Open Vitest UI
```

## Environment Variables

Required in `.env.local`:

- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` - GitHub OAuth
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase public
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase admin access
- `OPENAI_API_KEY` - OpenAI API access

## Deployment

Designed for Vercel with serverless functions.
