import { Button } from "@/components/ui/button"
import { GamingCard } from "@/components/ui/gaming-card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Trophy, Search, Users, Calendar, TrendingUp } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Link, useSearchParams } from "react-router-dom"
import { useEffect } from "react"
import { toast } from "sonner"
import { SteamAuth } from "@/utils/steamAuth"
import heroImage from "@/assets/hero-gaming.jpg"

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loginStatus = searchParams.get('login');
    const error = searchParams.get('error');
    
    if (loginStatus === 'success') {
      toast.success('Successfully logged in with Steam!', {
        description: 'You can now access your Steam library and achievements.'
      });
    }
    
    if (error) {
      let errorMessage = 'Authentication failed';
      switch (error) {
        case 'invalid_response':
          errorMessage = 'Invalid Steam authentication response';
          break;
        case 'no_steam_id':
          errorMessage = 'Could not extract Steam ID from response';
          break;
        case 'no_profile':
          errorMessage = 'Could not load Steam profile';
          break;
        case 'callback_error':
          errorMessage = 'Error during authentication callback';
          break;
      }
      
      toast.error('Steam Login Failed', {
        description: errorMessage
      });
    }
  }, [searchParams]);

  const features = [
    {
      icon: Gamepad2,
      title: "Game Library",
      description: "Access your Steam library with detailed stats and insights",
      status: "Available"
    },
    {
      icon: Trophy,
      title: "Achievement Hunting",
      description: "Track your progress across all your games",
      status: "Available"
    },
    {
      icon: Search,
      title: "Game Discovery",
      description: "Find new games based on your preferences",
      status: "Coming Soon"
    },
    {
      icon: Users,
      title: "Co-Op Finder",
      description: "Discover multiplayer games you and friends own",
      status: "Coming Soon"
    },
    {
      icon: Calendar,
      title: "Play Schedules",
      description: "Coordinate gaming sessions with your friends",
      status: "Coming Soon"
    },
    {
      icon: TrendingUp,
      title: "Price Tracker",
      description: "Get notified when wishlist games go on sale",
      status: "Coming Soon"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }}
        />
        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-6">
            <Gamepad2 className="h-16 w-16 text-gaming-accent animate-float" />
          </div>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-gaming bg-clip-text text-transparent">
            PlayHive
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 max-w-3xl mx-auto">
            Your ultimate companion for tracking and enhancing your gaming experience. 
            Leverage the power of Steam API for seamless gaming insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isAuthenticated ? (
              <Link to="/steam-library">
                <Button variant="steam" size="lg" className="text-lg px-8 py-4">
                  View Steam Library
                </Button>
              </Link>
            ) : (
              <Button variant="steam" size="lg" className="text-lg px-8 py-4" onClick={() => SteamAuth.login()}>
                Connect Steam Account
              </Button>
            )}
            <Link to="/games">
              <Button variant="gaming-outline" size="lg" className="text-lg px-8 py-4">
                Explore Features
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="bg-gaming-card text-gaming-accent border-gaming-accent/30">
              🎮 Steam Integration
            </Badge>
            <Badge variant="secondary" className="bg-gaming-card text-gaming-accent border-gaming-accent/30">
              🏆 Achievement Tracking
            </Badge>
            <Badge variant="secondary" className="bg-gaming-card text-gaming-accent border-gaming-accent/30">
              📊 Gaming Analytics
            </Badge>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-gaming bg-clip-text text-transparent">
              Features
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Discover what makes PlayHive the perfect companion for your gaming journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <GamingCard key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-lg bg-gradient-gaming/10 border border-gaming-primary/20 group-hover:bg-gradient-gaming/20 transition-all duration-300">
                      <Icon className="h-8 w-8 text-gaming-primary" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/70 mb-4">
                    {feature.description}
                  </p>
                  <Badge 
                    variant={feature.status === "Available" ? "default" : "secondary"}
                    className={feature.status === "Available" 
                      ? "bg-gaming-accent text-gaming-dark" 
                      : "bg-gaming-card text-gaming-accent border-gaming-accent/30"
                    }
                  >
                    {feature.status}
                  </Badge>
                </GamingCard>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-gradient-secondary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">
            Ready to Level Up Your Gaming?
          </h2>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of gamers who use PlayHive to track achievements, 
            discover new games, and optimize their gaming experience.
          </p>
          {isAuthenticated ? (
            <Link to="/steam-library">
              <Button variant="steam" size="lg" className="text-lg px-8 py-4 animate-glow-pulse">
                Explore Your Library
              </Button>
            </Link>
          ) : (
            <Button variant="steam" size="lg" className="text-lg px-8 py-4 animate-glow-pulse" onClick={() => SteamAuth.login()}>
              Get Started Now
            </Button>
          )}
        </div>
      </section>
    </div>
  )
}