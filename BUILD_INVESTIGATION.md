# Build Investigation: npm dev vs npx vite

## Issue Description

You mentioned that when you run `npm run dev` it works, but when you try to publish, it auto-builds with `npx vite`. This indicates a platform/hosting configuration issue, not a project configuration issue.

## Current Project Configuration

### package.json Scripts

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts ...",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### What Each Script Does

1. **`npm run dev`** (Development)
   - Runs `tsx server/index.ts`
   - Starts the Express server directly
   - Does NOT build frontend
   - Server serves files from `client/src` via Vite dev server
   - Hot reload enabled

2. **`npm run build`** (Production Build)
   - Runs `vite build` (builds frontend to `dist/public/`)
   - Runs `esbuild` (bundles server to `dist/index.js`)
   - Creates production-ready assets

3. **`npm run start`** (Production)
   - Runs `node dist/index.js`
   - Requires build to have been run first
   - Serves static assets from `dist/public/`

## The Mystery: Why `npx vite` Runs on Publish

When you try to "publish" your application, the platform (likely Netlify, Vercel, or similar) is detecting your project and running its own build command. Here's what's probably happening:

### Platform Auto-Detection

Most hosting platforms automatically detect:
1. **Vite project** (because `vite.config.ts` exists)
2. **React application** (because of React dependencies)

When detected, they run their **default Vite build command**:
```bash
npx vite build
```

This is **different** from your `npm run build` which does BOTH:
1. Vite build (frontend)
2. ESBuild (backend)

### The Problem

The platform's auto-detected command (`npx vite`) **only builds the frontend**, missing:
- ❌ Backend server bundling
- ❌ Server-side code in `dist/index.js`
- ❌ Custom build configuration

## Solutions

### Solution 1: Override Build Command (Recommended)

Configure your hosting platform to use the correct build command:

**Netlify:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist/public"
```

**Vercel:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public"
}
```

**Render:**
```yaml
# render.yaml
services:
  - type: web
    buildCommand: npm run build
    startCommand: npm run start
```

### Solution 2: Use Pre-Created Platform Configurations

I've created platform-specific configuration files for you:

✅ **`netlify.toml`** - Netlify configuration
✅ **`vercel.json`** - Vercel configuration
✅ **`render.yaml`** - Render configuration

These files tell the platform to use `npm run build` instead of auto-detecting and running `npx vite`.

## How to Fix Your Issue

### Step 1: Identify Your Platform

Which platform are you deploying to?
- Netlify
- Vercel
- Render
- Other

### Step 2: Configure the Platform

#### If using Netlify:
1. The `netlify.toml` file is already created
2. Commit and push to your repository
3. Netlify will automatically use these settings

#### If using Vercel:
1. The `vercel.json` file is already created
2. Commit and push to your repository
3. Vercel will automatically use these settings

#### If using Render:
1. The `render.yaml` file is already created
2. In Render dashboard, ensure "Auto-Deploy" is enabled
3. It will use the configuration from the file

#### If using Another Platform:
Manually configure in the platform's dashboard:
- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Publish Directory:** `dist/public`

### Step 3: Set Environment Variables

In your platform's dashboard, add these environment variables:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM=noreply@fairfence.co.nz
SESSION_SECRET=random_secure_string
NODE_ENV=production
```

## Understanding the Build Process

### Development (`npm run dev`)
```
Start tsx → Run server/index.ts → Express starts
                                  ↓
                            Vite dev server (in-memory)
                                  ↓
                            Serve from client/src/
```

### Production (`npm run build` then `npm run start`)
```
vite build → Build frontend → dist/public/
                                   ↓
esbuild → Bundle server → dist/index.js
                              ↓
npm run start → node dist/index.js → Serve from dist/
```

### What Platform Does (WRONG)
```
npx vite build → Only builds frontend
                      ↓
                 dist/public/ exists
                      ↓
                 dist/index.js MISSING ❌
                      ↓
                 npm run start FAILS ❌
```

## Testing Your Fix

### Local Test
```bash
# 1. Build locally
npm run build

# 2. Check dist folder
ls -la dist/
# Should see: index.js and public/

# 3. Start production server
npm run start

# 4. Test in browser
curl http://localhost:5000/
```

### After Deploying

1. **Check build logs** - Look for:
   - ✅ "npm run build" (not "npx vite")
   - ✅ "vite build" output
   - ✅ "esbuild" output
   - ✅ Both frontend AND backend built

2. **Test the deployed app**:
   - Visit your deployed URL
   - Check `/api/status` endpoint
   - Test `/api/pricing` endpoint
   - Verify frontend loads correctly

## Common Issues and Solutions

### Issue: "Cannot find module 'dist/index.js'"

**Cause:** Platform only ran `vite build`, not full `npm run build`

**Solution:**
- Ensure configuration file exists (`netlify.toml`, `vercel.json`, etc.)
- Check platform dashboard for correct build command
- Verify build logs show both Vite and ESBuild outputs

### Issue: "404 on API routes"

**Cause:** Server not running or routing misconfigured

**Solution:**
- Check `dist/index.js` exists after build
- Verify start command is `npm run start`
- Check server logs for errors

### Issue: "Build succeeds but site is blank"

**Cause:** Frontend built to wrong directory

**Solution:**
- Check `vite.config.ts` `outDir` is `dist/public`
- Verify platform "Publish Directory" is `dist/public`
- Check browser console for errors

## Recommended Deployment Flow

```bash
# 1. Build locally to test
npm run build

# 2. Test production build locally
npm run start

# 3. If works locally, commit config files
git add netlify.toml  # or vercel.json or render.yaml
git commit -m "Add platform deployment configuration"
git push

# 4. Platform auto-deploys using correct build command
# 5. Monitor build logs
# 6. Test deployed application
```

## Summary

**Problem:** Platform auto-detects Vite and runs `npx vite build` which only builds frontend

**Solution:** Add platform configuration file (`netlify.toml`, `vercel.json`, `render.yaml`) to override with `npm run build`

**Result:** Both frontend and backend build correctly, application deploys successfully

---

**Files Created:**
- ✅ `netlify.toml` - Netlify configuration
- ✅ `vercel.json` - Vercel configuration
- ✅ `render.yaml` - Render configuration

**Next Steps:**
1. Commit the appropriate config file for your platform
2. Set environment variables in platform dashboard
3. Deploy and monitor build logs
4. Test deployed application

