# Supabase Edge Functions Documentation

This document provides comprehensive instructions for deploying and managing the Supabase Edge Functions used in the FairFence Contracting application.

## Overview

The application uses three Edge Functions to handle critical operations:

1. **get-pricing** - Retrieves pricing data from the database
2. **manage-secrets** - Securely manages API secrets and credentials
3. **proxy-sendgrid** - Proxies email sending through SendGrid API

## Architecture Benefits

By using Edge Functions, we achieve:
- **Improved Reliability**: Edge Functions run on the same infrastructure as Supabase, eliminating network fetch failures
- **Enhanced Security**: API keys are stored securely in Supabase environment, not in application code
- **Better Performance**: Edge caching and reduced latency from co-location with database
- **Scalability**: Automatic scaling without server management
- **Centralized Logic**: All data access and external API calls handled consistently

## Prerequisites

Before deploying Edge Functions, ensure you have:

1. **Supabase CLI** installed:
   ```bash
   npm install -g supabase
   ```

2. **Supabase Project** with:
   - Project URL (SUPABASE_URL)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
   - Anon Key (SUPABASE_ANON_KEY)

3. **SendGrid Account** with:
   - API Key (SENDGRID_API_KEY)
   - Verified sender email (SENDGRID_FROM)

## Deployment Steps

### 1. Login to Supabase CLI

```bash
supabase login
```

This will open a browser window to authenticate with Supabase.

### 2. Link Your Project

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

Replace `YOUR_PROJECT_REF` with your Supabase project reference ID (found in your project settings).

### 3. Set Environment Secrets

Edge Functions need access to environment variables. Set them using:

```bash
# SendGrid API Key (required for email functionality)
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here

# SendGrid sender email
supabase secrets set SENDGRID_FROM=noreply@fairfence.co.nz
```

Note: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are automatically available to Edge Functions.

### 4. Deploy Edge Functions

Deploy all Edge Functions at once:

```bash
# Deploy get-pricing function
supabase functions deploy get-pricing

# Deploy manage-secrets function
supabase functions deploy manage-secrets

# Deploy proxy-sendgrid function
supabase functions deploy proxy-sendgrid
```

Or deploy all functions with a single command:

```bash
supabase functions deploy
```

### 5. Verify Deployment

Check that functions are deployed successfully:

```bash
supabase functions list
```

You should see all three functions listed with their deployment status.

## Testing Edge Functions

### Test get-pricing Function

```bash
curl -i --location --request GET 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/get-pricing' \
  --header 'Authorization: Bearer YOUR_ANON_KEY'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "pricing": { ... },
    "source": "database",
    "timestamp": "2025-10-18T00:00:00.000Z"
  }
}
```

### Test proxy-sendgrid Function

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/proxy-sendgrid' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "type": "contact-form",
    "data": {
      "clientname": "Test User",
      "email": "test@example.com",
      "phonenumber": "021234567",
      "serviceparts": "Timber Fence"
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

### Test manage-secrets Function

```bash
curl -i --location --request POST 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/manage-secrets' \
  --header 'Authorization: Bearer YOUR_JWT_TOKEN' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "action": "list"
  }'
```

Expected response:
```json
{
  "success": true,
  "secrets": [
    { "name": "SENDGRID_API_KEY", "exists": true },
    { "name": "SENDGRID_FROM", "exists": true }
  ]
}
```

## Monitoring and Logs

### View Function Logs

To view logs for a specific function:

```bash
supabase functions logs get-pricing
supabase functions logs manage-secrets
supabase functions logs proxy-sendgrid
```

### Follow Logs in Real-Time

```bash
supabase functions logs get-pricing --follow
```

## Updating Edge Functions

To update a function after making code changes:

1. Make your changes to the function code in `supabase/functions/[function-name]/index.ts`
2. Deploy the updated function:
   ```bash
   supabase functions deploy [function-name]
   ```

## Environment-Specific Configuration

### Development Environment

For local development, you can run Edge Functions locally:

```bash
supabase functions serve get-pricing --env-file .env.local
```

### Production Environment

For production, always deploy using the CLI as documented above. The production functions will use the secrets set via `supabase secrets set`.

## Troubleshooting

### Function Returns 404

- Verify the function is deployed: `supabase functions list`
- Check the function URL is correct
- Ensure you're using the correct project reference

### Function Returns 401 Unauthorized

- Verify you're including the Authorization header
- Check that your API key is correct
- For manage-secrets, ensure you're using a valid user JWT token

### Email Not Sending

- Verify SENDGRID_API_KEY is set: `supabase secrets list`
- Check SendGrid dashboard for sender verification
- Review function logs: `supabase functions logs proxy-sendgrid`

### Database Connection Issues

- Verify SUPABASE_SERVICE_ROLE_KEY is available (it's automatic)
- Check database is accessible
- Review pricing table exists and has data

## Security Considerations

1. **Never expose Service Role Key** - It's automatically available to Edge Functions, don't include it in client code
2. **Validate all inputs** - Edge Functions validate request data before processing
3. **Use CORS headers** - All functions implement proper CORS to prevent unauthorized access
4. **Rotate secrets regularly** - Update API keys periodically using `supabase secrets set`
5. **Monitor logs** - Regularly review function logs for suspicious activity

## Cost Considerations

Supabase Edge Functions pricing (as of 2024):
- First 500K requests per month: Free
- Additional requests: $2 per million
- No additional costs for execution time within limits

For the FairFence application with moderate traffic:
- **get-pricing**: ~1-5 requests per page load = ~10-50K requests/month
- **proxy-sendgrid**: ~10-100 requests/month (form submissions)
- **manage-secrets**: ~1-10 requests/month (admin operations)

**Total estimated cost**: $0/month (well within free tier)

## Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Deno Runtime Documentation](https://deno.land/manual)
- [SendGrid API Documentation](https://docs.sendgrid.com/api-reference)

## Support

For issues or questions:
1. Check function logs first
2. Review this documentation
3. Consult Supabase documentation
4. Contact development team

---

Last Updated: 2025-10-18
