import { Button } from "@/components/ui/button";
import { GamingCard } from "@/components/ui/gaming-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Trophy, ExternalLink, ArrowLeft, Calendar, Users, Globe } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSteamGames, useAllSteamAchievements } from "@/hooks/useSteam";
import { useAuth } from "@/contexts/AuthContext";
import { SteamAPI } from "@/services/steamApi";
import { useMemo } from "react";

export default function GameDetails() {
  const { appid } = useParams<{ appid: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { data: steamGames, isLoading: gamesLoading } = useSteamGames();

  const game = useMemo(() => {
    if (!steamGames || !appid) return null;
    return steamGames.find(g => g.appid === parseInt(appid));
  }, [steamGames, appid]);

  const { data: allAchievements, isLoading: achievementsLoading } = useAllSteamAchievements();

  const gameAchievements = useMemo(() => {
    if (!allAchievements || !appid) return [];
    return allAchievements.filter(a => a.appid === parseInt(appid));
  }, [allAchievements, appid]);

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes}m`;
    return `${hours.toFixed(1)}h`;
  };

  const getGameImageUrl = (appId: number, imageHash?: string) => {
    return SteamAPI.getGameImageUrl(appId, imageHash, 'header');
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Login Required</h2>
            <p className="text-foreground/60 mb-6">
              Please login with Steam to view game details.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (gamesLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="gaming-ghost" onClick={() => navigate(-1)} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-96 rounded-lg mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <div className="grid md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-8 w-1/2 mb-4" />
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Game Not Found</h2>
            <p className="text-foreground/60 mb-6">
              This game was not found in your Steam library.
            </p>
            <Link to="/steam-library">
              <Button variant="gaming">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Library
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const earnedAchievements = gameAchievements.filter(a => a.achieved === 1);
  const totalAchievements = gameAchievements.length;
  const achievementPercentage = totalAchievements > 0 ? (earnedAchievements.length / totalAchievements) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="gaming-ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Game Header */}
            <GamingCard className="mb-8">
              <div className="relative mb-6">
                <img
                  src={getGameImageUrl(game.appid, game.img_icon_url)}
                  alt={game.name}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="w-full h-96 bg-gaming-card/50 rounded-lg flex items-center justify-center hidden">
                  <span className="text-foreground/50 text-8xl">🎮</span>
                </div>
                
                <div className="absolute top-4 right-4 space-y-2">
                  {game.playtime_2weeks && game.playtime_2weeks > 0 && (
                    <Badge className="bg-gaming-primary text-white">
                      Recently Played
                    </Badge>
                  )}
                  {game.playtime_forever > 0 && (
                    <Badge className="bg-gaming-accent text-gaming-dark">
                      {formatPlaytime(game.playtime_forever)}
                    </Badge>
                  )}
                  {game.playtime_forever === 0 && (
                    <Badge variant="outline">
                      Never Played
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 bg-gradient-gaming bg-clip-text text-transparent">
                    {game.name}
                  </h1>
                  <p className="text-foreground/60">Steam Game • App ID: {game.appid}</p>
                </div>

                <Button 
                  variant="gaming" 
                  className="w-full sm:w-auto"
                  onClick={() => window.open(`steam://nav/games/details/${game.appid}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Steam
                </Button>
              </div>
            </GamingCard>

            {/* Game Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <GamingCard className="text-center">
                <Clock className="h-8 w-8 text-gaming-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-foreground">{formatPlaytime(game.playtime_forever)}</div>
                <div className="text-foreground/60 text-sm">Total Playtime</div>
              </GamingCard>
              
              {game.playtime_2weeks && game.playtime_2weeks > 0 && (
                <GamingCard className="text-center">
                  <Calendar className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{formatPlaytime(game.playtime_2weeks)}</div>
                  <div className="text-foreground/60 text-sm">Last 2 Weeks</div>
                </GamingCard>
              )}
              
              {game.has_community_visible_stats && totalAchievements > 0 && (
                <GamingCard className="text-center">
                  <Trophy className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">
                    {earnedAchievements.length}/{totalAchievements}
                  </div>
                  <div className="text-foreground/60 text-sm">
                    Achievements ({achievementPercentage.toFixed(0)}%)
                  </div>
                </GamingCard>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements Section */}
            {game.has_community_visible_stats && (
              <GamingCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-foreground">Achievements</h3>
                  {totalAchievements > 0 && (
                    <Badge variant="secondary">
                      {earnedAchievements.length}/{totalAchievements}
                    </Badge>
                  )}
                </div>

                {achievementsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-3/4 mb-1" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : totalAchievements > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {gameAchievements.sort((b, a) => a.achieved - b.achieved).slice(0, 10).map((achievement) => (
                      <div key={achievement.apiname} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gaming-card/50 transition-colors mx-auto w-[calc(100%-1rem)]">
                        <div className="relative">
                          {achievement.icon && (
                            <img
                              src={achievement.achieved === 1 ? achievement.icon : achievement.iconGray}
                              alt={achievement.name}
                              className="h-12 w-12 rounded"
                            />
                          )}
                          {achievement.achieved === 1 ? (
                            <div className="absolute -top-1 -right-1 bg-gaming-accent rounded-full p-1">
                              <Trophy className="h-3 w-3 text-gaming-dark" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-foreground/50" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm ${achievement.achieved === 1 ? 'text-foreground' : 'text-foreground/60'}`}>
                            {achievement.name || achievement.apiname}
                          </h4>
                          <p className="text-xs text-foreground/50 truncate">
                            {achievement.description || 'No description available'}
                          </p>
                          {achievement.achieved === 1 && achievement.unlocktime && (
                            <p className="text-xs text-gaming-accent mt-1">
                              Unlocked: {formatDate(achievement.unlocktime)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {gameAchievements.length > 10 && (
                      <div className="text-center pt-4">
                        <Link to={`/achievements?game=${game.appid}`}>
                          <Button variant="gaming-outline" size="sm">
                            View All {gameAchievements.length} Achievements
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Trophy className="h-12 w-12 text-foreground/30 mx-auto mb-2" />
                    <p className="text-foreground/60 text-sm">No achievements available</p>
                  </div>
                )}
              </GamingCard>
            )}

            {/* Quick Actions */}
            <GamingCard>
              <h3 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button 
                  variant="gaming-outline" 
                  className="w-full justify-start mb-3"
                  onClick={() => window.open(`steam://nav/games/details/${game.appid}`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View in Steam
                </Button>
                
                {game.has_community_visible_stats && (
                  <Link to={`/achievements?game=${game.appid}`}>
                    <Button variant="gaming-outline" className="w-full justify-start">
                      <Trophy className="h-4 w-4 mr-2" />
                      View All Achievements
                    </Button>
                  </Link>
                )}
                
                <Button 
                  variant="gaming-outline" 
                  className="w-full justify-start"
                  onClick={() => window.open(`https://store.steampowered.com/app/${game.appid}`, '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Steam Store Page
                </Button>
              </div>
            </GamingCard>
          </div>
        </div>
      </div>
    </div>
  );
}
