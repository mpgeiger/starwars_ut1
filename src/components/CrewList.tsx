import { useCrewStore } from '@/store/crewStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Rocket, X } from 'lucide-react'
import { formatCredits } from '@/lib/utils'

export default function CrewList() {
  const { crew, removePerson, removeStarship } = useCrewStore()

  if (crew.people.length === 0 && crew.ships.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <div className="text-slate-400">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Your crew is empty</p>
              <p className="text-sm">Add characters and starships to get started</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Characters */}
      {crew.people.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-400" />
              <CardTitle className="text-white text-lg">
                Characters ({crew.people.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {crew.people.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">{person.name}</div>
                  <div className="text-sm text-slate-400 flex items-center space-x-2">
                    {person.species && (
                      <Badge variant="secondary" className="text-xs">
                        {person.species}
                      </Badge>
                    )}
                    {person.homeworld && (
                      <span>from {person.homeworld}</span>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removePerson(person.id)}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Starships */}
      {crew.ships.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Rocket className="h-5 w-5 text-purple-400" />
              <CardTitle className="text-white text-lg">
                Starships ({crew.ships.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {crew.ships.map((ship) => (
              <div
                key={ship.id}
                className="flex items-start justify-between p-3 bg-slate-700/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-medium text-white">{ship.name}</div>
                    {ship.starship_class && (
                      <Badge variant="outline" className="border-purple-400 text-purple-400 text-xs">
                        {ship.starship_class}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-slate-400 space-y-1">
                    {ship.model && <div>{ship.model}</div>}
                    <div className="flex space-x-4">
                      {ship.passengers && (
                        <span>👥 {ship.passengers}</span>
                      )}
                      {ship.cargo_capacity && (
                        <span>📦 {ship.cargo_capacity.toLocaleString()} kg</span>
                      )}
                      {ship.hyperdrive_rating && (
                        <span>⚡ Class {ship.hyperdrive_rating}</span>
                      )}
                    </div>
                    {ship.cost_in_credits && (
                      <div className="text-green-400">
                        {formatCredits(ship.cost_in_credits)}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeStarship(ship.id)}
                  className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}