# Vercel Deployment Configuration

## Environment Variables
Make sure these are set in your Vercel dashboard under Settings > Environment Variables:

- `VITE_STEAM_API_KEY`: Your Steam Web API key (e.g., D7DB73B39D930C1A6D67C39CF0D15BE0)

## Debugging Authentication Issues

### Test Endpoints:
1. **Test API Function**: `https://play-hive.vercel.app/api/test`
   - Should return JSON with `hasApiKey: true` and correct `apiKeyLength`
   - If `hasApiKey: false`, the environment variable isn't set properly

2. **Test Steam API**: `https://your-domain.vercel.app/api/steam/ISteamUser/GetPlayerSummaries/v0002/?steamids=76561198037186508`
   - Should return Steam user data
   - If it fails, check the error message in browser console

### Common Issues & Solutions:

1. **"Steam API key not configured"**
   - Environment variable `VITE_STEAM_API_KEY` not set in Vercel
   - Go to Vercel dashboard → Project → Settings → Environment Variables

2. **"Error during authentication callback"**
   - Check browser console for specific error details
   - New error handling provides more specific error types

3. **"Steam API returned mock/invalid data"**
   - Steam API call succeeded but returned generic data
   - Usually indicates API key or network issues

4. **Network/CORS Errors**
   - Serverless function might not be deployed properly
   - Check if `/api/steam/...` endpoints are accessible

### Error Types:
- `api_key_error`: Steam API key configuration problem
- `network_error`: Network connectivity to Steam API
- `steam_api_error`: Steam API returned invalid/mock data  
- `callback_error`: General authentication callback error

## Serverless Function for Steam API
The project includes a Vercel serverless function at `/api/steam/[...steam].js` that:
- Handles Steam API requests server-side to avoid CORS issues
- Automatically adds your Steam API key to requests
- Works in production on Vercel (JavaScript version for better compatibility)
- Added comprehensive logging and error handling

## Files Added/Modified:
1. `vercel.json` - Configures client-side routing
2. `public/_redirects` - Fallback routing configuration  
3. `api/steam/[...steam].js` - Vercel serverless function for Steam API proxy (JavaScript)
4. `api/test.js` - Test endpoint for debugging API key configuration (JavaScript)
5. Enhanced error handling throughout the authentication flow

## Debugging Steps:
1. Test `/api/test` endpoint to verify API key is set
2. Test `/api/steam/...` endpoint directly  
3. Check browser console during Steam login for detailed errors
4. Verify environment variables in Vercel dashboard
5. Check Vercel function logs for server-side errors
