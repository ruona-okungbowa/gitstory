---
inclusion: fileMatch
fileMatchPattern: "app/api/**/*.ts"
---

<!------------------------------------------------------------------------------------
   Add rules to this file or a short description and have Kiro refine them for you.
   
   Learn about inclusion modes: https://kiro.dev/docs/steering/#inclusion-modes
------------------------------------------------------------------------------------->

# API Route Design Standards

All API routes should follow this structure:

1. Authenticate user with Supabase
2. Validate request body/params
3. Check cache (if applicable)
4. Perform main operation
5. Store results in database
6. Return JSON response with proper status code

Error responses should include:

- `error`: Human-readable error message
- `details`: Technical details (optional)
- Proper HTTP status code

Success responses should include:

- Main data
- `cached`: boolean (if applicable)
- `generatedAt`: ISO timestamp
