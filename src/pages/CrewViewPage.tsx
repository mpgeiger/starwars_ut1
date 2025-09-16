import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Users, Rocket, Target } from 'lucide-react'
import { Crew } from '@/types'
import { formatCredits } from '@/lib/utils'

export default function CrewViewPage() {
  const { id } = useParams<{ id: string }>()
  const [crew, setCrew] = useState<Crew | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCrew = async () => {
      if (!id) return

      try {
        const response = await fetch(`/api/crews/${id}`)
        if (!response.ok) {
          throw new Error('Crew not found')
        }
        const crewData = await response.json()
        setCrew(crewData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load crew')
      } finally {
        setLoading(false)
      }
    }

    fetchCrew()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-white">Loading crew...</div>
      </div>
    )
  }

  if (error || !crew) {
    return (
      <div className="text-center space-y-4">
        <div className="text-red-400 text-lg">
          {error || 'Crew not found'}
        </div>
        <Link to="/crew">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Crew Builder
          </Button>
        </Link>
      </div>
    )
  }

  const totalCost = crew.starships.reduce((sum, ship) => {
    const cost = typeof ship.cost_in_credits === 'number' ? ship.cost_in_credits : 0
    return sum + cost
  }, 0)

  const totalPassengers = crew.starships.reduce((sum, ship) => {
    const passengers = typeof ship.passengers === 'number' ? ship.passengers : 0
    return sum + passengers
  }, 0)

  const totalCargo = crew.starships.reduce((sum, ship) => {
    const cargo = typeof ship.cargo_capacity === 'number' ? ship.cargo_capacity : 0
    return sum + cargo
  }, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{crew.name}</h1>
          <p className="text-slate-300">
            Created {new Date(crew.created_at).toLocaleDateString()}
          </p>
        </div>
        <Link to="/crew">
          <Button variant="outline" className="border-slate-600 text-slate-300">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Builder
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white text-lg">Mission Target</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {crew.target_planet_id ? `Planet ${crew.target_planet_id}` : 'Not Set'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Crew Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Characters:</span>
                <span className="text-white font-semibold">{crew.people.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Starships:</span>
                <span className="text-white font-semibold">{crew.starships.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg">Total Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {formatCredits(totalCost)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Constraints */}
      {Object.keys(crew.constraints).length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Mission Constraints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {crew.constraints.budget && (
                <div>
                  <div className="text-sm text-slate-400">Max Budget</div>
                  <div className="text-white font-semibold">
                    {formatCredits(crew.constraints.budget)}
                  </div>
                </div>
              )}
              {crew.constraints.minPassengers && (
                <div>
                  <div className="text-sm text-slate-400">Min Passengers</div>
                  <div className="text-white font-semibold">
                    {crew.constraints.minPassengers}
                  </div>
                </div>
              )}
              {crew.constraints.cargoKg && (
                <div>
                  <div className="text-sm text-slate-400">Min Cargo</div>
                  <div className="text-white font-semibold">
                    {crew.constraints.cargoKg.toLocaleString()} kg
                  </div>
                </div>
              )}
              {crew.constraints.maxStops && (
                <div>
                  <div className="text-sm text-slate-400">Max Stops</div>
                  <div className="text-white font-semibold">
                    {crew.constraints.maxStops}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crew Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Characters */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white">Characters</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {crew.people.length === 0 ? (
              <p className="text-slate-400 italic">No characters selected</p>
            ) : (
              <div className="space-y-3">
                {crew.people.map((person) => (
                  <div key={person.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-white">{person.name}</div>
                      <div className="text-sm text-slate-400">
                        {person.species && `${person.species} • `}
                        {person.homeworld || 'Unknown homeworld'}
                      </div>
                    </div>
                    {person.gender && (
                      <Badge variant="secondary">{person.gender}</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Starships */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white">Starships</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {crew.starships.length === 0 ? (
              <p className="text-slate-400 italic">No starships selected</p>
            ) : (
              <div className="space-y-3">
                {crew.starships.map((ship) => (
                  <div key={ship.id} className="p-3 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-white">{ship.name}</div>
                      {ship.starship_class && (
                        <Badge variant="outline" className="border-purple-400 text-purple-400">
                          {ship.starship_class}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-slate-400 space-y-1">
                      {ship.model && <div>Model: {ship.model}</div>}
                      <div className="grid grid-cols-2 gap-2">
                        {ship.passengers && (
                          <div>Passengers: {ship.passengers}</div>
                        )}
                        {ship.cargo_capacity && (
                          <div>Cargo: {ship.cargo_capacity.toLocaleString()} kg</div>
                        )}
                        {ship.hyperdrive_rating && (
                          <div>Hyperdrive: Class {ship.hyperdrive_rating}</div>
                        )}
                        {ship.cost_in_credits && (
                          <div>Cost: {formatCredits(ship.cost_in_credits)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Capabilities Summary */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Fleet Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{totalPassengers}</div>
              <div className="text-sm text-slate-400">Total Passenger Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {totalCargo.toLocaleString()} kg
              </div>
              <div className="text-sm text-slate-400">Total Cargo Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.min(...crew.starships.map(s => s.hyperdrive_rating || Infinity))}
              </div>
              <div className="text-sm text-slate-400">Best Hyperdrive Class</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}