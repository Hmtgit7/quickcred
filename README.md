# QuickCred

QuickCred is a full-stack loan management platform for borrower onboarding and operations teams. It gives each role a focused workspace for loan intake, sanctioning, disbursement, collection, document handling, notifications, and portfolio analytics.

Live project:

- Frontend: https://quickcred.vercel.app
- Backend API: https://quickcred-api.onrender.com
- Repository: https://github.com/Hmtgit7/quickcred

## Highlights

- Role-based dashboards for Admin, Sales, Sanction, Disbursement, Collection, and Borrower users.
- Borrower signup, profile completion, eligibility validation, and loan application flow.
- End-to-end loan lifecycle: applied, sanctioned, disbursed, closed, or rejected.
- Document upload support for PDF/JPG/PNG files with Cloudinary storage.
- Collection workflow with payment recording, payment history, and outstanding balance tracking.
- Admin analytics for loan counts, disbursement value, repayment rate, status breakdown, and repayment trends.
- JWT authentication with refresh token support and protected role-based API routes.
- Responsive Next.js UI with a polished marketing landing page and app shell.

## Demo Accounts

Seeded accounts are available for local development and portfolio walkthroughs.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@quickcred.com` | `Admin@123` |
| Sales | `sales@quickcred.com` | `Sales@123` |
| Sanction | `sanction@quickcred.com` | `Sanction@123` |
| Disbursement | `disburse@quickcred.com` | `Disburse@123` |
| Collection | `collection@quickcred.com` | `Collect@123` |
| Borrower | `borrower@quickcred.com` | `Borrow@123` |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn-style UI, Radix UI |
| State/Data | Zustand, TanStack Query, Axios, React Hook Form, Zod |
| Backend | NestJS 11, TypeScript, MongoDB, Mongoose |
| Security | JWT, refresh tokens, role guards, Helmet, CORS, validation pipes, rate limiting |
| Storage | Cloudinary for uploaded documents |
| Charts | Recharts |
| Tooling | pnpm workspace, ESLint, Prettier, Husky, Docker |
| Hosting | Vercel frontend, Render backend |

## Repository Structure

```text
quickcred/
  client/                 Next.js frontend
    app/                  App Router pages and layouts
    components/           Shared UI, layout, and reusable components
    modules/              Feature modules: auth, loans, payments, analytics, etc.
    store/                Client UI state
    types/                Shared frontend types
  server/                 NestJS backend API
    src/common/           Guards, decorators, filters, interceptors, constants
    src/config/           Environment and service configuration
    src/database/         MongoDB module and seed script
    src/modules/          Auth, users, loans, documents, payments, notifications, analytics
  docs/                   Project documentation
  Dockerfile              Backend API container for Render
  pnpm-workspace.yaml     Workspace configuration
```

## Local Setup

Prerequisites:

- Node.js 20+
- pnpm 10+
- MongoDB connection string
- Cloudinary account for document uploads

Install dependencies:

```bash
pnpm install
```

Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env.local
```

Fill `server/.env`:

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

Fill `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=QuickCred
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Seed demo users:

```bash
pnpm --filter server seed
```

Run the app locally:

```bash
pnpm dev
```

Common local URLs:

- Frontend: http://localhost:3000
- Backend: http://localhost:8080/api
- Health: http://localhost:8080/api/health
- Swagger in development: http://localhost:8080/api/docs

## Core Workflows

### Borrower

1. Register or sign in as a borrower.
2. Complete profile details: PAN, date of birth, salary, and employment mode.
3. Apply for a loan after eligibility passes.
4. Upload supporting documents.
5. Track loan status and repayment summary.

### Sales

1. Review borrower leads.
2. Track users who have not completed loan conversion.
3. Hand qualified borrowers into the loan pipeline.

### Sanction

1. Review applied loans.
2. Approve or reject with sanctioned amount and terms.
3. Create an audit trail entry for the decision.

### Disbursement

1. Review sanctioned loans.
2. Mark approved loans as disbursed.
3. Add disbursement reference information.

### Collection

1. Review disbursed loans.
2. Record borrower payments.
3. Monitor outstanding balances and close fully repaid loans.

### Admin

1. View analytics and portfolio KPIs.
2. Access all operational queues.
3. Review users, loan status distribution, disbursement trends, and repayment trends.

## Useful Commands

```bash
# Start frontend and backend together
pnpm dev

# Frontend only
pnpm --filter client dev

# Backend only
pnpm --filter server start:dev

# Build all workspaces
pnpm build

# Build frontend
pnpm --filter client build

# Build backend
pnpm --filter server build

# Lint frontend
pnpm --filter client lint

# Lint backend
pnpm --filter server lint

# Backend tests
pnpm --filter server test

# Backend e2e tests
pnpm --filter server test:e2e

# Seed demo users
pnpm --filter server seed
```

## Documentation

- [Development Guide](DEVELOPMENT.md)
- [Deployment Guide](DEPLOYMENT.md)
- [API Reference](docs/API.md)
- [Architecture Notes](docs/ARCHITECTURE.md)

## Production Deployment

The project is deployed as two services:

- Vercel serves the Next.js frontend from `client/`.
- Render runs the NestJS backend using the root Dockerfile.

Production environment values:

```env
# Vercel
NEXT_PUBLIC_API_URL=https://quickcred-api.onrender.com/api
NEXT_PUBLIC_APP_URL=https://quickcred.vercel.app

# Render
NODE_ENV=production
CORS_ORIGIN=https://quickcred.vercel.app
API_PREFIX=api
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for the complete deployment checklist.

## License

This project is maintained as a portfolio project. Reuse or distribution should be approved by the repository owner.
