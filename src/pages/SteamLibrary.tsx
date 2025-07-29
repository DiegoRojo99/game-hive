import { Button } from "@/components/ui/button";
import { GamingCard } from "@/components/ui/gaming-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Clock, Trophy, ExternalLink, User, ArrowUpDown, Search } from "lucide-react";
import { useSteamGames } from "@/hooks/useSteam";
import { useAuth } from "@/contexts/AuthContext";
import { SteamAPI } from "@/services/steamApi";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

export default function SteamLibrary() {
  const { isAuthenticated } = useAuth();
  const { data: steamGames, isLoading, error } = useSteamGames();
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchQuery, setSearchQuery] = useState("");

  const formatPlaytime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    if (hours < 1) return `${minutes}m`;
    return `${hours.toFixed(1)}h`;
  };

  const getGameImageUrl = (appId: number, imageHash?: string) => {
    // Use the SteamAPI helper to get the best image for library display
    return SteamAPI.getGameImageUrl(appId, imageHash, 'header');
  };

  // Sort and filter games based on selected criteria and search query
  const sortedGames = useMemo(() => {
    if (!steamGames) return [];

    let games = [...steamGames];
    
    // Filter by search query first
    if (searchQuery.trim()) {
      games = games.filter(game => 
        game.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Then sort the filtered results
    switch (sortBy) {
      case "name-asc":
        return games.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return games.sort((a, b) => b.name.localeCompare(a.name));
      case "playtime-desc":
        return games.sort((a, b) => b.playtime_forever - a.playtime_forever);
      case "playtime-asc":
        return games.sort((a, b) => a.playtime_forever - b.playtime_forever);
      case "recently-played":
        return games.sort((a, b) => {
          // Sort by 2-week playtime first, then total playtime
          const aRecent = a.playtime_2weeks || 0;
          const bRecent = b.playtime_2weeks || 0;
          if (aRecent !== bRecent) return bRecent - aRecent;
          return b.playtime_forever - a.playtime_forever;
        });
      case "never-played":
        return games.sort((a, b) => {
          // Show never played games first, then by name
          const aNeverPlayed = a.playtime_forever === 0 ? 1 : 0;
          const bNeverPlayed = b.playtime_forever === 0 ? 1 : 0;
          if (aNeverPlayed !== bNeverPlayed) return bNeverPlayed - aNeverPlayed;
          return a.name.localeCompare(b.name);
        });
      default:
        return games;
    }
  }, [steamGames, sortBy, searchQuery]);

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

        {/* Sort and Filter Controls */}
        {steamGames && steamGames.length > 0 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/60" />
                <Input
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              {/* Sort */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-foreground/60" />
                <span className="text-sm text-foreground/60">Sort:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="playtime-desc">Most Played</SelectItem>
                    <SelectItem value="playtime-asc">Least Played</SelectItem>
                    <SelectItem value="recently-played">Recently Played</SelectItem>
                    <SelectItem value="never-played">Never Played</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="text-sm text-foreground/60">
              {searchQuery ? `${sortedGames.length} of ${steamGames.length} games` : `${steamGames.length} games total`}
            </div>
          </div>
        )}

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
            sortedGames?.map((game) => (
              <Link key={game.appid} to={`/game/${game.appid}`}>
                <GamingCard className="overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-200">
                  <div className="relative mb-4">
                    <img
                      src={getGameImageUrl(game.appid, game.img_icon_url)}
                      alt={game.name}
                      className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Hide image and show placeholder if header image fails
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-full h-48 bg-gaming-card/50 rounded-lg flex items-center justify-center hidden">
                      <span className="text-foreground/50 text-6xl">🎮</span>
                    </div>
                    <div className="absolute top-2 right-2 space-y-1">
                      {game.playtime_2weeks && game.playtime_2weeks > 0 && (
                        <Badge className="bg-gaming-primary text-white text-xs">
                          Recently Played
                        </Badge>
                      )}
                      {game.playtime_forever > 0 && (
                        <Badge className="bg-gaming-accent text-gaming-dark text-xs">
                          {formatPlaytime(game.playtime_forever)}
                        </Badge>
                      )}
                      {game.playtime_forever === 0 && (
                        <Badge variant="outline" className="text-xs">
                          Never Played
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-gaming-primary transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-foreground/60 text-sm">Steam Game</p>
                      </div>
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
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking the button
                        window.open(`steam://nav/games/details/${game.appid}`, '_blank');
                      }}
                    >
                      View in Steam
                    </Button>
                  </div>
                </GamingCard>
              </Link>
            ))
          )}
        </div>

        {sortedGames?.length === 0 && !isLoading && steamGames && steamGames.length > 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Games Found</h3>
            <p className="text-foreground/60">
              No games match your search criteria "{searchQuery}".
            </p>
            <Button 
              variant="gaming-outline" 
              className="mt-4"
              onClick={() => setSearchQuery("")}
            >
              Clear Search
            </Button>
          </div>
        )}

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
