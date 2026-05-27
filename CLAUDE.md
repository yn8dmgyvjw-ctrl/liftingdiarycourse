# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

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
