# QuickCred Deployment Guide

QuickCred is deployed as two independent services:

- Frontend: Next.js on Vercel
- Backend: NestJS API on Render

Production URLs:

- Frontend: https://quickcred.vercel.app
- Backend API: https://quickcred-api.onrender.com
- Health check: https://quickcred-api.onrender.com/api/health

## Deployment Architecture

```text
Browser
  |
  | https://quickcred.vercel.app
  v
Vercel: Next.js frontend
  |
  | NEXT_PUBLIC_API_URL=https://quickcred-api.onrender.com/api
  v
Render: NestJS API
  |
  | MONGODB_URI
  v
MongoDB Atlas

Render API
  |
  | Cloudinary credentials
  v
Cloudinary document storage
```

## Production Environment Variables

### Vercel

Set these in the Vercel project settings for Production, Preview, and Development as needed.

```env
NEXT_PUBLIC_API_URL=https://quickcred-api.onrender.com/api
NEXT_PUBLIC_APP_NAME=QuickCred
NEXT_PUBLIC_APP_URL=https://quickcred.vercel.app
```

### Render

Set these in the Render web service environment.

```env
PORT=3000
NODE_ENV=production
API_PREFIX=api
MONGODB_URI=mongodb+srv://...
JWT_SECRET=replace-with-a-long-production-secret
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=replace-with-another-long-production-secret
JWT_REFRESH_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
CORS_ORIGIN=https://quickcred.vercel.app
```

## Deploy Backend to Render

1. Open Render dashboard.
2. Create a new Web Service.
3. Connect `https://github.com/Hmtgit7/quickcred`.
4. Choose Docker environment.
5. Keep root directory as the repository root.
6. Use the root `Dockerfile`.
7. Add the production environment variables above.
8. Deploy.

Render builds the backend API using:

```text
Dockerfile -> pnpm install -> pnpm --filter server build -> node server/dist/main.js
```

Verify:

```bash
curl https://quickcred-api.onrender.com/api/health
```

Expected response shape:

```json
{
  "status": "success",
  "data": {
    "status": "ok",
    "service": "quickcred-api"
  }
}
```

## Deploy Frontend to Vercel

1. Open Vercel dashboard.
2. Import `https://github.com/Hmtgit7/quickcred`.
3. Set root directory to `client`.
4. Framework preset: Next.js.
5. Add the frontend environment variables.
6. Deploy.

Vercel should detect:

```text
Install command: pnpm install
Build command: next build
Output: .next
```

Verify:

```text
https://quickcred.vercel.app
```

## Post-Deployment Checklist

- Frontend loads at `https://quickcred.vercel.app`.
- Backend health endpoint returns OK.
- Vercel `NEXT_PUBLIC_API_URL` points to `https://quickcred-api.onrender.com/api`.
- Render `CORS_ORIGIN` points to `https://quickcred.vercel.app`.
- MongoDB Atlas allows Render network access.
- Cloudinary credentials are present.
- Login works with seeded demo accounts.
- Borrower can complete profile and apply for a loan.
- Operations roles can access only their allowed queues.
- Admin analytics endpoints are only called by admin users.

## Seeding Production Demo Users

If demo users are needed in a production-like database:

```bash
pnpm --filter server seed
```

Run this only against the intended database. The seed script is idempotent for the seeded email addresses and skips existing users.

## CI and Quality Checks

Run before deploying:

```bash
pnpm install
pnpm --filter client lint
pnpm --filter client build
pnpm --filter server build
pnpm --filter server test
```

Full workspace build:

```bash
pnpm build
```

## Troubleshooting

### Frontend shows API/CORS errors

Check:

- `NEXT_PUBLIC_API_URL` includes `/api`.
- Render `CORS_ORIGIN` exactly matches the Vercel domain.
- Backend is awake and health endpoint responds.

### Backend fails during startup

Render logs will usually point to missing environment variables. Required backend variables include MongoDB, JWT, refresh JWT, Cloudinary, and CORS values.

### Document upload fails

Check:

- Cloudinary credentials are correct.
- File size is 5 MB or lower.
- File type is PDF, JPG, JPEG, or PNG.

### Login works locally but not in production

Check:

- `JWT_SECRET` and `JWT_REFRESH_SECRET` are present and stable.
- Frontend calls the correct production API URL.
- Browser requests include the `Authorization` header after login.

### Render service sleeps

Free Render services may cold start. The first API request can be slow after inactivity.

## Rollback

Vercel:

1. Open Deployments.
2. Select a previous successful deployment.
3. Promote it to production.

Render:

1. Open the web service.
2. Go to Events or Deploys.
3. Redeploy a previous successful commit if available.

## Operations Notes

- Swagger is intentionally development-only.
- Production API documentation is maintained in `docs/API.md`.
- API responses are wrapped by the backend response interceptor.
- Health endpoint is public and safe for uptime checks.
