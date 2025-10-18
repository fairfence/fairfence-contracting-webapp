# 🚀 Bolt Cloud Hosting Deployment Guide

## ✅ Your Application is Ready for Bolt Deployment

All Edge Functions are deployed to Supabase and your application builds successfully.

---

## 📋 Pre-Deployment Checklist

- ✅ Edge Functions deployed to Supabase
- ✅ Build verified (`npm run build` successful)
- ✅ Server code bundled (`dist/index.js`)
- ✅ Frontend built (`dist/public/`)

---

## 🎯 Deployment Steps for Bolt Cloud

### 1. Bolt Will Automatically Handle

Bolt cloud hosting will automatically:
- ✅ Detect your Node.js project
- ✅ Install dependencies (`npm install`)
- ✅ Run build command (`npm run build`)
- ✅ Start your server (`npm run start`)

### 2. Environment Variables

Make sure these environment variables are set in Bolt dashboard:

```bash
# Supabase Configuration
SUPABASE_URL=https://ahvshpeekjghncygkzws.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# SendGrid Configuration (used by Edge Functions)
SENDGRID_API_KEY=your_sendgrid_key_here
SENDGRID_FROM=noreply@fairfence.co.nz

# Session Configuration
SESSION_SECRET=your_random_secure_string_here

# Environment
NODE_ENV=production
```

**⚠️ IMPORTANT:** Get these values from your `.env` file - don't share them publicly!

### 3. Bolt Build Configuration

If Bolt asks for build settings, use:

```
Build Command: npm run build
Start Command: npm run start
Node Version: 20.x
Output Directory: dist
```

---

## 🔄 How It Works

### Build Process
```
1. npm install          → Install dependencies
2. npm run build        → Build frontend + backend
   ├─ vite build       → Build React frontend → dist/public/
   └─ esbuild          → Bundle Express server → dist/index.js
3. npm run start        → Start production server
```

### Application Architecture
```
Bolt Cloud
    ├─ Express Server (dist/index.js)
    │   ├─ Serves static files from dist/public/
    │   ├─ API routes (/api/*)
    │   └─ Connects to Edge Functions
    └─ Calls Supabase Edge Functions
        ├─ get-pricing (pricing data)
        ├─ proxy-sendgrid (email sending)
        └─ manage-secrets (secret management)
```

---

## ✅ Verification After Deployment

Once deployed, test these endpoints:

### 1. Health Check
```bash
curl https://your-app.bolt.cloud/api/status
```
Expected: `200 OK`

### 2. Pricing Endpoint
```bash
curl https://your-app.bolt.cloud/api/pricing
```
Expected: JSON with pricing data

### 3. Frontend
Visit: `https://your-app.bolt.cloud/`
Expected: FairFence website loads

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'dist/index.js'"

**Cause:** Build didn't complete successfully

**Fix:**
1. Check Bolt build logs
2. Verify `npm run build` ran successfully
3. Ensure both Vite and ESBuild outputs appear in logs

### Issue: "TypeError: fetch failed" in logs

**Cause:** Environment variables not set correctly

**Fix:**
1. Check all environment variables are set in Bolt dashboard
2. Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY` are correct
3. Restart the deployment after adding variables

### Issue: "404 on /api/pricing"

**Cause:** Server routing issue or Edge Functions not accessible

**Fix:**
1. Check Edge Functions are deployed: Go to Supabase Dashboard → Edge Functions
2. Verify `SUPABASE_URL` environment variable is correct
3. Check server logs for specific error messages

---

## 📊 Expected Performance

### Cold Start
- First request: ~2-3 seconds (server initialization)
- Subsequent requests: <100ms

### Edge Functions
- Pricing fetch: ~200-500ms
- Email sending: ~500-1000ms
- With retry + fallback: Near 100% uptime

### Caching
- Pricing data: Cached 5 minutes (server) + 30 minutes (CDN)
- Static assets: Cached 1 year

---

## 🔒 Security Notes

### API Keys
- ✅ SendGrid key stored in Supabase Vault (accessed by Edge Functions only)
- ✅ Service role key only used server-side (never exposed to client)
- ✅ Anon key is safe for client-side use (RLS protects data)

### Secrets Management
All sensitive configuration is:
1. Stored in Bolt environment variables (encrypted)
2. Never committed to git (`.env` is in `.gitignore`)
3. Edge Function secrets managed by Supabase Vault

---

## 📈 Monitoring

### Check Edge Function Logs

```bash
# In Supabase Dashboard
Go to: Edge Functions → [function-name] → Logs

# Or use Supabase CLI
supabase functions logs get-pricing
supabase functions logs proxy-sendgrid
```

### Check Application Logs

In Bolt dashboard:
- View real-time logs
- Check for errors
- Monitor API response times

---

## 🎉 Deployment Checklist

Before clicking "Deploy" in Bolt:

- [ ] All environment variables set in Bolt dashboard
- [ ] Edge Functions deployed to Supabase (already done ✅)
- [ ] Build tested locally (`npm run build` succeeds)
- [ ] `.env` file values copied to Bolt (don't commit `.env`!)

After deployment:

- [ ] Test `/api/status` endpoint
- [ ] Test `/api/pricing` endpoint
- [ ] Test contact form submission
- [ ] Verify frontend loads correctly
- [ ] Check Edge Function logs for errors

---

## 🆘 Getting Help

If you encounter issues:

1. **Check Bolt build logs** - Look for build errors
2. **Check Bolt runtime logs** - Look for server errors
3. **Check Supabase Edge Function logs** - Look for function errors
4. **Verify environment variables** - Make sure all are set correctly

---

## 📁 What Gets Deployed

```
dist/
├── index.js              # Express server (83.1 KB)
└── public/              # Static frontend files
    ├── index.html       # Main HTML
    └── assets/
        ├── *.css        # Stylesheets (98 KB)
        ├── *.js         # JavaScript bundles (835 KB)
        └── images/      # Images and assets
```

---

## ✅ Summary

Your application is **ready for Bolt cloud deployment**:

- ✅ All code changes complete
- ✅ Edge Functions deployed
- ✅ Build verified
- ✅ Documentation complete

**Just click "Publish" in Bolt and set your environment variables!** 🚀

---

**Deployment Date:** Ready Now
**Build Status:** ✅ SUCCESS
**Edge Functions:** ✅ DEPLOYED
**Ready for Production:** ✅ YES
