import { Button } from "@/components/ui/button";
import { GamingCard } from "@/components/ui/gaming-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Trophy, ExternalLink, User } from "lucide-react";
import { useSteamGames } from "@/hooks/useSteam";
import { useAuth } from "@/contexts/AuthContext";
import { SteamAPI } from "@/services/steamApi";

export default function SteamLibrary() {
  const { isAuthenticated } = useAuth();
  const { data: steamGames, isLoading, error } = useSteamGames();

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes}m`;
    return `${hours.toFixed(1)}h`;
  };

  const getGameImageUrl = (appId: number, imageHash: string) => {
    return SteamAPI.getGameImageUrl(appId, imageHash, 'icon');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Login Required</h2>
            <p className="text-foreground/60 mb-6">
              Please login with Steam to view your game library.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Games</h2>
            <p className="text-foreground/60">
              There was an error loading your Steam library. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-gaming bg-clip-text text-transparent">
            Steam Library
          </h1>
          <p className="text-foreground/70 text-lg">
            Your Steam games collection with playtime and achievement stats.
          </p>
        </div>

        {/* Stats Overview */}
        {steamGames && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GamingCard className="text-center">
              <div className="text-2xl font-bold text-foreground">{steamGames.length}</div>
              <div className="text-foreground/60 text-sm">Games Owned</div>
            </GamingCard>
            
            <GamingCard className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {formatPlaytime(steamGames.reduce((total, game) => total + game.playtime_forever, 0))}
              </div>
              <div className="text-foreground/60 text-sm">Total Playtime</div>
            </GamingCard>
            
            <GamingCard className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {steamGames.filter(game => game.playtime_forever > 0).length}
              </div>
              <div className="text-foreground/60 text-sm">Games Played</div>
            </GamingCard>
          </div>
        )}

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <GamingCard key={index} className="overflow-hidden">
                <Skeleton className="w-full h-48 rounded-lg mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </GamingCard>
            ))
          ) : (
            steamGames?.map((game) => (
              <GamingCard key={game.appid} className="overflow-hidden group">
                <div className="relative mb-4">
                  {game.img_logo_url ? (
                    <img
                      src={getGameImageUrl(game.appid, game.img_logo_url)}
                      alt={game.name}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-48 bg-gaming-card/50 rounded-lg flex items-center justify-center ${game.img_logo_url ? 'hidden' : ''}`}>
                    <span className="text-foreground/50 text-6xl">🎮</span>
                  </div>
                  {game.playtime_forever > 0 && (
                    <Badge className="absolute top-2 right-2 bg-gaming-accent text-gaming-dark">
                      Played
                    </Badge>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-gaming-primary transition-colors">
                        {game.name}
                      </h3>
                      <p className="text-foreground/60 text-sm">Steam Game</p>
                    </div>
                    <Button 
                      variant="gaming-ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => window.open(`steam://nav/games/details/${game.appid}`, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-foreground/70">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatPlaytime(game.playtime_forever)}</span>
                    </div>
                    {game.has_community_visible_stats && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-gaming-accent" />
                        <span>Achievements</span>
                      </div>
                    )}
                  </div>

                  <Button 
                    variant="gaming" 
                    className="w-full mt-4"
                    onClick={() => window.open(`steam://nav/games/details/${game.appid}`, '_blank')}
                  >
                    View in Steam
                  </Button>
                </div>
              </GamingCard>
            ))
          )}
        </div>

        {steamGames?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Games Found</h3>
            <p className="text-foreground/60">
              Your Steam library appears to be empty or private.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
