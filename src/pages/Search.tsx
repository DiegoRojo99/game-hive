import { Button } from "@/components/ui/button"
import { GamingCard } from "@/components/ui/gaming-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search as SearchIcon, Filter, Star, Calendar, Users, ShoppingCart } from "lucide-react"
import { useState } from "react"

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // Mock Steam games data
  const steamGames = [
    {
      id: 1,
      name: "Elden Ring",
      category: "Action RPG",
      price: "$59.99",
      rating: 4.8,
      releaseDate: "2022-02-25",
      players: "Single-player, Online Co-op",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=225&fit=crop",
      tags: ["Dark Fantasy", "Souls-like", "Open World"],
      owned: false
    },
    {
      id: 2,
      name: "Baldur's Gate 3",
      category: "RPG",
      price: "$59.99",
      rating: 4.9,
      releaseDate: "2023-08-03",
      players: "Single-player, Online Co-op",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
      tags: ["D&D", "Turn-based", "Story Rich"],
      owned: true
    },
    {
      id: 3,
      name: "Palworld",
      category: "Survival",
      price: "$29.99",
      rating: 4.3,
      releaseDate: "2024-01-19",
      players: "Single-player, Online Co-op",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=225&fit=crop",
      tags: ["Creatures", "Base Building", "Multiplayer"],
      owned: false
    },
    {
      id: 4,
      name: "Counter-Strike 2",
      category: "FPS",
      price: "Free",
      rating: 4.2,
      releaseDate: "2023-09-27",
      players: "Multiplayer",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      tags: ["Competitive", "Tactical", "Esports"],
      owned: true
    },
    {
      id: 5,
      name: "Hogwarts Legacy",
      category: "Action RPG",
      price: "$49.99",
      rating: 4.6,
      releaseDate: "2023-02-10",
      players: "Single-player",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=225&fit=crop",
      tags: ["Magic", "Open World", "Harry Potter"],
      owned: false
    },
    {
      id: 6,
      name: "Lethal Company",
      category: "Horror",
      price: "$9.99",
      rating: 4.5,
      releaseDate: "2023-10-23",
      players: "Online Co-op",
      image: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?w=400&h=225&fit=crop",
      tags: ["Co-op Horror", "Indie", "Atmospheric"],
      owned: false
    }
  ]

  const categories = [
    { id: "all", label: "All Games" },
    { id: "Action RPG", label: "Action RPG" },
    { id: "RPG", label: "RPG" },
    { id: "FPS", label: "FPS" },
    { id: "Survival", label: "Survival" },
    { id: "Horror", label: "Horror" }
  ]

  const filteredGames = steamGames.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || game.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gradient-hero py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-gaming bg-clip-text text-transparent">
            Discover Games
          </h1>
          <p className="text-foreground/70 text-lg">
            Browse the Steam library and find your next gaming adventure.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-foreground/50 h-6 w-6" />
          <Input
            placeholder="Search games, genres, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 text-lg bg-gaming-card border-gaming-border focus:border-gaming-primary"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "gaming" : "gaming-ghost"}
              onClick={() => setSelectedCategory(category.id)}
              size="sm"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-foreground/60">
            Found {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
          </p>
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
                {game.owned && (
                  <Badge className="absolute top-2 left-2 bg-gaming-accent text-gaming-dark">
                    Owned
                  </Badge>
                )}
                <div className="absolute top-2 right-2 bg-gaming-card/90 backdrop-blur-sm rounded-lg px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-foreground">{game.rating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-gaming-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-foreground/60 text-sm">{game.category}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {game.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gaming-card/50 text-foreground/70">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2 text-sm text-foreground/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Released {new Date(game.releaseDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{game.players}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gaming-border">
                  <div className="text-lg font-bold text-gaming-accent">
                    {game.price}
                  </div>
                  <div className="flex gap-2">
                    {!game.owned && (
                      <Button variant="gaming-outline" size="sm">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
                    )}
                    <Button variant="gaming" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </GamingCard>
          ))}
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 text-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No games found</h3>
            <p className="text-foreground/60">Try different search terms or browse categories above.</p>
          </div>
        )}
      </div>
    </div>
  )
}