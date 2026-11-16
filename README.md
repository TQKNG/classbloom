# ClassBloom

ClassBloom is a client-side Vietnamese lesson-planning demo for primary-school teachers.
The current Next.js app includes a home view, lesson planner, saved plans, and local browser persistence.
See [PLAN.md](PLAN.md) for the product plan; some planned integrations and tests are not yet implemented.

## Requirements

- Node.js 20.9 or newer.
- pnpm 10, matching the committed `pnpm-lock.yaml`.

## Local development

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`.
The app uses local browser storage, so saved plans remain in that browser.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm build
```

There is currently no automated test script in `package.json`.
The repository also contains an npm lockfile; pnpm is used here because the repository guidance uses pnpm and the committed pnpm lockfile installs with `--frozen-lockfile`.

## Repository layout

| Path | Purpose |
| --- | --- |
| `app/` | Next.js pages, layout, and styling |
| `public/` | Static assets |
| `PLAN.md` | Product and implementation plan |
| `AGENTS.md` | Project and shared agent guidance |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

ClassBloom is licensed under the MIT License. See [LICENSE](LICENSE).
