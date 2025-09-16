import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Rocket, Users, Target, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Build Your <span className="text-blue-400">Star Wars</span> Crew
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Assemble the perfect team of characters and starships for your next galactic mission. 
            Plan routes, manage resources, and ensure mission success across the galaxy.
          </p>
        </div>
        
        <div className="flex justify-center">
          <Link to="/crew">
            <Button size="lg" className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700">
              <Users className="mr-2 h-5 w-5" />
              Build a Crew
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-white">Character Selection</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300">
              Choose from hundreds of Star Wars characters. Filter by species, homeworld, 
              and film appearances to find the perfect crew members.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Rocket className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-white">Starship Fleet</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300">
              Build your fleet with iconic starships. Consider passenger capacity, 
              cargo space, and hyperdrive ratings for optimal mission planning.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-white">Mission Planning</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300">
              Set mission constraints including budget limits, passenger requirements, 
              and cargo needs. Get real-time feasibility analysis.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-blue-400" />
              <CardTitle className="text-white">Route Optimization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300">
              Calculate optimal routes to your target planet. Factor in hyperdrive 
              capabilities, fuel stops, and travel time estimates.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-white">Save & Share Crews</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-slate-300">
              Save your crew configurations and share them with others. Perfect for 
              planning collaborative missions or comparing different strategies.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Call to Action */}
      <div className="text-center space-y-4 py-12">
        <h2 className="text-2xl font-bold text-white">
          Ready to Explore the Galaxy?
        </h2>
        <p className="text-slate-300 max-w-md mx-auto">
          Start building your crew now and embark on your next Star Wars adventure.
        </p>
        <Link to="/crew">
          <Button size="lg" variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}