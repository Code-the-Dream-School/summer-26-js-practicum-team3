# TodayEatz

A single-user web app for planning a day's meals that add up to your nutrition
targets. You build a daily menu from starter recipes or your own, and a live
widget shows running totals against your calorie and macro goals — one progress
bar per nutrient.

It's for people who track macros or eat intentionally and want their meals to
actually hit their targets, not just browse recipes. One user, no admin — the app
is personal.

> Early planning docs also call it **TodaysEatz** / **NutriPlan**.

## 🚀 Live demo

Frontend, API, and docs are one deployment on Render (free tier — the first
request after idle can take ~30s to wake).

- **App:** https://today-eatz.onrender.com/
- **API base:** https://today-eatz.onrender.com/api/v1
- **Swagger UI:** https://today-eatz.onrender.com/swagger/v1/docs

## 🛠 Tech stack

**Frontend**

- React 19 + React Router 8
- MUI 9 (`@mui/material`), Emotion, CSS Modules
- Vite 8 (dev server + proxy)
- DOMPurify for sanitizing user-authored recipe content

**Backend**

- Node (LTS) + Express 5
- PostgreSQL, hosted on [Neon](https://neon.tech/)
- Prisma 7 (`prisma-client` generator; schema kept in sync by introspection, not Prisma Migrate)
- Auth: JWT in an httpOnly cookie + a CSRF token echoed in the `X-CSRF-TOKEN` header on writes
- Joi (input validation), Helmet, `express-rate-limit`, `cookie-parser`, `morgan`
- Swagger via `swagger-jsdoc` + `swagger-ui-express`

**Tooling**

- npm workspaces (`backend`, `frontend`)
- Vitest + Supertest (backend tests)
- ESLint + Prettier
- Husky git hooks

## ⚙️ Setup & installation

### Prerequisites

- Node LTS (see [`.nvmrc`](./.nvmrc))
- npm 10+
- A PostgreSQL database (the team uses a Neon branch — see [`backend/README.md`](./backend/README.md))

### Steps

```bash
# From the repo root (not backend/ or frontend/)

git clone <repo-url>
cd summer-26-js-practicum-team3

npm ci                 # installs both workspaces + sets up git hooks
npm run init-env       # copies backend/.env.example and frontend/.env.example
npm run db:pull        # introspects the DB schema into backend/prisma/schema.prisma
npm run db:generate    # generates the Prisma client (output is git-ignored, so this is required)
```

### Environment variables

`npm run init-env` creates `backend/.env` and `frontend/.env` from the
`*.env.example` files. Then fill in the real values.

**`backend/.env`**

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string (from the Neon console) |
| `JWT_SECRET` | Long random string. Generate: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `PORT` | Backend port (default `8080`) |

**`frontend/.env`** — defaults work out of the box.

| Variable | Notes |
| --- | --- |
| `VITE_PORT` | Frontend dev port (default `8081`, pinned with `strictPort`) |
| `VITE_TARGET` | Backend address the Vite proxy forwards `/api` to (default `http://localhost:8080`) |
| `VITE_API_ORIGIN` | Origin prefix for API paths. Empty = same-origin (use the proxy). Set a full origin only to bypass the proxy. |

## ▶️ Running it

```bash
npm run dev            # frontend (:8081) + backend (:8080) together

npm run test           # backend Vitest suite (Prisma is mocked — no DB needed)
npm run test:joi       # only the Joi validation tests
npm run test:recipe-api # only the recipe API tests

npm run lint           # ESLint, both workspaces
npm run format         # Prettier, both workspaces
```

**Production build**

```bash
npm run build                     # builds frontend/dist + generates Prisma client
NODE_ENV=production npm start     # Express serves the API and frontend/dist on one port
```

**Git hooks (Husky).** `pre-commit` runs the test suite; `post-merge` regenerates
the Prisma client / runs `npm install` when `schema.prisma` or a `package.json`
changed. See [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📁 Project structure

```text
.
├── backend/
│   ├── prisma/schema.prisma        introspected from Neon (source of truth is the DB)
│   ├── src/
│   │   ├── routes/                  Express routers, one per resource
│   │   ├── controllers/            handlers + @swagger JSDoc blocks
│   │   ├── middleware/             jwt (auth + CSRF), not-found, error-handler
│   │   ├── validations/           Joi schemas
│   │   ├── config/ · errors/ · db.js
│   │   ├── generated/prisma/       Prisma client (git-ignored, created by db:generate)
│   │   └── app.js
│   ├── tests/{unit,integration}/    Vitest + Supertest
│   └── server.js                   DB-connection check + graceful shutdown
│
├── frontend/
│   ├── src/
│   │   ├── features/               auth · dailyMenu · recipes  (api/ components/ context/ utils/)
│   │   ├── components/            shared + onboarding wizard UI
│   │   ├── pages/                 route-level screens
│   │   ├── services/ · utils/     helpers + customHooks/
│   │   ├── App.jsx                routes (public vs. protected)
│   │   └── main.jsx
│   ├── vite.config.js             dev server + /api proxy
│   └── index.html
│
├── .husky/                         pre-commit + post-merge hooks
├── CONTRIBUTING.md
└── package.json                    npm workspaces + shared scripts
```

## 🔐 API overview

- All routes are under `/api/v1`.
- Auth is cookie-based: `POST /auth/register` or `/auth/login` sets an httpOnly
  `jwt` cookie and returns a `csrfToken`. Send that token in the `X-CSRF-TOKEN`
  header on every `POST` / `PATCH` / `DELETE`.
- Interactive docs: [live](https://today-eatz.onrender.com/swagger/v1/docs), or
  `http://localhost:8080/swagger/v1/docs` with the backend running. Generated from
  `@swagger` JSDoc in `backend/src/controllers/*.js`.

```text
Auth
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/logout
  GET    /api/v1/auth/profile                (auth)
  GET    /api/v1/auth/me                     (auth)  → { name, csrfToken }, 401 if invalid

Recipes
  GET    /api/v1/recipes                     search / sort / paginate (public)
  POST   /api/v1/recipes                     (auth)
  PATCH  /api/v1/recipes/:id                 (auth)
  DELETE /api/v1/recipes/:id                 (auth)

Users
  PATCH  /api/v1/users/me                    (auth)
  GET    /api/v1/users/me/onboarding-status  (auth)

Nutrition goals
  GET    /api/v1/nutrition-goals             (auth)
  POST   /api/v1/nutrition-goals             (auth)

Daily menu
  GET    /api/v1/daily-menu                  (auth)
  POST   /api/v1/daily-menu                  (auth)
  DELETE /api/v1/daily-menu/recipes/:id      (auth)
```

## 🤝 Team & workflow

### Team

| Name | Role |
| --- | --- |
| [Olena Khvorostianenko](https://github.com/helen-khvorostianenko) | Full-Stack Software Engineer |
| [Stephen Lewis](https://github.com/WizardOfWhimsical) | Software Engineer |
| [Stephanie Mix](https://github.com/stephcra123) | Full-Stack Developer & Product Marketing Manager |
| [Terri-Ann Walker](https://github.com/terriberri82) | Software Engineer |
| [Xavier Mcallister](https://github.com/XavierCTD) | Software Engineer |

Bios on the app's [About page](https://today-eatz.onrender.com/about).

### Workflow

- Tasks tracked as GitHub Issues (`MEAL-###`).
- Feature branch → Pull Request → one review → squash-merge to `main`.
- Conventional commit prefixes (`feat`, `fix`, `chore`, `docs`, `refactor`).
- Backend endpoints ship with their `@swagger` block and tests.

Full contributor guide: [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## 📄 License

For educational purposes only (Code the Dream practicum).
