# Repository Guidelines

## Project Structure & Module Organization

ClassBloom is currently in the planning stage, with the product and implementation plan in `PLAN.md`.

The planned application is a Next.js App Router project with TypeScript and Tailwind CSS.

Keep route-level screens in `app/`, reusable UI in `components/`, client-side lesson and draft logic in `lib/` or `stores/`, and static assets in `public/`.

Place automated tests beside the code they cover or in a clearly named `tests/` directory.

Organize the main flows around the home view, lesson planner, and saved plans.

## Build, Test, and Development Commands

After the Next.js scaffold is created, use the package manager and scripts defined in `package.json`.

Typical commands are:

- `pnpm dev` starts the local development server.
- `pnpm lint` checks ESLint rules.
- `pnpm typecheck` runs TypeScript validation when available.
- `pnpm test` runs the automated test suite.
- `pnpm build` creates the production build and catches deployment-time errors.

Run linting, type checking, tests, and a production build before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript with two-space indentation and consistent formatting enforced by the repository tooling.

Use PascalCase for React components and public types, camelCase for local variables and functions, and ALL_CAPS with underscores for JavaScript or TypeScript global constants.

Keep lesson generation deterministic and client-side, with typed data models and explicit validation through React Hook Form and Zod.

Prefer small reusable shadcn/ui-based components over duplicated screen-specific controls.

Use Quicksand and the ClassBloom color tokens defined in `PLAN.md`, and preserve keyboard focus, accessible labels, responsive layouts, and Vietnamese text rendering.

## Testing Guidelines

Add tests for required-field guidance, all three curated examples, custom topics, duration totals, refinement actions, editing, saving, reopening, and printing.

Verify local-storage hydration, absence of unintended network requests, and both desktop and mobile layouts.

Name tests after observable behavior, such as `planner saves and reopens a lesson`.

## Commit & Pull Request Guidelines

No Git history is present yet, so no existing commit convention can be inferred.

Use concise imperative commit subjects, for example `Add lesson plan persistence`.

Pull requests should explain the user-visible change, identify verification commands, link the relevant plan or issue, and include screenshots for UI changes.

## Security & Configuration Tips

Keep the demo fully client-side as specified in `PLAN.md`.

Do not add API routes, model calls, secrets, or external network dependencies without updating the architecture and documenting the change.

