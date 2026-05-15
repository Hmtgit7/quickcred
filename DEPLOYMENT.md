# 🚀 Quickcred Deployment Guide

## Overview

Quickcred is a monorepo with **separate deployments**:
- **Frontend**: Next.js on Vercel
- **Backend**: NestJS on Render

This separation provides:
- ✅ Independent scaling
- ✅ No routing conflicts
- ✅ Industry best practices
- ✅ Easy updates

---

## 📋 Prerequisites

1. **GitHub Repository**: https://github.com/Hmtgit7/quickcred
2. **Render Account**: https://render.com (free tier available)
3. **Vercel Account**: https://vercel.com (free tier available)

---

## 🔧 Step 1: Deploy Backend to Render

### Backend Deployment

1. Go to **[render.com/dashboard](https://render.com/dashboard)**
2. Click **"New +"** → **"Web Service"**
3. Select **"Deploy an existing repository"** → Choose `Hmtgit7/quickcred`
4. Configure:
   ```
   Name:                quickcred-api
   Environment:         Docker
   Region:              Singapore (or your preference)
   Branch:              main
   Root Directory:      (leave blank)
   ```
5. Click **"Create Web Service"** (deployment starts)
6. Wait for build to complete (~2-3 minutes)
7. Copy the deployed URL: `https://quickcred-api.onrender.com`

### Set Environment Variables

1. Go to **Settings** tab
2. Scroll to **Environment**
3. Add:
   ```
   CORS_ORIGIN = https://your-frontend-domain.vercel.app
   NODE_ENV = production
   ```
4. Click **"Save"**

### Verify Backend

Test in terminal or browser:
```bash
curl https://quickcred-api.onrender.com/api
# Response: "Hello World!"
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Frontend Deployment

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Find and select `Hmtgit7/quickcred`
5. Configure:
   ```
   Framework:            Next.js
   Root Directory:       client/
   Build Command:        (auto-detected: next build)
   Install Command:      (auto-detected: pnpm install)
   Output Directory:     (auto-detected: .next)
   ```
6. Click **"Deploy"** (deployment starts)
7. Wait for build to complete (~1-2 minutes)
8. Copy the deployed URL: `https://quickcred.vercel.app`

### Set Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add for all environments (Production, Preview, Development):
   ```
   NEXT_PUBLIC_API_URL = https://quickcred-api.onrender.com
   ```
3. Click **"Save"**
4. Trigger redeploy: **Deployments** → Right-click latest → **Redeploy**

### Verify Frontend

Visit `https://quickcred.vercel.app` in browser - should load without errors.

---

## 🔄 Update Environment Variables After Deployment

### On Render (Backend)
```
CORS_ORIGIN = https://quickcred.vercel.app
```

### On Vercel (Frontend)
```
NEXT_PUBLIC_API_URL = https://quickcred-api.onrender.com
```

---

## 🧪 Testing

### Test Backend API
```bash
curl https://quickcred-api.onrender.com/api
# Expected: "Hello World!"
```

### Test Frontend
```bash
# Open in browser
https://quickcred.vercel.app
```

### Test CORS (from browser console)
```javascript
fetch('https://quickcred-api.onrender.com/api')
  .then(r => r.text())
  .then(console.log)
  // Should log: "Hello World!"
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────┐
│  Client (Vercel)                    │
│  https://quickcred.vercel.app       │
│  - Next.js 16 Frontend              │
│  - React 19 Components              │
│  - Turbopack Build System           │
└────────────┬────────────────────────┘
             │
             │ NEXT_PUBLIC_API_URL
             │ fetch('https://quickcred-api...')
             ▼
┌─────────────────────────────────────┐
│  Server (Render)                    │
│  https://quickcred-api.onrender.com │
│  - NestJS 11 REST API               │
│  - Express Under the Hood           │
│  - Global Prefix: /api              │
│  - CORS Enabled                     │
└─────────────────────────────────────┘
```

---

## 🔐 Security Checklist

- [ ] Backend `CORS_ORIGIN` points to Vercel domain
- [ ] Frontend `NEXT_PUBLIC_API_URL` points to Render domain
- [ ] No hardcoded API URLs in code
- [ ] `NODE_ENV=production` on backend
- [ ] Both deployments use HTTPS (enforced by Render/Vercel)

---

## 🐛 Troubleshooting

### "CORS Error" in Browser Console

**Problem**: Frontend cannot fetch from backend
**Solution**:
1. Check backend `CORS_ORIGIN` env var matches frontend URL
2. Verify backend returns `Access-Control-Allow-Origin` header
3. Check firewall/VPN isn't blocking the request

### API Returns 404

**Problem**: Endpoint `/api` returns 404
**Solution**:
1. Verify backend URL is correct in frontend
2. Test directly: `curl https://quickcred-api.onrender.com/api`
3. Check backend logs on Render dashboard

### Frontend Shows Blank Page

**Problem**: Frontend loads but no content
**Solution**:
1. Check browser console for JavaScript errors
2. Check `NEXT_PUBLIC_API_URL` is set correctly
3. Check network tab to see failed requests
4. Verify backend is running: `curl https://quickcred-api.onrender.com/api`

### Render Deploy Fails

**Problem**: Docker build fails on Render
**Solution**:
1. Check build logs on Render dashboard
2. Verify Dockerfile is correct
3. Ensure `pnpm-lock.yaml` is committed to git
4. Try manual redeploy from dashboard

### Vercel Deploy Fails

**Problem**: Build fails on Vercel
**Solution**:
1. Check build logs on Vercel dashboard
2. Verify `client/` directory exists and has `next.config.ts`
3. Ensure all dependencies are in `package.json`
4. Try deploying from CLI: `vercel deploy --prod`

---

## 📈 Monitoring & Logs

### Render Logs
```bash
# In dashboard: Web Service → Logs tab
# Shows: Build logs, Runtime logs, Errors
```

### Vercel Logs
```bash
# In dashboard: Deployments → Latest → Logs
# Shows: Build logs, Function logs, Warnings
```

---

## 🔄 CI/CD Pipeline

### Auto-Deployment Triggers

1. **Render**: Auto-deploys on every `git push` to `main`
2. **Vercel**: Auto-deploys on every `git push` to `main`

### Manual Redeploy

**Render**:
1. Dashboard → Web Service → Deploy tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

**Vercel**:
1. Dashboard → Deployments
2. Right-click latest → **"Redeploy"**

---

## 📞 Support

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **NestJS Docs**: https://docs.nestjs.com
- **Next.js Docs**: https://nextjs.org/docs

---

**Last Updated**: May 15, 2026
