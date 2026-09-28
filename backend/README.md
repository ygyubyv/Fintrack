# FinTrack — Backend

REST API for FinTrack, built with Express 5, TypeScript and Prisma (PostgreSQL).

## Tech stack

- **Express 5** with Helmet, CORS and Morgan
- **Prisma 7** with the `pg` driver adapter
- **Zod** for request validation
- **jsonwebtoken** + **bcryptjs** for auth, **google-auth-library** for Google Sign-In
- **Nodemailer** + **EJS** templates for transactional emails
- **Multer** + **PapaParse** for CSV import/export
- **swagger-jsdoc** for the OpenAPI spec

## Project structure

```
backend/
├── prisma/
│   ├── models/          # One .prisma file per model
│   ├── migrations/
│   └── schema.prisma    # Generator + datasource
├── public/docs-v1.html  # Interactive API docs page
└── src/
    ├── config/          # App, auth and email config (read from env)
    ├── controllers/v1/  # Request handlers
    ├── dto/             # Response DTOs
    ├── errors/          # AppError + Prisma error mapping
    ├── middlewares/     # Auth, validation, error handling
    ├── openapi/v1/      # OpenAPI paths and schemas
    ├── routes/v1/       # Route definitions
    ├── services/        # Business logic and DB access
    ├── validation/      # Zod schemas
    ├── app.ts           # Express app setup
    └── server.ts        # Entry point
```

Requests flow through **routes → middlewares (auth, validation) → controllers → services → Prisma**.

## Environment variables

Create `backend/.env.development` (and `backend/.env.production` for prod):

```env
FRONTEND_URL=http://localhost:5173     # Allowed CORS origin
API_URL=http://localhost:3000
PORT=3000

ACCESS_TOKEN_SECRET=
ID_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
JWT_ISSUER=
JWT_AUDIENCE_API=
JWT_AUDIENCE_CLIENT=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESET_PASSWORD_SECRET=
VERIFY_EMAIL_SECRET=

EMAIL=                                 # SMTP account used to send emails
EMAIL_PASSWORD=                        # SMTP password / app password

DATABASE_URL=postgresql://user:password@localhost:5432/fintrack
```

Token lifetimes are set in [src/config/auth.config.ts](src/config/auth.config.ts): access token — 4 weeks, ID token — 1 hour, refresh token — 1 week, reset-password and email-verification tokens — 10 minutes.

## Running

### With Docker (recommended)

From the repository root:

```sh
npm run dev
```

Migrations are applied automatically when the container starts. See the [root README](../README.md).

### Locally

Requires a running PostgreSQL instance and `DATABASE_URL` pointing to it.

```sh
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

The server starts on `http://localhost:${PORT}`.

## Scripts

| Script          | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the server in watch mode (`tsx`)   |
| `npm run build` | Compile TypeScript to `dist/`            |

Useful Prisma commands:

```sh
npx prisma migrate dev --name <name>   # Create and apply a new migration
npx prisma generate                    # Regenerate the client (src/generated/prisma)
npx prisma studio                      # Browse the database
```

## API

All endpoints are prefixed with `/api/v1`. Everything except `/auth/*` requires an `Authorization: Bearer <access token>` header.

Full documentation:

- Interactive docs — `GET /docs/v1`
- OpenAPI JSON — `GET /openapi/v1.json`

### Auth — `/auth`

| Method | Path               | Description                         |
| ------ | ------------------ | ----------------------------------- |
| POST   | `/signup`          | Register with email and password    |
| POST   | `/login`           | Log in with email and password      |
| POST   | `/google`          | Log in / register with Google       |
| POST   | `/refresh`         | Exchange a refresh token for new tokens |
| POST   | `/logout`          | Revoke a refresh token              |
| POST   | `/verify-email`    | Confirm email with a code           |
| POST   | `/forgot-password` | Send a password reset email         |
| POST   | `/reset-password`  | Set a new password                  |

### Expenses, categories, tags — `/expenses`, `/categories`, `/tags`

Each resource exposes the same set of endpoints:

| Method | Path       | Description                         |
| ------ | ---------- | ----------------------------------- |
| GET    | `/`        | Paginated list with filters/sorting |
| GET    | `/:id`     | Get one item                        |
| POST   | `/`        | Create                              |
| PATCH  | `/:id`     | Update                              |
| DELETE | `/:id`     | Delete                              |
| POST   | `/import`  | Import from a CSV file (`multipart/form-data`, field `file`) |
| POST   | `/export`  | Export to CSV                       |

`GET /expenses` supports `page`, `perPage` (max 100), `description`, `valueFrom`/`valueTo`, `expenseType` (`INCOME`/`EXPENSE`), `paymentType` (`CARD`/`CASH`), `categoryId`, `tagIds`, `createdFromDate`/`createdToDate` and `orderBy*` sort parameters.

### User — `/user`

| Method | Path          | Description             |
| ------ | ------------- | ----------------------- |
| GET    | `/my-account` | Get the current user    |
| PATCH  | `/my-account` | Update the current user |
| DELETE | `/my-account` | Delete the account      |

## Data model

- **User** — profile, optional password (Google-only accounts have none), email verification flag
- **Expense** — `value` (decimal 12,2), `expenseType`, `paymentType`, optional description, optional category, many tags
- **Category** — title, unique per user
- **Tag** — title (unique per user) and color
- **RefreshToken**, **PasswordResetToken**, **EmailVerificationToken** — stored as hashes with expiry
- **LastLogin** — last login time, user agent and IP

Deleting a user cascades to all their data; deleting a category sets it to `null` on related expenses.

## Production build

[Dockerfile.prod](Dockerfile.prod) compiles the app in a builder stage, installs production dependencies only, then runs `prisma migrate deploy` and starts `node dist/src/server.js`.
