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
  img_logo_url: string;
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
      // Use your backend proxy
      const url = `${PROXY_BASE}${endpoint}`;
      console.log('Fetching Steam API via proxy:', url);
      
      const response = await fetch(url);
      console.log('Steam API response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Steam API error response:', errorText);
        throw new Error(`Steam API request failed: ${response.statusText}`);
      }
      return response.json();
    } else {
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
      console.log('Fetching player summaries for Steam IDs:', steamIds);
      const endpoint = `/ISteamUser/GetPlayerSummaries/v0002/?steamids=${steamIds.join(',')}`;
      const data = await this.fetchWithProxy(endpoint);
      console.log('Steam API response data:', data);
      return data.response?.players || [];
    } catch (error) {
      console.error('Error fetching player summaries:', error);
      console.log('Falling back to mock data for Steam IDs:', steamIds);
      
      // Return mock data as fallback
      return steamIds.map(steamId => ({
        steamid: steamId,
        communityvisibilitystate: 3,
        profilestate: 1,
        personaname: 'Steam User',
        profileurl: `https://steamcommunity.com/profiles/${steamId}/`,
        avatar: 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e.jpg',
        avatarmedium: 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_medium.jpg',
        avatarfull: 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4972be27ef9e82e517e_full.jpg',
        personastate: 1,
        lastlogoff: Date.now() / 1000,
        commentpermission: 1,
      }));
    }
  }

  static async getOwnedGames(steamId: string): Promise<SteamGame[]> {
    try {
      const endpoint = `/IPlayerService/GetOwnedGames/v0001/?steamid=${steamId}&include_appinfo=1&format=json`;
      const data = await this.fetchWithProxy(endpoint);
      return data.response?.games || [];
    } catch (error) {
      console.error('Error fetching owned games:', error);
      // Return mock data as fallback
      return [
        {
          appid: 1091500,
          name: "Cyberpunk 2077",
          playtime_forever: 2712,
          img_icon_url: "cyberpunk_icon",
          img_logo_url: "cyberpunk_logo",
          has_community_visible_stats: true
        },
        {
          appid: 292030,
          name: "The Witcher 3: Wild Hunt",
          playtime_forever: 7230,
          img_icon_url: "witcher3_icon",
          img_logo_url: "witcher3_logo",
          has_community_visible_stats: true
        },
        {
          appid: 252950,
          name: "Rocket League",
          playtime_forever: 5358,
          img_icon_url: "rocket_league_icon",
          img_logo_url: "rocket_league_logo",
          has_community_visible_stats: true
        }
      ];
    }
  }

  static async getPlayerAchievements(steamId: string, appId: number): Promise<SteamAchievement[]> {
    try {
      const endpoint = `/ISteamUserStats/GetPlayerAchievements/v0001/?steamid=${steamId}&appid=${appId}`;
      const data = await this.fetchWithProxy(endpoint);
      return data.playerstats?.achievements || [];
    } catch (error) {
      console.error('Error fetching player achievements:', error);
      // Return mock data as fallback
      return [
        {
          apiname: "FIRST_STEPS",
          achieved: 1,
          unlocktime: 1640995200,
          name: "First Steps",
          description: "Complete the prologue"
        }
      ];
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

  static getGameImageUrl(appId: number, imageHash: string, size: 'icon' | 'logo' = 'icon'): string {
    if (!imageHash) return '';
    return `https://media.steampowered.com/steamcommunity/public/images/apps/${appId}/${imageHash}.jpg`;
  }
}
