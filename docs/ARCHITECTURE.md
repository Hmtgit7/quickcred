# QuickCred Architecture

QuickCred is organized as a pnpm monorepo with a Next.js frontend and NestJS backend. The two applications are deployed independently and communicate over a REST API.

## System Overview

```text
User browser
  |
  v
Next.js frontend (Vercel)
  |
  v
NestJS REST API (Render)
  |
  +-- MongoDB Atlas for application data
  +-- Cloudinary for uploaded documents
```

## Frontend

The frontend lives in `client/` and uses Next.js App Router.

Key responsibilities:

- Marketing landing page.
- Authentication pages.
- Role-aware dashboard shell.
- Borrower loan application journey.
- Operations queues for sales, sanction, disbursement, and collection.
- Admin analytics with charts and KPIs.
- Profile, notifications, and document upload UX.

Important patterns:

- `client/app` contains route-level pages/layouts.
- `client/modules/*` contains domain services, hooks, schemas, and local components.
- `client/components/ui` contains base UI primitives.
- `client/lib/axios/client.ts` centralizes API calls, auth headers, and token refresh.
- TanStack Query handles server state, caching, and loading/error states.
- Zustand stores UI/auth state that must survive navigation.

## Backend

The backend lives in `server/` and uses NestJS.

Key responsibilities:

- Authentication and token lifecycle.
- Role-based authorization.
- Borrower eligibility profile validation.
- Loan application, sanction, disbursement, and collection workflows.
- Document uploads to Cloudinary.
- Notification generation and read state.
- Admin analytics aggregation.

Global backend layers:

- `JwtAuthGuard`: protects routes by default.
- `RolesGuard`: enforces `@Roles(...)`.
- `ThrottlerGuard`: rate limits requests.
- `ValidationPipe`: validates DTOs and strips unknown fields.
- `GlobalExceptionFilter`: normalizes errors.
- `ResponseTransformInterceptor`: wraps successful responses.

## Data Model Summary

Primary collections:

- Users
- Loans
- Payments
- Documents
- Notifications
- Audit logs

The loan entity is the central domain object. Payments, documents, notifications, and audit records attach to or reference loan lifecycle events.

## Role Model

```text
Admin
  - Full operational visibility
  - Analytics
  - Access to all major queues

Borrower
  - Profile completion
  - Loan applications
  - Own documents and loans

Sales
  - Lead visibility
  - Borrower conversion workflow

Sanction
  - Applied loan review
  - Approval or rejection

Disbursement
  - Sanctioned loan release
  - Disbursement references

Collection
  - Disbursed loan payment collection
  - Outstanding tracking
```

## Loan Lifecycle

```text
Borrower profile completed
  |
  v
Loan applied
  |
  v
Sanction review
  |-- rejected
  |
  v
Sanctioned
  |
  v
Disbursed
  |
  v
Payments recorded
  |
  v
Closed when fully paid
```

## Authentication Flow

1. User signs in through `/auth/login`.
2. Backend returns access and refresh tokens.
3. Frontend stores tokens in the auth store.
4. Axios attaches the access token to protected requests.
5. On 401, Axios attempts token refresh.
6. If refresh fails, auth state is cleared and the user is sent to login.

## Authorization Flow

1. Request enters NestJS.
2. Global JWT guard validates authentication unless route is `@Public()`.
3. Roles guard checks route-level `@Roles(...)`.
4. Service-level ownership checks protect borrower-owned data.

Examples:

- Borrower can only view own loans.
- Disbursement cannot call admin analytics.
- Collection can record payments but cannot sanction loans.

## Deployment Boundaries

Frontend:

- Hosted on Vercel.
- Reads `NEXT_PUBLIC_API_URL`.
- No server-side database access.

Backend:

- Hosted on Render.
- Connects to MongoDB and Cloudinary.
- Exposes `/api/*` endpoints.
- Allows CORS only from configured frontend origin.

## Security Notes

- Strong JWT secrets are required in production.
- Environment variables are validated at backend startup.
- Unknown request properties are stripped or rejected by DTO validation.
- File uploads are restricted by type and size.
- Swagger is available only outside production.
- Rate limiting is enabled globally.

## Extending the System

When adding a new feature:

1. Add backend DTOs, service logic, controller route, and role annotations.
2. Add frontend service methods under the relevant module.
3. Add TanStack Query hooks for reads/mutations.
4. Add UI under route `_components` or shared components.
5. Update docs/API.md if the API surface changes.
6. Run lint/build/test commands before merging.
