# GitStory Development Log

## 2025-11-19 (Day 1)

### ✅ Completed

**Task 1: Project Setup and Configuration**

- Initialized Next.js 16 project with TypeScript and Tailwind CSS
- Configured ESLint and Prettier
- Created environment variables template (.env.example)
- Set up project structure (types, components, lib directories)
- Created TypeScript type definitions for all data models
- Updated package.json name to "gitstory"

**Task 2: Database Schema and Supabase Setup**

- Created Supabase project and configured GitHub OAuth provider
- Designed and implemented complete database schema:
  - `users` table (linked to Supabase Auth)
  - `projects` table
  - `generated_content` table
  - `portfolio_scores` table
  - `skill_gaps` table
  - `project_recommendations` table
  - `mock_interviews` table
  - `job_matches` table
- Added database indexes for performance optimization
- Enabled Row Level Security (RLS) on all tables
- Created RLS policies for user data isolation
- Configured environment variables for Supabase connection

**Task 3: Authentication Flow**

- Implemented GitHub OAuth flow with Supabase
- Created API routes:
  - `/api/auth/github` - Initiates OAuth
  - `/api/auth/callback` - Handles OAuth callback and user creation
  - `/api/auth/logout` - Handles user logout
- Built Supabase client utilities (browser and server)
- Created AuthProvider context for global auth state management
- Designed and implemented login page with GitHub OAuth button
- Built UserMenu component with avatar, dropdown, and logout
- Updated root layout with header and auth provider
- Created basic dashboard page for testing
- Configured middleware to protect routes
- Fixed middleware to allow API auth routes
- Configured Next.js to allow GitHub avatar images

### 🚧 In Progress

- None currently

### 📝 Next Steps

- Task 4: GitHub Integration
  - Create GitHub API client with Octokit
  - Implement repository fetching
  - Build projects list UI
  - Analyze commit history

### 🐛 Issues Encountered & Resolved

1. **Supabase environment variables not loading**
   - Issue: Wrong variable name (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` vs `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Solution: Fixed variable name and restarted dev server

2. **GitHub OAuth button not working**
   - Issue: Middleware was blocking `/api/auth/github` route
   - Solution: Updated middleware to exclude `/api/auth` routes from authentication check

3. **Avatar images not loading**
   - Issue: Next.js Image component requires hostname configuration
   - Solution: Added `avatars.githubusercontent.com` to `remotePatterns` in next.config.ts

### 📊 Progress

- **Tasks Completed:** 3/22 (13.6%)
- **Estimated Time Spent:** ~6 hours
- **Days Remaining:** 17 days until Dec 5 deadline

### 💡 Notes

- Using Supabase Auth with GitHub OAuth instead of manual JWT handling
- Decided to skip service_role key for now, using RLS policies instead
- Simplified users table to use Supabase Auth ID directly as primary key
- Authentication flow is fully functional and tested

---

## 2025-11-19 (Day 1 - Continued)

### ✅ Completed (Afternoon Session)

**Task 4: GitHub Integration**

- Created GitHub API client with Octokit
  - Built `lib/github/client.ts` for creating authenticated GitHub clients
  - Implemented error handling for rate limits and API failures
  - Created `lib/github/errors.ts` for custom error types
- Implemented repository fetching and storage
  - Created `/api/github/repos` endpoint to fetch all user repositories
  - Implemented pagination with `octokit.paginate()` to handle users with 100+ repos
  - Added language breakdown fetching for each repository
  - Stored repos in `projects` table with proper foreign key relationships
  - Successfully synced 17 repositories from GitHub
- Implemented commit history analysis
  - Created `lib/github/analysis.ts` with commit analysis logic
  - Built `/api/github/analyse/[repoId]` dynamic route for project analysis
  - Calculated metrics: total commits, commit frequency, contributors, activity status
  - Implemented complexity scoring algorithm (0-100 scale):
    - Stars contribution (max 20 points)
    - Forks contribution (max 15 points)
    - Commit frequency (max 25 points)
    - Number of contributors (max 15 points)
    - Language diversity (max 15 points)
    - Recent activity bonus (10 points)
- Built projects list UI
  - Created `/projects` page with responsive grid layout
  - Implemented "Sync with GitHub" functionality
  - Added "Analyse" button for each project card
  - Displayed project metadata: name, description, stars, forks, languages
  - Showed complexity scores after analysis
  - Created loading states and error handling
  - Built `ProjectCard` component with actions
  - Created `/api/projects` endpoint to fetch user's projects from database

### 🐛 Issues Encountered & Resolved

4. **GitHub token not found error**
   - Issue: `provider_token` wasn't being stored in session
   - Solution: Added `scopes: "read:user user:email repo"` to GitHub OAuth request to get repository access

5. **User foreign key constraint violation**
   - Issue: Projects couldn't be inserted because user didn't exist in `users` table
   - Solution: Updated callback route to create user record in database after OAuth success

6. **Projects not appearing after sync**
   - Issue: Updated projects weren't being added to response array
   - Solution: Modified repos route to push both new and updated projects to response array

7. **Analyse button returning 404**
   - Issue: Analyse route file path had British spelling but frontend used American spelling
   - Solution: Standardised entire codebase to use British English spelling (analyse, analysing, analysed)

8. **Next.js 15+ params error**
   - Issue: Dynamic route params are now async Promises in Next.js 15+
   - Solution: Changed `params: { repoId: string }` to `params: Promise<{ repoId: string }>` and awaited params

9. **Database not updating after analysis**
   - Issue: Typo in column name (`anaysed_at` instead of `analysed_at`)
   - Solution: Fixed typo and added error checking for database updates

### 📊 Progress

- **Tasks Completed:** 4/22 (18.2%)
- **Estimated Time Spent:** ~14 hours total
- **Days Remaining:** 17 days until Dec 5 deadline

### 💡 Notes

- Octokit pagination automatically handles users with many repositories
- GitHub API rate limit: 5,000 requests/hour for authenticated users
- Complexity scoring algorithm provides good differentiation between projects
- British English spelling maintained throughout codebase for consistency
- Next.js 15+ requires awaiting dynamic route params (breaking change from v14)
- Language breakdown API call is expensive (1 call per repo) - consider caching strategy

### 🎯 Key Achievements Today

- Complete authentication system with GitHub OAuth
- Full database schema with RLS policies
- Working GitHub integration with 17 repos synced
- Functional project analysis with complexity scoring
- Professional UI with responsive design

---
