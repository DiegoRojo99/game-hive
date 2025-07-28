import { Button } from "@/components/ui/button"
import { Gamepad2, Library, Trophy, Search, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: "/", label: "Home", icon: Gamepad2 },
    { path: "/games", label: "Games", icon: Library },
    { path: "/achievements", label: "Achievements", icon: Trophy },
    { path: "/search", label: "Search", icon: Search },
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

          <Button variant="steam" size="sm" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Login with Steam</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}