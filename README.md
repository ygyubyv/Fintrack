# FinTrack

A full-stack personal finance tracker. Record income and expenses, organize them with categories and color-coded tags, import/export data as CSV, and explore your spending on an analytics dashboard.

## Features

- **Authentication** — email/password sign-up with email verification (OTP), password reset, Google Sign-In, JWT access/refresh tokens
- **Transactions** — income and expenses with card/cash payment type, category, multiple tags and description
- **Filtering & sorting** — by value range, date range, type, payment type, category, tags and description; paginated lists
- **Categories & tags** — per-user, unique titles, custom tag colors
- **CSV import / export** — for transactions, categories and tags
- **Analytics** — charts by category, tag, expense type, payment type and over time
- **API docs** — OpenAPI 3 spec with an interactive docs page

## Tech stack

| Layer    | Technologies                                                                 |
| -------- | ---------------------------------------------------------------------------- |
| Frontend | Vue 3, TypeScript, Vite, Pinia, Vue Router, Tailwind CSS, VeeValidate + Yup, Chart.js |
| Backend  | Node.js, Express 5, TypeScript, Prisma 7, Zod, JWT, Nodemailer, Multer, PapaParse |
| Database | PostgreSQL 15                                                                |
| Infra    | Docker Compose, Nginx, Let's Encrypt (Certbot)                               |
| Tooling  | ESLint, Husky, lint-staged, Commitlint                                       |

## Repository structure

```
fintrack/
├── backend/                 # REST API (Express + Prisma) — see backend/README.md
├── frontend/                # SPA (Vue 3 + Vite) + Nginx config — see frontend/README.md
├── docker-compose.dev.yml   # Dev stack: frontend, backend, postgres (with hot reload)
├── docker-compose.prod.yml  # Prod stack: nginx + SPA, backend, postgres, certbot
├── commitlint.config.js
└── package.json             # Root scripts, git hooks
```

## Getting started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2.22+ (for `--watch`)
- Node.js 20.19+ or 22.12+ (for git hooks and running services outside Docker)

### 1. Install root dependencies

```sh
npm install
```

This also installs the Husky git hooks.

### 2. Configure environment variables

Environment files are git-ignored, so create them yourself:

| File                           | Purpose                                            |
| ------------------------------ | -------------------------------------------------- |
| `.env.development`             | Docker Compose variables for the dev stack         |
| `.env.production`              | Docker Compose variables for the prod stack        |
| `backend/.env.development`     | Backend runtime config (dev)                       |
| `backend/.env.production`      | Backend runtime config (prod)                      |
| `frontend/.env.development`    | Frontend Vite config (dev)                         |
| `frontend/.env.production`     | Frontend Vite config (prod)                        |

Root `.env.development`:

```env
FRONTEND_PORT=5173
BACKEND_PORT=3000
DB_PORT=5432
DB=fintrack
DB_USER=postgres
DB_PASSWORD=postgres
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/fintrack
```

Root `.env.production`:

```env
VITE_API_URL=https://your-domain.com
VITE_API_PREFIX=/api/v1
VITE_AUTH_GOOGLE_CLIENT_ID=

DB=fintrack
DB_USER=postgres
DB_PASSWORD=
DATABASE_URL=postgresql://postgres:<password>@postgres:5432/fintrack

APP_DOMAIN=your-domain.com
CERTBOT_EMAIL=you@example.com
```

See [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for the service-level variables.

### 3. Run in development

```sh
npm run dev
```

This builds and starts all services with Docker Compose watch mode — source changes are synced into containers, and changes to `package.json` trigger a rebuild. Database migrations are applied automatically on backend start.

| Service       | URL                               |
| ------------- | --------------------------------- |
| Frontend      | http://localhost:5173             |
| Backend API   | http://localhost:3000/api/v1      |
| API docs      | http://localhost:3000/docs/v1     |
| Prisma Studio | http://localhost:5555 (after `npm run dev:prisma`) |

Stop the stack:

```sh
npm run dev:stop
```

### 4. Run in production

```sh
npm run prod
```

The production stack:

- builds the SPA and serves it with **Nginx** on ports 80/443;
- proxies `/api/*` to the backend container (the backend is not exposed publicly);
- keeps PostgreSQL on an internal network only reachable by the backend;
- issues and renews a **Let's Encrypt** certificate for `APP_DOMAIN` via Certbot (a temporary self-signed certificate is used until the real one is issued; Nginx reloads every 10 minutes to pick up renewals).

Stop it with `npm run prod:stop`.

## Root scripts

| Script               | Description                                    |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start the dev stack with watch mode            |
| `npm run dev:stop`   | Stop the dev stack                             |
| `npm run dev:prisma` | Launch Prisma Studio inside the backend container |
| `npm run prod`       | Build and start the production stack           |
| `npm run prod:stop`  | Stop the production stack                      |

## Contributing

- **Pre-commit:** `lint-staged` runs `eslint --fix` on staged files in `frontend/` and `backend/`.
- **Commit messages** follow [Conventional Commits](https://www.conventionalcommits.org/) and are checked by Commitlint. Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`. The subject must be in sentence case:

  ```
  feat: Add CSV export for tags
  ```
