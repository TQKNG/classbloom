# Repository Guidelines

## Project Structure & Module Organization

ClassBloom has an implemented client-side demo, with the product and implementation plan in `PLAN.md`.

The planned application is a Next.js App Router project with TypeScript and Tailwind CSS.

Keep route-level screens in `app/`, reusable UI in `components/`, client-side lesson and draft logic in `lib/` or `stores/`, and static assets in `public/`.

Place automated tests beside the code they cover or in a clearly named `tests/` directory.

Organize the main flows around the home view, lesson planner, and saved plans.

## Build, Test, and Development Commands

Use the package manager and scripts defined in `package.json`.
The committed pnpm lockfile installs with `pnpm install --frozen-lockfile`.

Typical commands are:

- `pnpm dev` starts the local development server.
- `pnpm lint` checks ESLint rules.
- `pnpm typecheck` runs TypeScript validation when available.
- `pnpm build` creates the production build and catches deployment-time errors.

There is no automated test script yet.
Run linting, type checking, and a production build before submitting changes.

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

No established commit convention is documented for this repository.

Use concise imperative commit subjects, for example `Add lesson plan persistence`.

Pull requests should explain the user-visible change, identify verification commands, link the relevant plan or issue, and include screenshots for UI changes.

## Security & Configuration Tips

Keep the demo fully client-side as specified in `PLAN.md`.

Do not add API routes, model calls, secrets, or external network dependencies without updating the architecture and documenting the change.


## Shared agent instructions

The following rules are a snapshot of the authoring source at ~/.codex/AGENTS.md.
# Khanh's agent instructions

These are common instructions for Khanh's Codex agents across all scenarios.

## General guidelines

- Never use the em dash character. Use a plain hyphen instead.
- When writing commit messages, never add Codex or an agent name as a co-author.
- Never manually modify `CHANGELOG.md` files or files marked as auto-generated.
- When writing or substantially editing long Markdown files, put each full sentence on its own line.
- Preserve normal Markdown structure, but avoid wrapping multiple sentences onto one physical line.
- When making technical decisions, do not give excessive weight to development cost.
- Prefer quality, simplicity, robustness, scalability, and long-term maintainability.
- When fixing bugs, first reproduce the problem in an end-to-end environment that closely matches the user's real workflow.
- Confirm that the fix addresses the root problem and not only its visible symptom.
- During end-to-end testing, inspect the UI carefully and maintain a high standard for visual detail.
- If something clearly looks wrong, fix it when it is safely within the task's scope, even when it is not the direct focus of the request.
- Apply the same standard to engineering quality, including lint errors, test failures, and flaky tests.
- If you notice an issue that is outside the current scope or unsafe to change, report it clearly instead of ignoring it.
- If any user request is vague or lacks necessary context, ask brief, targeted clarifying questions before providing a full solution.
- If user request is related to herdr-app, you must read ~/.config/herdr-app/AGENTS.md and ~/.agents/skills/herdr/SKILL.md

## Khanh's opinions

When work would benefit from Khanh's viewpoints, read `~/OPINIONS.md` before making relevant decisions.

If that file is unavailable, continue with the available project context and state any material assumptions.

## Voice profile

When writing or posting on behalf of Khanh, read `~/VOICE.md` first to understand how Khanh communicates.

If that file is unavailable, use a professional, direct, concise, and natural voice.
