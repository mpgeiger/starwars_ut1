import { useState, useEffect } from 'react'
import { useCrewStore } from '@/store/crewStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertTriangle, MapPin } from 'lucide-react'
import { FeasibilityResult } from '@/types'

export default function FeasibilityPanel() {
  const { targetPlanetId, constraints, crew } = useCrewStore()
  const [feasibility, setFeasibility] = useState<FeasibilityResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkFeasibility = async () => {
      if (!targetPlanetId || crew.ships.length === 0) {
        setFeasibility(null)
        return
      }

      setLoading(true)
      try {
        const response = await fetch('/api/feasibility', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetPlanetId,
            constraints,
            peopleIds: crew.people.map(p => p.id),
            starshipIds: crew.ships.map(s => s.id),
          }),
        })

        if (response.ok) {
          const result = await response.json()
          setFeasibility(result)
        }
      } catch (error) {
        console.error('Error checking feasibility:', error)
      } finally {
        setLoading(false)
      }
    }

    // Debounce the feasibility check
    const timeoutId = setTimeout(checkFeasibility, 500)
    return () => clearTimeout(timeoutId)
  }, [targetPlanetId, constraints, crew])

  if (!targetPlanetId) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Mission Feasibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-400">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Select a target planet to analyze mission feasibility</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (crew.ships.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Mission Feasibility</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Add at least one starship to analyze feasibility</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Mission Feasibility</CardTitle>
          {feasibility && (
            <div className="flex items-center space-x-2">
              {feasibility.ok ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <XCircle className="h-5 w-5 text-red-400" />
              )}
              <Badge variant={feasibility.ok ? 'success' : 'destructive'}>
                {feasibility.ok ? 'Feasible' : 'Issues Found'}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="text-center py-6 text-slate-400">
            Analyzing mission feasibility...
          </div>
        )}

        {!loading && feasibility && (
          <div className="space-y-4">
            {/* Issues/Warnings */}
            {feasibility.reasons.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-400 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Issues to Address:</span>
                </h4>
                <ul className="space-y-1">
                  {feasibility.reasons.map((reason, index) => (
                    <li key={index} className="text-sm text-slate-300 flex items-start space-x-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mission Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="text-sm text-slate-400">Estimated Journey</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Hyperspace Jumps:</span>
                    <span className="text-white font-medium">{feasibility.hops}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Refuel Stops:</span>
                    <span className="text-white font-medium">{feasibility.refuels}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-slate-400">Fleet Totals</div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Total Cost:</span>
                    <span className="text-green-400 font-medium">
                      {feasibility.totals.cost.toLocaleString()} credits
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Passengers:</span>
                    <span className="text-blue-400 font-medium">{feasibility.totals.passengers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Cargo:</span>
                    <span className="text-purple-400 font-medium">
                      {feasibility.totals.cargo.toLocaleString()} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Route */}
            {feasibility.suggestedRoute.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-blue-400">Suggested Route:</h4>
                <div className="flex flex-wrap gap-2">
                  {feasibility.suggestedRoute.map((stop, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <Badge variant="outline" className="border-blue-400 text-blue-400">
                        {stop.name}
                      </Badge>
                      {index < feasibility.suggestedRoute.length - 1 && (
                        <span className="text-slate-500">→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Success Message */}
            {feasibility.ok && (
              <div className="p-3 bg-green-400/10 border border-green-400/20 rounded-lg">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Mission is feasible!</span>
                </div>
                <p className="text-sm text-green-300 mt-1">
                  Your crew and fleet meet all requirements for this mission.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}