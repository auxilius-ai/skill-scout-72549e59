# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start dev server on port 8080
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npm test` — Run all tests once (`vitest run`)
- `npm run test:watch` — Run tests in watch mode
- `npx vitest run src/path/to/file.test.ts` — Run a single test file

## Tech Stack

Vite + React 18 + TypeScript, shadcn/ui (Radix primitives), Tailwind CSS, Supabase (Postgres + RLS), deployed on Vercel. Originally scaffolded with Lovable. Testing with Vitest + jsdom + React Testing Library.

## Architecture

**DevScreen** is an anonymous technical self-assessment tool for interview preparation. Recruiters generate unique assessment links; candidates complete a multi-step wizard; the same link then shows results.

### Routes (`src/App.tsx`)

| Route | Page | Purpose |
|---|---|---|
| `/` | `Index` | Public landing page |
| `/auxi-secret-recruiter-page` | `GeneratePage` | Recruiter creates assessment links |
| `/c/:code` | `AssessmentPage` | Candidate assessment wizard + results view |

### Assessment Flow (4-step wizard in `AssessmentPage`)

1. **WelcomeStep** — Intro and privacy notice
2. **SkillRatingStep** — Rate each skill (none/basic/intermediate/advanced/expert) + "last used" recency
3. **CapabilityStep** — For skills rated intermediate+, check specific capabilities
4. **ConfirmationStep** — Submission confirmation

Once completed, the same `/c/:code` URL shows `ResultsView` (read-only results display).

### Data Model

Skills are defined in `src/data/skills.json` (static JSON, not in DB). Types and helpers for skills live in `src/lib/skills.ts`. Skill keys are derived from names via lowercase + non-alphanumeric → underscore.

Supabase tables (see `supabase/migrations/`):
- `assessments` — Each assessment identified by unique 8-char alphanumeric `code`
- `skill_ratings` — Rating + last_used per skill per assessment
- `capability_selections` — Boolean selections per capability per skill per assessment

No authentication — all tables have public RLS policies. Access is gated by knowing the assessment code.

### Key Conventions

- **Path alias**: `@` maps to `./src` (configured in vite, vitest, and tsconfig)
- **UI components**: shadcn/ui components live in `src/components/ui/`; app components directly in `src/components/`
- **Supabase client**: `src/integrations/supabase/client.ts` (auto-generated, don't edit). Types in `src/integrations/supabase/types.ts`.
- **Styling**: Tailwind with CSS variables for theming (HSL color tokens in `src/index.css`). Custom semantic colors: `rating-*` (skill levels), `step-*` (wizard progress), `surface`, `success`, `warning`.
- **TypeScript**: Strict mode is off. `noImplicitAny` and `strictNullChecks` are disabled.
- **ESLint**: `@typescript-eslint/no-unused-vars` is turned off.
- **Test setup**: `src/test/setup.ts` provides `@testing-library/jest-dom` matchers and `matchMedia` mock.
- **Environment variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env`.