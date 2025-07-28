import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { SteamAPI, SteamGame, SteamAchievement } from '@/services/steamApi';

interface SteamPlayerStats {
  steamID: string;
  gameName: string;
  achievements?: SteamAchievement[];
  stats?: any[];
}

export const useSteamGames = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['steamGames', user?.steamid],
    queryFn: async (): Promise<SteamGame[]> => {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }

      return await SteamAPI.getOwnedGames(user.steamid);
    },
    enabled: isAuthenticated && !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSteamAchievements = (appId: number) => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['steamAchievements', user?.steamid, appId],
    queryFn: async (): Promise<SteamAchievement[]> => {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }

      return await SteamAPI.getPlayerAchievements(user.steamid, appId);
    },
    enabled: isAuthenticated && !!user && !!appId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useSteamProfile = () => {
  const { user, isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['steamProfile', user?.steamid],
    queryFn: async () => {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }

      const profiles = await SteamAPI.getPlayerSummaries([user.steamid]);
      return profiles[0] || user;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
