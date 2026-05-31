# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## IMPORTANT: Always Read Docs First

**RULE: Before writing ANY code, you MUST read the relevant file(s) in the `/docs` directory.** This is not optional and applies to every code generation task without exception.

- List the `/docs` directory first to see what's available
- Read every doc file that relates to the feature, library, pattern, or API you are about to use
- Only begin writing code after reading the relevant docs
- Project docs take absolute precedence over training data — do not rely on what you "know" about a library if a doc file covers it

## Code Generation Guidelines

These rules apply to every file you write or edit. No exceptions.

### Data Fetching
- **Server Components only.** Never fetch data in route handlers, client components, or via any client-side library.
- All database queries must go through helper functions in `/data`, using Drizzle ORM. No raw SQL.
- Every query must be scoped to the authenticated user's ID — users must never be able to access another user's data.
- See `docs/data-fetching.md` for the full data fetching standard and required patterns.

### Data Mutations
- All database mutations must go through helper functions in `/data`, using Drizzle ORM. No raw SQL.
- All mutations must be triggered via Server Actions defined in colocated `actions.ts` files.
- Server Action parameters must be explicitly typed — never use `FormData`.
- All Server Actions must validate their arguments with Zod before proceeding.
- See `docs/data-mutations.md` for the full mutations standard and required patterns.

### UI Components
- **Only shadcn/ui components** may be used for UI. Do not create custom components.
- Install missing components with `npx shadcn@latest add <component>`.
- Never modify files under `src/components/ui/` beyond what shadcn generates.
- See `docs/ui.md` for the full UI standard.

### Dates
- All dates must be formatted with `date-fns` using the `do MMM yyyy` format (e.g. `1st Sep 2025`).
- Never use `Date.toLocaleDateString`, `Intl.DateTimeFormat`, or any other date API.

### Authentication
- This app uses **Clerk** for authentication. Do not use any other auth library or custom auth logic.
- Get the current user in Server Components via `auth()` from `@clerk/nextjs/server`. Always redirect to `/sign-in` if `userId` is null.
- See `docs/auth.md` for the full authentication standard and required patterns.

### React / Next.js
- All pages and components are Server Components by default. Add `"use client"` only when interactivity requires it.
- Middleware lives in `src/proxy.ts` — not `middleware.ts`.

### Styling
- Use Tailwind CSS v4 utility classes. Theme customizations go in `globals.css` via `@theme`, not in a config file.

### TypeScript
- All new files must be TypeScript (`.ts` / `.tsx`). No plain `.js` files.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.6** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via `@tailwindcss/postcss` in `postcss.config.mjs`)

## Architecture

This is an App Router project under `src/app/`. The root layout (`src/app/layout.tsx`) sets up Geist fonts as CSS variables and a full-height flex column body. All pages are Server Components by default; add `"use client"` only when needed.

Tailwind v4 differs from v3: configuration is done in CSS (`globals.css`) rather than `tailwind.config.*`. There is no `tailwind.config.ts` file — add theme customizations via `@theme` in CSS.

Next.js 16 uses `proxy.ts` (not `middleware.ts`) for middleware — the file convention was renamed. Clerk middleware lives in `src/proxy.ts`.
