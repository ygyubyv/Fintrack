# FinTrack — Frontend

Single-page application for FinTrack, built with Vue 3, TypeScript and Vite.

## Tech stack

- **Vue 3** (`<script setup>`) + **TypeScript**
- **Vite** with auto-imports (`unplugin-auto-import`) and auto-registered base components (`unplugin-vue-components`)
- **Pinia** for state, **Vue Router** for routing
- **Tailwind CSS 4** for styling
- **VeeValidate** + **Yup** for forms
- **Axios** for HTTP, **Chart.js** / **vue-chartjs** for charts
- **vue3-google-signin** for Google Sign-In
- **Font Awesome** icons, **vue-toast-notification** for toasts

## Pages

| Route           | Page          | Auth required |
| --------------- | ------------- | ------------- |
| `/`             | Landing page  | No            |
| `/auth`         | Login, sign-up, email verification, forgot/reset password | Guests only |
| `/transactions` | Transactions list with filters, create/edit, CSV import/export | Yes |
| `/categories`   | Categories management | Yes   |
| `/tags`         | Tags management       | Yes   |
| `/analytics`    | Charts and statistics | Yes   |

The router guard bootstraps the auth store before each navigation and redirects unauthenticated users to `/auth`.

## Project structure

```
frontend/
├── nginx/                 # Production Nginx config and entrypoints (SSL, certbot)
└── src/
    ├── assets/            # Global styles
    ├── components/base/   # Reusable Base* UI components (auto-registered)
    ├── composables/       # Shared composables (useApi, usePaginatedList, useNotification)
    ├── layouts/           # App layout (header, footer, burger menu)
    ├── pages/             # Route-level components (thin wrappers around views)
    ├── plugins/           # Axios instance, Font Awesome
    ├── router/            # Routes and navigation guards
    ├── stores/            # Pinia stores (auth)
    ├── utils/             # Date, file and shared helpers
    ├── views/             # Feature modules
    │   └── <feature>/
    │       ├── composables/   # Form logic and Yup schemas
    │       ├── services/      # API calls
    │       ├── types/
    │       └── ui/            # Feature components
    ├── config.ts          # Env-based config
    └── main.ts
```

Each feature (`auth`, `transactions`, `categories`, `tags`, `analytics`, `main`) lives in its own folder under `src/views/` and is exposed through an `index.ts`.

## Environment variables

Create `frontend/.env.development` (and `frontend/.env.production`):

```env
VITE_API_URL=http://localhost:3000   # Backend origin
VITE_API_PREFIX=/api/v1              # API path prefix
VITE_AUTH_GOOGLE_CLIENT_ID=          # Google OAuth client ID
```

For production Docker builds these values are passed as build args from the root `.env.production`, since Vite inlines them at build time.

## Running

### With Docker (recommended)

From the repository root:

```sh
npm run dev
```

The app is available at `http://localhost:5173`. See the [root README](../README.md).

### Locally

Requires Node.js `^20.19.0` or `>=22.12.0` and a running backend.

```sh
npm install
npm run dev
```

## Scripts

| Script               | Description                                  |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Start the Vite dev server (exposed on the network) |
| `npm run build`      | Type-check and build for production          |
| `npm run build-only` | Build without type-checking                  |
| `npm run type-check` | Run `vue-tsc`                                |
| `npm run preview`    | Preview the production build locally         |

## Production

[Dockerfile.prod](Dockerfile.prod) builds the app and serves `dist/` with Nginx:

- HTTP (port 80) redirects to HTTPS, except for ACME challenges
- HTTPS (port 443) serves the SPA with history-mode fallback to `index.html`
- `/api/` is proxied to the `backend` container
- On first start a temporary self-signed certificate is generated until Certbot issues a real one; Nginx reloads every 10 minutes to pick up renewed certificates

## Recommended IDE setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar).
