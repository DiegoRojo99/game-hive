import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const API_KEY = process.env.VITE_STEAM_API_KEY;

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: !!API_KEY,
    apiKeyLength: API_KEY ? API_KEY.length : 0,
    query: req.query,
    url: req.url,
    method: req.method
  });
}
