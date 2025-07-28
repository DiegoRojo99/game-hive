import { Button } from "@/components/ui/button"
import { GamingCard } from "@/components/ui/gaming-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Star, Clock, Trophy, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function Games() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock game data
  const games = [
    {
      id: 1,
      name: "Cyberpunk 2077",
      genre: "Action RPG",
      playtime: "45.2h",
      achievements: { unlocked: 23, total: 50 },
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      status: "Playing"
    },
    {
      id: 2,
      name: "The Witcher 3",
      genre: "RPG",
      playtime: "120.5h",
      achievements: { unlocked: 45, total: 78 },
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
      status: "Completed"
    },
    {
      id: 3,
      name: "Rocket League",
      genre: "Sports",
      playtime: "89.3h",
      achievements: { unlocked: 67, total: 88 },
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=225&fit=crop",
      status: "Active"
    },
    {
      id: 4,
      name: "Hades",
      genre: "Roguelike",
      playtime: "34.7h",
      achievements: { unlocked: 28, total: 49 },
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1556438064-2d7646166914?w=400&h=225&fit=crop",
      status: "Completed"
    },
    {
      id: 5,
      name: "Among Us",
      genre: "Multiplayer",
      playtime: "12.4h",
      achievements: { unlocked: 15, total: 25 },
      rating: 4.1,
      image: "https://images.unsplash.com/photo-1606116870482-d7b8b77c1c05?w=400&h=225&fit=crop",
      status: "Casual"
    },
    {
      id: 6,
      name: "Stardew Valley",
      genre: "Simulation",
      playtime: "78.9h",
      achievements: { unlocked: 32, total: 40 },
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1617737576460-f4a03e0ef0dc?w=400&h=225&fit=crop",
      status: "Playing"
    }
  ]

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Playing": return "bg-gaming-accent text-gaming-dark"
      case "Completed": return "bg-green-500 text-white"
      case "Active": return "bg-gaming-primary text-white"
      default: return "bg-gaming-card text-gaming-accent border-gaming-accent/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-gaming bg-clip-text text-transparent">
            Your Game Library
          </h1>
          <p className="text-foreground/70 text-lg">
            Track your progress, view achievements, and discover new games to play.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-5 w-5" />
            <Input
              placeholder="Search games by name or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gaming-card border-gaming-border focus:border-gaming-primary"
            />
          </div>
          <Button variant="gaming-outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GamingCard key={game.id} className="overflow-hidden group">
              <div className="relative mb-4">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className={`absolute top-2 right-2 ${getStatusColor(game.status)}`}>
                  {game.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-gaming-primary transition-colors">
                      {game.name}
                    </h3>
                    <p className="text-foreground/60 text-sm">{game.genre}</p>
                  </div>
                  <Button variant="gaming-ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4 text-sm text-foreground/70">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{game.playtime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{game.rating}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-gaming-accent" />
                      <span>Achievements</span>
                    </div>
                    <span className="text-foreground/70">
                      {game.achievements.unlocked}/{game.achievements.total}
                    </span>
                  </div>
                  <div className="w-full bg-gaming-border rounded-full h-2">
                    <div
                      className="bg-gradient-gaming h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(game.achievements.unlocked / game.achievements.total) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <Button variant="gaming" className="w-full mt-4">
                  View Details
                </Button>
              </div>
            </GamingCard>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No games found</h3>
            <p className="text-foreground/60">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}