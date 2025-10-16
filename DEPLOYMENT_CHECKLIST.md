# Bolt.new Deployment Checklist

## Environment Variables Required

Before deploying to Bolt.new, ensure ALL of these environment variables are configured in your Bolt environment settings:

### Database (Required)
- [ ] `DATABASE_URL` - PostgreSQL connection string from Supabase
  - Format: `postgresql://user:password@host:port/database?sslmode=require`
  - Get from: Supabase Dashboard > Project Settings > Database > Connection String

### Supabase (Required)
- [ ] `VITE_SUPABASE_URL` - Your Supabase project URL
  - Get from: Supabase Dashboard > Project Settings > API > Project URL
  - Example: `https://your-project-id.supabase.co`

- [ ] `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key (safe for client-side)
  - Get from: Supabase Dashboard > Project Settings > API > anon public key

- [ ] `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-only)
  - Get from: Supabase Dashboard > Project Settings > API > service_role key
  - WARNING: Never expose this in client code!

### Session Security (Required)
- [ ] `SESSION_SECRET` - Random string for session encryption
  - Generate with: `openssl rand -base64 32`
  - Example: `XYZ123abc456def789ghi012jkl345mno678pqr901stu234`

### Email (Required for contact forms)
- [ ] `SENDGRID_API_KEY` - SendGrid API key for email
  - Get from: https://app.sendgrid.com/settings/api_keys
  - Format: `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Server Configuration (Optional but recommended)
- [ ] `NODE_ENV` - Set to `production` for deployment
- [ ] `PORT` - Server port (Bolt may override this automatically)

## Pre-Deployment Steps

1. **Verify all environment variables are set in Bolt**
   - Go to Bolt.new environment settings
   - Add each variable listed above
   - Double-check spelling and values

2. **Confirm Supabase is properly configured**
   - Database tables are created (use migrations)
   - Row Level Security (RLS) policies are active
   - Storage buckets are configured if needed

3. **Test build locally** (optional)
   ```bash
   npm run build
   ```
   - Should complete without errors
   - Check that `dist/index.js` and `dist/public/` are created

4. **Verify asset files**
   - Large images should be in `.boltignore`
   - Consider moving assets to Supabase Storage
   - Remove duplicate files if any exist

## Common Deployment Issues

### Issue: "Internal Bolt Error"
**Causes:**
- Missing environment variables
- Build process failing
- Too many large assets in project
- Context window overflow

**Solutions:**
- ✅ Verify all required environment variables are set
- ✅ Check `.boltignore` file exists and includes large assets
- ✅ Ensure `import.meta.dirname` has been replaced with compatible code
- ✅ Try duplicating the project in Bolt and deploying the copy

### Issue: "Database connection failed"
**Causes:**
- Missing or incorrect `DATABASE_URL`
- Supabase project is paused or deleted
- Network connectivity issues

**Solutions:**
- Verify `DATABASE_URL` in Bolt environment settings
- Check Supabase project is active
- Test connection string in Supabase SQL Editor

### Issue: "Build fails with import.meta errors"
**Status:** ✅ FIXED
- Replaced all `import.meta.dirname` with `__dirname`
- Added esbuild banner for ESM compatibility
- Should now build successfully

### Issue: "Assets not loading"
**Solutions:**
- Verify assets are in `dist/public/assets/` after build
- Check Vite config asset paths
- Ensure `.boltignore` isn't excluding needed files

## Post-Deployment Verification

After deployment succeeds, test these endpoints:

1. **Health Check**
   ```
   GET https://your-deployment-url.bolt.new/health
   ```
   Should return: `{"status": "healthy", ...}`

2. **Homepage**
   ```
   GET https://your-deployment-url.bolt.new/
   ```
   Should load the React application

3. **Admin Login** (if configured)
   ```
   GET https://your-deployment-url.bolt.new/admin/login
   ```
   Should show login page

## Deployment Steps in Bolt.new

1. Click the "Deploy" button in Bolt.new
2. Wait for build process to complete
3. Monitor for any error messages
4. If deployment fails:
   - Check the build logs for specific errors
   - Verify environment variables are set
   - Review this checklist again
   - Try duplicating the project and deploying the copy

## Need Help?

If deployment continues to fail after following this checklist:

1. Check Bolt.new support documentation
2. Review build logs for specific error messages
3. Verify all environment variables are correctly set
4. Ensure your Supabase project is active and accessible
5. Try creating a fresh Bolt.new project and copying files over

## Files Changed to Fix Deployment

The following files were updated to resolve deployment issues:

- `server/vite.ts` - Replaced `import.meta.dirname` with `__dirname`
- `vite.config.ts` - Replaced `import.meta.dirname` with `__dirname`
- `package.json` - Added esbuild banner for ESM compatibility
- `.boltignore` - Created to exclude large assets from Bolt context

These changes ensure compatibility with Bolt.new's deployment system while maintaining full functionality in preview mode.
