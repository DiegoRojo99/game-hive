import { Button } from "@/components/ui/button"
import { GamingCard } from "@/components/ui/gaming-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, Medal, Star, Clock, Target, Lock, User, Gamepad2 } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAllSteamAchievements } from "@/hooks/useSteam"

export default function Achievements() {
  const { isAuthenticated } = useAuth();
  const { data: achievements, isLoading, error } = useAllSteamAchievements();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedGame, setSelectedGame] = useState("all");

  const formatUnlockDate = (unlocktime: number) => {
    if (!unlocktime) return '';
    return new Date(unlocktime * 1000).toLocaleDateString();
  };

  const getRarityFromPercentage = (rarity?: number) => {
    if (!rarity) return "Common";
    if (rarity >= 50) return "Common";
    if (rarity >= 25) return "Uncommon";
    if (rarity >= 10) return "Rare";
    if (rarity >= 5) return "Epic";
    return "Legendary";
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-hero py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <User className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Login Required</h2>
            <p className="text-foreground/60 mb-6">
              Please login with Steam to view your achievements.
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Error Loading Achievements</h2>
            <p className="text-foreground/60">
              There was an error loading your Steam achievements. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const achievementList = achievements || [];
  
  // Extract unique games for the filter dropdown
  const uniqueGames = Array.from(
    new Map(
      achievementList.map(a => [a.appid, { appid: a.appid, gameName: a.gameName }])
    ).values()
  ).sort((a, b) => a.gameName.localeCompare(b.gameName));
  
  const filters = [
    { id: "all", label: "All Achievements", count: achievementList.length },
    { id: "unlocked", label: "Unlocked", count: achievementList.filter(a => a.achieved).length },
    { id: "locked", label: "Locked", count: achievementList.filter(a => !a.achieved).length },
    { id: "rare", label: "Rare+", count: achievementList.filter(a => {
      const rarity = getRarityFromPercentage(a.rarity);
      return ["Rare", "Epic", "Legendary"].includes(rarity);
    }).length }
  ];

  const filteredAchievements = achievementList.filter(achievement => {
    const rarity = getRarityFromPercentage(achievement.rarity);
    
    // Filter by game first
    const gameMatches = selectedGame === "all" || achievement.appid.toString() === selectedGame;
    if (!gameMatches) return false;
    
    // Then filter by achievement status/rarity
    switch (selectedFilter) {
      case "unlocked": return achievement.achieved
      case "locked": return !achievement.achieved
      case "rare": return ["Rare", "Epic", "Legendary"].includes(rarity)
      default: return true
    }
  });

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common": return "bg-gray-500 text-white"
      case "Uncommon": return "bg-green-500 text-white"
      case "Rare": return "bg-blue-500 text-white"
      case "Epic": return "bg-purple-500 text-white"
      case "Legendary": return "bg-yellow-500 text-black"
      default: return "bg-gaming-card text-gaming-accent border-gaming-accent/30"
    }
  }

  // Calculate stats - treat each achievement as having 1 "point" since Steam doesn't provide point values
  // If a game is selected, calculate stats for that game only
  const relevantAchievements = selectedGame === "all" 
    ? achievementList 
    : achievementList.filter(a => a.appid.toString() === selectedGame);
    
  const unlockedAchievements = relevantAchievements.filter(a => a.achieved);
  const totalAchievements = relevantAchievements.length;
  const completionRate = totalAchievements > 0 ? Math.round((unlockedAchievements.length / totalAchievements) * 100) : 0;
  const legendaryCount = relevantAchievements.filter(a => getRarityFromPercentage(a.rarity) === "Legendary").length;

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-gaming bg-clip-text text-transparent">
            Achievement Hunter
          </h1>
          <p className="text-foreground/70 text-lg">
            Track your gaming accomplishments and unlock new challenges.
          </p>
          {selectedGame !== "all" && (
            <div className="mt-2 flex items-center gap-2">
              <Gamepad2 className="h-4 w-4 text-gaming-primary" />
              <span className="text-foreground/60">
                Viewing achievements for: <span className="text-gaming-primary font-medium">
                  {uniqueGames.find(g => g.appid.toString() === selectedGame)?.gameName || "Unknown Game"}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <GamingCard className="text-center">
            <Trophy className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{unlockedAchievements.length}</div>
            <div className="text-foreground/60 text-sm">Unlocked Achievements</div>
          </GamingCard>
          
          <GamingCard className="text-center">
            <Medal className="h-8 w-8 text-gaming-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{totalAchievements}</div>
            <div className="text-foreground/60 text-sm">Total Available</div>
          </GamingCard>
          
          <GamingCard className="text-center">
            <Target className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
            <div className="text-foreground/60 text-sm">Completion Rate</div>
          </GamingCard>
          
          <GamingCard className="text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{legendaryCount}</div>
            <div className="text-foreground/60 text-sm">Legendary</div>
          </GamingCard>
        </div>

        {/* Progress Bar */}
        {totalAchievements > 0 && (
          <GamingCard className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">Overall Progress</h2>
              <span className="text-foreground/70">{unlockedAchievements.length}/{totalAchievements} achievements</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </GamingCard>
        )}

        {/* Game Filter and Filters */}
        <div className="space-y-4 mb-8">
          {/* Game Filter Dropdown */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-gaming-primary" />
              <span className="text-foreground font-medium">Filter by Game:</span>
            </div>
            <Select value={selectedGame} onValueChange={setSelectedGame}>
              <SelectTrigger className="w-64 bg-gaming-card border-gaming-border">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent className="bg-gaming-card border-gaming-border">
                <SelectItem value="all" className="text-foreground hover:bg-gaming-border">
                  All Games ({uniqueGames.length} games)
                </SelectItem>
                {uniqueGames.map((game) => {
                  const gameAchievements = achievementList.filter(a => a.appid === game.appid);
                  const unlockedCount = gameAchievements.filter(a => a.achieved).length;
                  return (
                    <SelectItem 
                      key={game.appid} 
                      value={game.appid.toString()}
                      className="text-foreground hover:bg-gaming-border"
                    >
                      {game.gameName} ({unlockedCount}/{gameAchievements.length})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Achievement Status Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
              // Recalculate filter counts based on selected game
              const gameFilteredAchievements = selectedGame === "all" 
                ? achievementList 
                : achievementList.filter(a => a.appid.toString() === selectedGame);
              
              let count = 0;
              switch (filter.id) {
                case "all":
                  count = gameFilteredAchievements.length;
                  break;
                case "unlocked":
                  count = gameFilteredAchievements.filter(a => a.achieved).length;
                  break;
                case "locked":
                  count = gameFilteredAchievements.filter(a => !a.achieved).length;
                  break;
                case "rare":
                  count = gameFilteredAchievements.filter(a => {
                    const rarity = getRarityFromPercentage(a.rarity);
                    return ["Rare", "Epic", "Legendary"].includes(rarity);
                  }).length;
                  break;
              }
              
              return (
                <Button
                  key={filter.id}
                  variant={selectedFilter === filter.id ? "gaming" : "gaming-ghost"}
                  onClick={() => setSelectedFilter(filter.id)}
                  className="flex items-center gap-2"
                >
                  {filter.label}
                  <Badge variant="secondary" className="bg-gaming-card/50 text-xs">
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <GamingCard key={index} className="overflow-hidden">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              </GamingCard>
            ))
          ) : (
            filteredAchievements.map((achievement, index) => {
              const rarity = getRarityFromPercentage(achievement.rarity);
              return (
                <GamingCard 
                  key={`${achievement.appid}-${achievement.apiname}-${index}`}
                  className={`transition-all duration-300 ${achievement.achieved ? 'border-gaming-primary/30' : 'opacity-75'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${achievement.achieved ? 'bg-gaming-primary/20' : 'bg-gaming-card/50 grayscale'}`}>
                      {achievement.achieved && achievement.icon ? (
                        <img 
                          src={achievement.icon} 
                          alt={achievement.name || achievement.apiname}
                          className="w-8 h-8"
                          onError={(e) => {
                            // Fallback to trophy icon if image fails
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : achievement.iconGray ? (
                        <img 
                          src={achievement.iconGray} 
                          alt={achievement.name || achievement.apiname}
                          className="w-8 h-8 grayscale"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`${(achievement.achieved && achievement.icon) || achievement.iconGray ? 'hidden' : ''}`}>
                        {achievement.achieved ? (
                          <Trophy className="h-6 w-6 text-gaming-accent" />
                        ) : (
                          <Lock className="h-6 w-6 text-foreground/50" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold text-sm ${achievement.achieved ? 'text-foreground' : 'text-foreground/60'}`}>
                          {achievement.name || achievement.apiname}
                        </h3>
                      </div>
                      
                      <p className="text-foreground/70 text-xs mb-3 line-clamp-2">
                        {achievement.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-foreground/60 text-xs truncate">{achievement.gameName}</span>
                        <Badge className={getRarityColor(rarity)} variant="secondary">
                          {rarity}
                        </Badge>
                      </div>
                      
                      {achievement.achieved && achievement.unlocktime > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gaming-accent">
                          <Clock className="h-3 w-3" />
                          <span>Unlocked {formatUnlockDate(achievement.unlocktime)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </GamingCard>
              );
            })
          )}
        </div>

        {filteredAchievements.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {totalAchievements === 0 ? 'No achievements found' : 'No achievements match your filter'}
            </h3>
            <p className="text-foreground/60">
              {totalAchievements === 0 
                ? 'Your Steam games may not have community achievements, or your profile may be private.' 
                : 'Try adjusting your filters to see more achievements.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}