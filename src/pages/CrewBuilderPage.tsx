import { useState } from 'react'
import { useCrewStore } from '@/store/crewStore'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Rocket, Target, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import PlanetSelect from '@/components/PlanetSelect'
import PersonSearchDialog from '@/components/PersonSearchDialog'
import StarshipSearchDialog from '@/components/StarshipSearchDialog'
import CrewList from '@/components/CrewList'
import FeasibilityPanel from '@/components/FeasibilityPanel'
import { formatCredits } from '@/lib/utils'

export default function CrewBuilderPage() {
  const {
    targetPlanetId,
    constraints,
    crew,
    setConstraints,
    getTotals,
    clearCrew
  } = useCrewStore()

  const [showPersonDialog, setShowPersonDialog] = useState(false)
  const [showStarshipDialog, setShowStarshipDialog] = useState(false)
  const [crewName, setCrewName] = useState('')
  const [saving, setSaving] = useState(false)

  const totals = getTotals()

  const handleSaveCrew = async () => {
    if (!crewName.trim()) {
      alert('Please enter a crew name')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/crews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: crewName,
          targetPlanetId,
          constraints,
          peopleIds: crew.people.map(p => p.id),
          starshipIds: crew.ships.map(s => s.id),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Crew "${crewName}" saved successfully!`)
        // Optionally redirect to crew view page
        // navigate(`/crew/${result.id}`)
      } else {
        throw new Error('Failed to save crew')
      }
    } catch (error) {
      console.error('Error saving crew:', error)
      alert('Failed to save crew. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const getConstraintBadgeVariant = (current: number, constraint?: number) => {
    if (!constraint) return 'secondary'
    if (current >= constraint) return 'success'
    if (current >= constraint * 0.8) return 'warning'
    return 'destructive'
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Crew Builder</h1>
        <p className="text-slate-300">
          Assemble your team and plan your mission to the stars
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Mission Setup */}
        <div className="space-y-6">
          {/* Target Planet */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-400" />
                <CardTitle className="text-white">Target Planet</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <PlanetSelect />
            </CardContent>
          </Card>

          {/* Mission Constraints */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Mission Constraints</CardTitle>
              <CardDescription className="text-slate-300">
                Set limits and requirements for your mission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Max Budget (credits)
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={constraints.budget || ''}
                  onChange={(e) => setConstraints({ 
                    budget: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Min Passenger Capacity
                </label>
                <Input
                  type="number"
                  placeholder="No requirement"
                  value={constraints.minPassengers || ''}
                  onChange={(e) => setConstraints({ 
                    minPassengers: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Min Cargo Capacity (kg)
                </label>
                <Input
                  type="number"
                  placeholder="No requirement"
                  value={constraints.cargoKg || ''}
                  onChange={(e) => setConstraints({ 
                    cargoKg: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Max Stops
                </label>
                <Input
                  type="number"
                  placeholder="No limit"
                  value={constraints.maxStops || ''}
                  onChange={(e) => setConstraints({ 
                    maxStops: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Crew Members */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowPersonDialog(true)}
              className="h-20 bg-blue-600 hover:bg-blue-700"
            >
              <div className="flex flex-col items-center space-y-1">
                <Users className="h-6 w-6" />
                <span>Add Character</span>
              </div>
            </Button>
            
            <Button
              onClick={() => setShowStarshipDialog(true)}
              className="h-20 bg-purple-600 hover:bg-purple-700"
            >
              <div className="flex flex-col items-center space-y-1">
                <Rocket className="h-6 w-6" />
                <span>Add Starship</span>
              </div>
            </Button>
          </div>

          {/* Crew List */}
          <CrewList />
        </div>

        {/* Right Column - Summary & Analysis */}
        <div className="space-y-6">
          {/* Crew Summary */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Crew Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {crew.people.length}
                  </div>
                  <div className="text-sm text-slate-400">Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    {crew.ships.length}
                  </div>
                  <div className="text-sm text-slate-400">Starships</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {formatCredits(totals.cost)}
                  </div>
                  <div className="text-sm text-slate-400">Total Cost</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Passenger Capacity:</span>
                  <Badge variant={getConstraintBadgeVariant(totals.passengers, constraints.minPassengers)}>
                    {totals.passengers}
                    {constraints.minPassengers && ` / ${constraints.minPassengers}`}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Cargo Capacity:</span>
                  <Badge variant={getConstraintBadgeVariant(totals.cargo, constraints.cargoKg)}>
                    {totals.cargo.toLocaleString()} kg
                    {constraints.cargoKg && ` / ${constraints.cargoKg.toLocaleString()} kg`}
                  </Badge>
                </div>
                
                {constraints.budget && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Budget Usage:</span>
                    <Badge variant={totals.cost <= constraints.budget ? 'success' : 'destructive'}>
                      {((totals.cost / constraints.budget) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Feasibility Analysis */}
          <FeasibilityPanel />

          {/* Save Crew */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Save Crew</CardTitle>
              <CardDescription className="text-slate-300">
                Save your crew configuration for future reference
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter crew name..."
                value={crewName}
                onChange={(e) => setCrewName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              
              <div className="flex space-x-2">
                <Button
                  onClick={handleSaveCrew}
                  disabled={saving || !crewName.trim() || crew.people.length === 0}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {saving ? 'Saving...' : 'Save Crew'}
                </Button>
                
                <Button
                  onClick={clearCrew}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <PersonSearchDialog 
        open={showPersonDialog} 
        onOpenChange={setShowPersonDialog} 
      />
      <StarshipSearchDialog 
        open={showStarshipDialog} 
        onOpenChange={setShowStarshipDialog} 
      />
    </div>
  )
}