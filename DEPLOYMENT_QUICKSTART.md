# Edge Functions Deployment - Quick Start Guide

This is a quick reference for deploying the Supabase Edge Functions. For detailed documentation, see `supabase/EDGE_FUNCTIONS_README.md`.

## Quick Deploy (5 minutes)

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login and Link

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 3. Set Secrets

```bash
supabase secrets set SENDGRID_API_KEY=your_key_here
supabase secrets set SENDGRID_FROM=noreply@fairfence.co.nz
```

### 4. Deploy Functions

```bash
supabase functions deploy
```

That's it! Your Edge Functions are now live.

## Test Deployment

```bash
# Test pricing function
curl 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/get-pricing' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

## View Logs

```bash
supabase functions logs get-pricing --follow
```

## Update Function

After making code changes:

```bash
supabase functions deploy [function-name]
```

## What Was Implemented

### Edge Functions Created
1. **get-pricing** - Fetches pricing data from Supabase with retry logic and fallback
2. **proxy-sendgrid** - Securely sends emails using SendGrid API (contact forms, surveys)
3. **manage-secrets** - Manages API secrets (admin only)

### Server Changes
- Updated `/api/pricing` route to use `get-pricing` Edge Function
- Migrated email service to use `proxy-sendgrid` Edge Function
- Added `edgeFunctionClient.ts` with exponential backoff retry logic
- Removed direct Supabase client calls from server for pricing data

### Benefits
- **Fixes pricing fetch errors** - No more "TypeError: fetch failed" issues
- **Centralizes API secrets** - SendGrid key stored securely in Supabase
- **Improves reliability** - Retry logic with exponential backoff
- **Enhances performance** - Edge caching reduces database load
- **Better security** - API keys never exposed in application code

### Migration Path
1. Deploy Edge Functions (this guide)
2. Set environment secrets
3. Test Edge Functions work
4. Deploy updated application code
5. Monitor logs for successful migration

## Important Notes

- Edge Functions run on Supabase infrastructure (not your server)
- They have direct access to your database with minimal latency
- SUPABASE_URL and keys are automatically available
- Edge Functions scale automatically based on load
- First 500K requests/month are free

## Rollback Plan

If Edge Functions have issues:

1. Set `USE_EDGE_FUNCTION = false` in `server/email.ts`
2. Revert pricing route changes in `server/routes.ts`
3. Add back direct Supabase calls
4. Redeploy application

## Quick Commands Reference

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy get-pricing

# List deployed functions
supabase functions list

# View logs
supabase functions logs get-pricing

# List secrets
supabase secrets list

# Set secret
supabase secrets set KEY_NAME=value

# Delete function
supabase functions delete function-name
```

---

For detailed documentation, troubleshooting, and advanced configuration, see `supabase/EDGE_FUNCTIONS_README.md`.
