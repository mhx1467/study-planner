import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  const isAuthPage = location.pathname === "/login" || location.pathname === "/register"
  const isLandingPage = location.pathname === "/"

  // Don't show navigation on auth pages
  if (isAuthPage) {
    return null
  }

  // Landing page navigation (unauthenticated)
  if (isLandingPage && !isAuthenticated) {
    return (
      <nav className="border-b border-primary/10 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-primary hover:text-orange-600 transition-colors">
              StudyPlanner
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Funkcje
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Jak to działa
              </a>
              <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Opinie
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link to="/login">
                <Button variant="ghost">Zaloguj się</Button>
              </Link>
              <Link to="/register">
                <Button>Zacznij za darmo</Button>
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5 text-foreground" />
              ) : (
                <Menu className="h-5 w-5 text-foreground" />
              )}
            </button>
          </div>

           {mobileMenuOpen && (
             <div className="md:hidden border-t border-primary/10 py-4 space-y-4">
               <a href="#features" className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                 Funkcje
               </a>
               <a href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                 Jak to działa
               </a>
               <a href="#testimonials" className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2">
                 Opinie
               </a>
               <div className="flex flex-col gap-2 pt-2">
                 <Link to="/login" className="block">
                   <Button variant="outline" className="w-full">
                     Zaloguj się
                   </Button>
                 </Link>
                 <Link to="/register" className="block">
                   <Button className="w-full">Zacznij za darmo</Button>
                 </Link>
               </div>
             </div>
           )}
        </div>
      </nav>
    )
  }

  // Authenticated navigation
  return (
    <nav className="border-b border-primary/20 bg-card shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 font-bold text-lg text-primary hover:text-orange-600 transition-colors">
              StudyPlanner
            </Link>

            <div className="hidden md:flex gap-6">
              <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/subjects" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                Subjects
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/tasks" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                Tasks
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/schedule" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                Schedule
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/statistics" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group">
                Statistics
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{user?.email}</div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="hover:text-primary">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
