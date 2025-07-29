export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get API key from environment
    const API_KEY = process.env.VITE_STEAM_API_KEY;
    
    if (!API_KEY) {
      console.error('VITE_STEAM_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Steam API key not configured' });
    }

    // Extract the Steam API endpoint from the request path
    // URL will be like: /api/steam/ISteamUser/GetPlayerSummaries/v0002/?steamids=123456
    const { steam: steamPath, ...params } = req.query;
    
    console.log('Full request details:');
    console.log('- URL:', req.url);
    console.log('- Query:', req.query);
    console.log('- Steam path:', steamPath);
    console.log('- Params:', params);
    
    // Handle the dynamic route parameter
    let endpoint = '';
    if (Array.isArray(steamPath)) {
      endpoint = steamPath.join('/');
    } else if (typeof steamPath === 'string') {
      endpoint = steamPath;
    }
    
    console.log('Extracted endpoint:', endpoint);
    
    if (!endpoint) {
      return res.status(400).json({ 
        error: 'No Steam API endpoint specified',
        debug: {
          url: req.url,
          query: req.query,
          steamPath,
          params
        }
      });
    }

    // Construct the full Steam API URL
    const steamApiUrl = new URL(`https://api.steampowered.com/${endpoint}`);
    
    // Add the API key and any other query parameters
    steamApiUrl.searchParams.set('key', API_KEY);
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        steamApiUrl.searchParams.set(key, value[0]);
      } else if (value) {
        steamApiUrl.searchParams.set(key, String(value));
      }
    });

    console.log('Fetching Steam API:', steamApiUrl.toString());

    const response = await fetch(steamApiUrl.toString());
    
    if (!response.ok) {
      console.error('Steam API error:', response.status, response.statusText);
      const errorText = await response.text();
      return res.status(response.status).json({ 
        error: `Steam API request failed: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error proxying Steam API request:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: error.stack
    });
  }
}
