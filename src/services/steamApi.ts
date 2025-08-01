const STEAM_API_BASE = 'https://api.steampowered.com';
const API_KEY = import.meta.env.VITE_STEAM_API_KEY;

// Since Steam API doesn't support CORS, we'll need to use a proxy
// For now, we'll create the structure and use a fallback
const USE_PROXY = true;
const PROXY_BASE = '/api/steam'; // This would be your backend proxy

export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  img_icon_url: string;
  img_logo_url?: string; // Sometimes provided, but usually empty
  has_community_visible_stats?: boolean;
  playtime_windows_forever?: number;
  playtime_mac_forever?: number;
  playtime_linux_forever?: number;
}

export interface SteamAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
  name?: string;
  description?: string;
}

export interface GameAchievement extends SteamAchievement {
  appid: number;
  gameName: string;
  icon?: string;
  iconGray?: string;
  rarity?: number; // percentage of players who have this achievement
}

export interface SteamPlayerSummary {
  steamid: string;
  communityvisibilitystate: number;
  profilestate: number;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  realname?: string;
  primaryclanid?: string;
  timecreated?: number;
  gameid?: string;
  gameextrainfo?: string;
  cityid?: number;
  loccountrycode?: string;
  locstatecode?: string;
  commentpermission?: number;
  lastlogoff?: number;
}

export class SteamAPI {
  private static async fetchWithProxy(endpoint: string): Promise<any> {
    if (USE_PROXY) {
      // Use your backend proxy with query parameter format
      // Convert /ISteamUser/GetPlayerSummaries/v0002/?steamids=123 
      // to /api/steam?endpoint=ISteamUser/GetPlayerSummaries/v0002&steamids=123
      const [path, queryString] = endpoint.split('?');
      const cleanPath = path.startsWith('/') ? path.substring(1) : path;
      
      let url = `${PROXY_BASE}?endpoint=${encodeURIComponent(cleanPath)}`;
      if (queryString) {
        url += `&${queryString}`;
      }
      
      console.log('Fetching Steam API via proxy:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Steam API error response:', response.status, response.statusText, errorText);
        throw new Error(`Steam API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Steam API response received:', data);
      return data;
    } 
    else {
      // Direct API call (will fail due to CORS in browser)
      const response = await fetch(`${STEAM_API_BASE}${endpoint}&key=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`Steam API request failed: ${response.statusText}`);
      }
      return response.json();
    }
  }

  static async getPlayerSummaries(steamIds: string[]): Promise<SteamPlayerSummary[]> {
    try {
      const endpoint = `/ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamIds.join(',')}`;
      const data = await this.fetchWithProxy(endpoint);
      return data.response?.players || [];
    } catch (error) {
      console.error('Error fetching player summaries:', error);
      
      // Instead of returning mock data, throw the error
      // This will prevent demo user login
      throw new Error('Failed to fetch Steam player data. Please check your Steam API configuration.');
    }
  }

  static async getOwnedGames(steamId: string): Promise<SteamGame[]> {
    try {
      const endpoint = `/IPlayerService/GetOwnedGames/v0001/?steamid=${steamId}&include_appinfo=1&format=json`;
      const data = await this.fetchWithProxy(endpoint);
      return data.response?.games || [];
    } catch (error) {
      console.error('Error fetching owned games:', error);
      
      // Instead of returning mock data, throw the error
      // This will prevent fallback to fake data
      throw new Error('Failed to fetch Steam game library. Please check your Steam API configuration.');
    }
  }

  static async getPlayerAchievements(steamId: string, appId: number): Promise<SteamAchievement[]> {
    try {
      const endpoint = `/ISteamUserStats/GetPlayerAchievements/v0001/?steamid=${steamId}&appid=${appId}`;
      const data = await this.fetchWithProxy(endpoint);
      return data.playerstats?.achievements || [];
    } catch (error) {
      console.error('Error fetching player achievements:', error);
      // Return empty array as fallback
      return [];
    }
  }

  static async getAllPlayerAchievements(steamId: string): Promise<GameAchievement[]> {
    try {
      // First get the user's games
      const games = await this.getOwnedGames(steamId);      
      const allAchievements: GameAchievement[] = [];
      
      // Limit to games with community stats to avoid rate limiting
      const gamesWithStats = games.filter(game => game.has_community_visible_stats).slice(0, 10);
      
      // Process games in batches to avoid overwhelming the API
      for (const game of gamesWithStats) {
        try {
          // Get achievements for this game
          const achievements = await this.getPlayerAchievements(steamId, game.appid);
          
          // Get game schema for achievement details
          const schema = await this.getGameSchema(game.appid);
          const gameAchievements = schema?.game?.availableGameStats?.achievements || [];
          
          // Combine achievement data with game info
          const enhancedAchievements = achievements.map(achievement => {
            const schemaAchievement = gameAchievements.find((a: any) => a.name === achievement.apiname);
            return {
              ...achievement,
              appid: game.appid,
              gameName: game.name,
              name: schemaAchievement?.displayName || achievement.name || achievement.apiname,
              description: schemaAchievement?.description || achievement.description || '',
              icon: schemaAchievement?.icon,
              iconGray: schemaAchievement?.iconGray,
            } as GameAchievement;
          });
          
          allAchievements.push(...enhancedAchievements);
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.error(`Error fetching achievements for ${game.name}:`, error);
          // Continue with other games
        }
      }
      
      return allAchievements;
    } catch (error) {
      console.error('Error fetching all player achievements:', error);
      
      // Instead of returning mock data, throw the error
      // This will prevent fallback to fake data  
      throw new Error('Failed to fetch Steam achievements. Please check your Steam API configuration.');
    }
  }

  static async getGameSchema(appId: number): Promise<any> {
    try {
      const endpoint = `/ISteamUserStats/GetSchemaForGame/v2/?appid=${appId}`;
      const data = await this.fetchWithProxy(endpoint);
      return data.game;
    } catch (error) {
      console.error('Error fetching game schema:', error);
      return null;
    }
  }

  static getGameImageUrl(appId: number, imageHash?: string, size: 'icon' | 'logo' | 'header' = 'header'): string {
    if (!appId) return '';
    
    if (size === 'header') {
      // Use Steam's header image (460x215) - best for library display
      return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
    }
    
    if (imageHash && size === 'icon') {
      // Use the provided icon hash (32x32)
      return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${imageHash}.jpg`;
    }
    
    if (imageHash && size === 'logo') {
      // Use the provided logo hash (varies in size)
      return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${imageHash}.jpg`;
    }
    
    // Fallback to header image
    return `https://cdn.akamai.steamstatic.com/steam/apps/${appId}/header.jpg`;
  }
}
