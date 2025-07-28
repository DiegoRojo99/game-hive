import { Button } from "@/components/ui/button"
import { GamingCard } from "@/components/ui/gaming-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Trophy, Medal, Star, Clock, Target, Lock, User } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useAllSteamAchievements } from "@/hooks/useSteam"

export default function Achievements() {
  const { isAuthenticated } = useAuth();
  const { data: achievements, isLoading, error } = useAllSteamAchievements();
  const [selectedFilter, setSelectedFilter] = useState("all");

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
  const unlockedAchievements = achievementList.filter(a => a.achieved);
  const totalAchievements = achievementList.length;
  const completionRate = totalAchievements > 0 ? Math.round((unlockedAchievements.length / totalAchievements) * 100) : 0;
  const legendaryCount = achievementList.filter(a => getRarityFromPercentage(a.rarity) === "Legendary").length;

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

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "gaming" : "gaming-ghost"}
              onClick={() => setSelectedFilter(filter.id)}
              className="flex items-center gap-2"
            >
              {filter.label}
              <Badge variant="secondary" className="bg-gaming-card/50 text-xs">
                {filter.count}
              </Badge>
            </Button>
          ))}
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