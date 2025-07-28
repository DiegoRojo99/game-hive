import { Button } from "@/components/ui/button"
import { GamingCard } from "@/components/ui/gaming-card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Star, Clock, Target, Lock } from "lucide-react"
import { useState } from "react"

export default function Achievements() {
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Mock achievement data
  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete the tutorial",
      game: "Cyberpunk 2077",
      points: 10,
      rarity: "Common",
      unlocked: true,
      unlockedDate: "2024-01-15",
      icon: "🎯"
    },
    {
      id: 2,
      name: "Completionist",
      description: "Unlock all achievements in a single game",
      game: "Hades",
      points: 100,
      rarity: "Legendary",
      unlocked: true,
      unlockedDate: "2024-01-20",
      icon: "👑"
    },
    {
      id: 3,
      name: "Speed Demon",
      description: "Complete a race in under 2 minutes",
      game: "Rocket League",
      points: 25,
      rarity: "Rare",
      unlocked: false,
      progress: 85,
      icon: "⚡"
    },
    {
      id: 4,
      name: "Master Collector",
      description: "Collect all rare items",
      game: "The Witcher 3",
      points: 50,
      rarity: "Epic",
      unlocked: true,
      unlockedDate: "2024-01-10",
      icon: "💎"
    },
    {
      id: 5,
      name: "Night Owl",
      description: "Play for 5 consecutive hours",
      game: "Stardew Valley",
      points: 15,
      rarity: "Uncommon",
      unlocked: false,
      progress: 60,
      icon: "🌙"
    },
    {
      id: 6,
      name: "Social Butterfly",
      description: "Play with 10 different friends",
      game: "Among Us",
      points: 30,
      rarity: "Rare",
      unlocked: false,
      progress: 70,
      icon: "🦋"
    }
  ]

  const filters = [
    { id: "all", label: "All Achievements", count: achievements.length },
    { id: "unlocked", label: "Unlocked", count: achievements.filter(a => a.unlocked).length },
    { id: "locked", label: "Locked", count: achievements.filter(a => !a.unlocked).length },
    { id: "rare", label: "Rare+", count: achievements.filter(a => ["Rare", "Epic", "Legendary"].includes(a.rarity)).length }
  ]

  const filteredAchievements = achievements.filter(achievement => {
    switch (selectedFilter) {
      case "unlocked": return achievement.unlocked
      case "locked": return !achievement.unlocked
      case "rare": return ["Rare", "Epic", "Legendary"].includes(achievement.rarity)
      default: return true
    }
  })

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

  const totalPoints = achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)
  const maxPoints = achievements.reduce((sum, a) => sum + a.points, 0)
  const completionRate = Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)

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
            <div className="text-2xl font-bold text-foreground">{totalPoints}</div>
            <div className="text-foreground/60 text-sm">Achievement Points</div>
          </GamingCard>
          
          <GamingCard className="text-center">
            <Medal className="h-8 w-8 text-gaming-primary mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{achievements.filter(a => a.unlocked).length}</div>
            <div className="text-foreground/60 text-sm">Unlocked</div>
          </GamingCard>
          
          <GamingCard className="text-center">
            <Target className="h-8 w-8 text-gaming-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{completionRate}%</div>
            <div className="text-foreground/60 text-sm">Completion Rate</div>
          </GamingCard>
          
          <GamingCard className="text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-foreground">{achievements.filter(a => a.rarity === "Legendary").length}</div>
            <div className="text-foreground/60 text-sm">Legendary</div>
          </GamingCard>
        </div>

        {/* Progress Bar */}
        <GamingCard className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Overall Progress</h2>
            <span className="text-foreground/70">{totalPoints}/{maxPoints} points</span>
          </div>
          <Progress value={(totalPoints / maxPoints) * 100} className="h-3" />
        </GamingCard>

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
          {filteredAchievements.map((achievement) => (
            <GamingCard 
              key={achievement.id} 
              className={`transition-all duration-300 ${achievement.unlocked ? 'border-gaming-primary/30' : 'opacity-75'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-3xl p-3 rounded-lg ${achievement.unlocked ? 'bg-gaming-primary/20' : 'bg-gaming-card/50 grayscale'}`}>
                  {achievement.unlocked ? achievement.icon : <Lock className="h-6 w-6 text-foreground/50" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${achievement.unlocked ? 'text-foreground' : 'text-foreground/60'}`}>
                      {achievement.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gaming-accent">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-medium">{achievement.points}</span>
                    </div>
                  </div>
                  
                  <p className="text-foreground/70 text-sm mb-3">
                    {achievement.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-foreground/60 text-sm">{achievement.game}</span>
                    <Badge className={getRarityColor(achievement.rarity)} variant="secondary">
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  {achievement.unlocked ? (
                    <div className="flex items-center gap-2 text-sm text-gaming-accent">
                      <Clock className="h-4 w-4" />
                      <span>Unlocked {achievement.unlockedDate}</span>
                    </div>
                  ) : achievement.progress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/60">Progress</span>
                        <span className="text-foreground/70">{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress} className="h-2" />
                    </div>
                  )}
                </div>
              </div>
            </GamingCard>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No achievements found</h3>
            <p className="text-foreground/60">Try adjusting your filters to see more achievements.</p>
          </div>
        )}
      </div>
    </div>
  )
}