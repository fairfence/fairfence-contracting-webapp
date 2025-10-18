# 🚀 Quick Deploy Guide - Bolt Cloud Hosting

## ✅ Status: Ready to Deploy

All Edge Functions are deployed and the build is verified. Your application is ready for Bolt cloud hosting.

---

## 1️⃣ Set Environment Variables in Bolt

In your Bolt dashboard, add these environment variables:

```bash
SUPABASE_URL=https://ahvshpeekjghncygkzws.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SENDGRID_API_KEY=SG.VLw1s8-9SVGWPaHF-l-CGg...
SENDGRID_FROM=noreply@fairfence.co.nz
SESSION_SECRET=your-random-secure-string-here
NODE_ENV=production
```

**⚠️ Get these values from your `.env` file**

---

## 2️⃣ Click "Publish" in Bolt

Bolt will automatically:
1. ✅ Install dependencies (`npm install`)
2. ✅ Build your application (`npm run build`)
3. ✅ Start the server (`npm run start`)

---

## 3️⃣ Verify Deployment

After deployment, test these URLs:

```bash
# Health check
https://your-app.bolt.cloud/api/status

# Pricing endpoint (should use Edge Function)
https://your-app.bolt.cloud/api/pricing

# Frontend
https://your-app.bolt.cloud/
```

---

## 🎉 That's It!

Your application will:
- ✅ Fetch pricing data reliably (no more errors)
- ✅ Send emails securely through Edge Functions
- ✅ Build correctly with both frontend and backend
- ✅ Scale automatically

---

## 📚 Need More Info?

See **`BOLT_DEPLOYMENT.md`** for complete deployment documentation.

---

**Status:** ✅ READY TO DEPLOY
**Build:** ✅ VERIFIED
**Edge Functions:** ✅ DEPLOYED
**Platform:** Bolt Cloud Hosting
