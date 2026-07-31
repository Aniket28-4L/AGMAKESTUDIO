# AG Makeup Studio

A luxury bridal makeup and styling web application built with React, Vite, Tailwind CSS, Lenis, GSAP, and Sanity CMS.

## Run & Operate

- `pnpm --filter @workspace/ag-makeup-studio run dev` — run the frontend development server
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Framer Motion, Lenis, GSAP
- CMS: Sanity Studio (`services/sanity-studio`)
- Package Management: pnpm workspaces

## Architecture & Repo Structure

- `artifacts/ag-makeup-studio`: Main frontend application for AG Makeup Studio.
- `services/sanity-studio`: Sanity CMS schemas, configuration, and content management.
- `lib/`: Shared TypeScript client packages and specs.
