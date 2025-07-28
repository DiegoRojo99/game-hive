import { Button } from "@/components/ui/button"
import { Gamepad2, Library, Trophy } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { SteamAuth } from "@/components/auth/SteamAuth"

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Home", icon: Gamepad2 },
    { path: "/steam-library", label: "Steam Library", icon: Library },
    { path: "/achievements", label: "Achievements", icon: Trophy },
  ]

  return (
    <nav className="bg-gaming-card/80 backdrop-blur-sm border-b border-gaming-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-gaming-primary" />
            <span className="text-2xl font-bold bg-gradient-gaming bg-clip-text text-transparent">
              PlayHive
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "gaming" : "gaming-ghost"}
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          <SteamAuth />
        </div>
      </div>
    </nav>
  )
}