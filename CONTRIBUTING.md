# Contributing

How we work on this repo: branching, reviews, tests, docs, database changes, and
frontend conventions. Setup and run instructions live in the root [`README.md`](./README.md).

## Workflow

- Every task is a GitHub Issue (`MEAL-###`).
- Branch off `main`: `MEAL-123-short-description`.
- Open a Pull Request, get one review, then squash-merge to `main`.
  No direct pushes to `main`.
- Commit messages use conventional prefixes: `feat`, `fix`, `chore`, `docs`,
  `refactor`, optionally scoped — e.g. `fix(frontend): keep onboarding reminder in sync`.
- Keep PRs small and focused on one issue.

## Before you push

| Command | What it does |
| --- | --- |
| `npm run lint` | ESLint on both workspaces — must pass |
| `npm run format` | Prettier writes both workspaces |
| `npm run test` | Backend Vitest suite (Prisma is mocked, no DB needed) |

## Git hooks (Husky)

Installed automatically by `npm ci` (via the `prepare` script).

- **pre-commit** runs the full backend test suite; a failing test blocks the commit.
- **post-merge** (`.husky/scripts/check_pull_changes.js`) runs after every `git pull`/merge:
  - `npm run db:generate` when `backend/prisma/schema.prisma` changed
  - `npm install` when a `package.json` changed

  so your local environment stays current without thinking about it.

## Tests

- Add or update tests in the same PR as the code change.
- **Unit tests** (`backend/tests/unit/`) call controllers directly.
- **Integration tests** (`backend/tests/integration/`) go through the full Express
  stack with `supertest` and a mocked Prisma client — they assert routing, JSON
  parsing, and that thrown errors come back as the right HTTP response.
- Focused runs: `npm run test:joi`, `npm run test:recipe-api`.

## API docs (Swagger)

- The spec is generated from `@swagger` JSDoc blocks in
  `backend/src/controllers/*.js` (config in `backend/src/routes/swagger-docs.routes.js`).
- When you add or change an endpoint, update its `@swagger` block **in the same commit**.
- View it with the backend running: `http://localhost:8080/swagger/v1/docs`.

## Database changes

We do **not** use Prisma Migrate. The schema lives in the Neon console and is
pulled into the repo by introspection.

After changing the DB structure in Neon:

1. `npm run db:pull` — introspects the live DB into `backend/prisma/schema.prisma`
2. `npm run db:generate` — regenerates the Prisma client
3. Commit the updated `schema.prisma`

Teammates pick up the change on their next `git pull` (the post-merge hook
regenerates their client). Full details and connection setup: [`backend/README.md`](./backend/README.md).

## Configuration

- Never hardcode URLs or ports. The frontend calls `/api/...` on its own origin;
  in dev Vite proxies that to the backend (`frontend/vite.config.js`), and in
  production Express serves the built frontend from `frontend/dist`.
- The frontend dev port is pinned with `strictPort` because the backend's CORS
  allow-list is pinned to it — a fallback port would just get rejected.
- Secrets live only in `.env` files (git-ignored). When you add a new variable,
  update the matching `*.env.example` in the same PR.

## Frontend conventions

React-specific practices for keeping the frontend maintainable.

### Structure

- Keep components small and focused — one component, one job.
- Group code by feature under `src/features/<feature>/` (`api/`, `components/`,
  `context/`, `utils/`). Cross-feature pieces go in `src/components/`,
  `src/pages/`, `src/utils/`.
- Keep data fetching out of UI-heavy components — put request functions in a
  feature's `api/` module (or `src/services/`) and call them from a hook.

### State

- Derived values are not state. Compute `const total = price * qty` directly;
  don't store it and sync it with `useEffect`.
- `useEffect` is for side effects (fetching, subscriptions, DOM), not for
  computing values from props/state.
- Keep state as low as possible, lift it only as high as necessary. Avoid
  reaching for global state early.

### Effects and fetches

- Clean up every side effect: timers, intervals, listeners, subscriptions.
- Guard against setting state after unmount / on a stale response — abort the
  fetch (`AbortController`) or use an "is current" flag in the cleanup function.
- Don't fire the same request from multiple places; dedupe it in one hook.

### Lists and rendering

- Use stable keys (`key={item.id}`), never the array index.
- Reach for `useMemo` / `useCallback` only when you have a real re-render or
  cost problem — not by default.

## Definition of done

- [ ] `npm run lint` and `npm run test` pass locally
- [ ] `@swagger` block updated for any endpoint change
- [ ] `*.env.example` updated for any new env variable
- [ ] Tests added or updated for the change
- [ ] PR description links the `MEAL-###` issue
