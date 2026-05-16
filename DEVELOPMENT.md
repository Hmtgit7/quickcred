# QuickCred Development Guide

This guide covers local setup, development workflow, project conventions, and troubleshooting for QuickCred.

## Prerequisites

- Node.js 20+
- pnpm 10+
- Git
- MongoDB Atlas or a local MongoDB instance
- Cloudinary account for document uploads

## First-Time Setup

```bash
git clone https://github.com/Hmtgit7/quickcred.git
cd quickcred
pnpm install
```

Create local environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

Recommended local ports:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/api`

Backend environment example:

```env
PORT=8080
NODE_ENV=development
API_PREFIX=api
MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-secret
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=replace-with-another-long-secret
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
CORS_ORIGIN=http://localhost:3000
```

Frontend environment example:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=QuickCred
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Seed local demo accounts:

```bash
pnpm --filter server seed
```

## Running Locally

Run both apps:

```bash
pnpm dev
```

Run individually:

```bash
pnpm --filter client dev
pnpm --filter server start:dev
```

Swagger is available in development at:

```text
http://localhost:8080/api/docs
```

## Workspace Commands

```bash
# Install dependencies
pnpm install

# Build frontend and backend
pnpm build

# Frontend checks
pnpm --filter client lint
pnpm --filter client build

# Backend checks
pnpm --filter server lint
pnpm --filter server build
pnpm --filter server test
pnpm --filter server test:e2e

# Seed data
pnpm --filter server seed
```

## Frontend Architecture

The frontend uses Next.js App Router.

Important directories:

```text
client/app/                 Route groups, pages, layouts, global CSS
client/components/common/   Shared application components
client/components/layout/   Sidebar, topbar, mobile navigation, containers
client/components/ui/       Base UI primitives
client/modules/auth/        Login, register, auth hooks, auth services
client/modules/loans/       Loan data hooks and services
client/modules/payments/    Collection/payment services and hooks
client/modules/analytics/   Admin analytics hooks and services
client/store/               Zustand UI state
client/types/               Shared frontend types and enums
```

Frontend conventions:

- Use feature modules under `client/modules/*` for domain-specific hooks, services, schemas, and components.
- Keep route pages thin; put reusable UI inside `_components` or shared component folders.
- Use TanStack Query for server state and Zustand for local UI state.
- Use `apiClient` from `client/lib/axios/client.ts` for authenticated API calls.
- Use existing UI primitives before adding new styling patterns.
- Keep components focused; split forms, panels, and helpers when they grow large.

## Backend Architecture

The backend uses NestJS with MongoDB/Mongoose.

Important directories:

```text
server/src/common/          Guards, decorators, interceptors, filters, pipes
server/src/config/          App, database, JWT, and Cloudinary config
server/src/database/        MongoDB module and seed script
server/src/modules/auth/    Signup, login, refresh, logout
server/src/modules/users/   Profile, leads, admin user listing
server/src/modules/loans/   Application, sanction, disbursement, audit trail
server/src/modules/payments/ Payment recording and loan payment summaries
server/src/modules/documents/ Cloudinary-backed document uploads
server/src/modules/notifications/ In-app notifications
server/src/modules/analytics/ Admin analytics and chart data
```

Backend conventions:

- All routes are JWT-protected by default through global guards.
- Use `@Public()` only for public endpoints like login, signup, refresh, and health.
- Use `@Roles(...)` for role-specific access.
- DTOs are validated globally with Nest validation pipes.
- Responses are normalized through the global response transform interceptor.
- Errors are normalized through the global exception filter.
- Keep business rules inside services, not controllers.

## Roles

| Role | Primary area |
| --- | --- |
| `admin` | Analytics and full operational visibility |
| `sales` | Leads and pre-loan borrower conversion |
| `sanction` | Applied loan review, approval, rejection |
| `disbursement` | Sanctioned loan fund release |
| `collection` | Disbursed loan repayment tracking |
| `borrower` | Profile, loan application, documents, own loans |

## Loan Lifecycle

```text
pending -> applied -> sanctioned -> disbursed -> closed
                   \-> rejected
```

Typical flow:

1. Borrower completes eligibility profile.
2. Borrower applies for a loan.
3. Sanction team approves or rejects.
4. Disbursement team marks sanctioned loans as disbursed.
5. Collection team records payments.
6. Loan closes when outstanding amount reaches zero.

## Data and API Flow

The frontend calls the backend with:

```text
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

`apiClient` automatically:

- Adds bearer token authorization.
- Sends credentials for refresh-token support.
- Refreshes expired access tokens.
- Redirects to login when the session expires.

## Testing Notes

Backend unit tests:

```bash
pnpm --filter server test
```

Backend e2e tests:

```bash
pnpm --filter server test:e2e
```

Frontend validation:

```bash
pnpm --filter client lint
pnpm --filter client build
```

## Troubleshooting

### Frontend cannot call backend

Check:

- `client/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8080/api`.
- `server/.env` has `CORS_ORIGIN=http://localhost:3000`.
- Backend is running and health endpoint returns OK.

```bash
curl http://localhost:8080/api/health
```

### 401 Unauthorized

Usually caused by an expired or missing token. Sign in again or clear local storage for the app.

### 403 Forbidden

The signed-in role does not have access to that route. Example: `disbursement` cannot access admin analytics endpoints.

### Missing Cloudinary configuration

Document uploads require:

```env
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Render cold start

The hosted API may take a short moment to wake up on free infrastructure. Retry once if the first request is slow.

## Git Workflow

Use Conventional Commit style:

```bash
git commit -m "feat: add borrower loan timeline"
git commit -m "fix: prevent unauthorized analytics request"
git commit -m "docs: refresh deployment guide"
```

Pre-commit hooks are installed through Husky when dependencies are installed.
