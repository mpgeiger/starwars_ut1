import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Rocket, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Rocket className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">StarCrew</span>
            </Link>
            
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className={cn(
                  "text-sm font-medium transition-colors hover:text-blue-400",
                  location.pathname === "/" 
                    ? "text-blue-400" 
                    : "text-slate-300"
                )}
              >
                Home
              </Link>
              <Link
                to="/crew"
                className={cn(
                  "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-400",
                  location.pathname.startsWith("/crew") 
                    ? "text-blue-400" 
                    : "text-slate-300"
                )}
              >
                <Users className="h-4 w-4" />
                <span>Crew Builder</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}