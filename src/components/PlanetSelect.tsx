import { useState, useEffect } from 'react'
import { useCrewStore } from '@/store/crewStore'
import { Input } from '@/components/ui/input'
import { Planet } from '@/types'
import { debounce } from '@/lib/utils'

export default function PlanetSelect() {
  const { targetPlanetId, setTargetPlanet } = useCrewStore()
  const [query, setQuery] = useState('')
  const [planets, setPlanets] = useState<Planet[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null)

  const searchPlanets = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setPlanets([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/search/planets?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setPlanets(data)
      }
    } catch (error) {
      console.error('Error searching planets:', error)
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    searchPlanets(query)
  }, [query])

  const handleSelectPlanet = (planet: Planet) => {
    setSelectedPlanet(planet)
    setTargetPlanet(planet.id)
    setQuery(planet.name)
    setShowDropdown(false)
  }

  const handleInputChange = (value: string) => {
    setQuery(value)
    setShowDropdown(true)
    if (!value.trim()) {
      setSelectedPlanet(null)
      setTargetPlanet(null)
    }
  }

  return (
    <div className="relative">
      <Input
        placeholder="Search for a target planet..."
        value={query}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        className="bg-slate-700 border-slate-600 text-white"
      />
      
      {showDropdown && (query.trim() || planets.length > 0) && (
        <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="p-3 text-slate-400 text-center">
              Searching planets...
            </div>
          )}
          
          {!loading && planets.length === 0 && query.trim() && (
            <div className="p-3 text-slate-400 text-center">
              No planets found matching "{query}"
            </div>
          )}
          
          {!loading && planets.map((planet) => (
            <button
              key={planet.id}
              onClick={() => handleSelectPlanet(planet)}
              className="w-full p-3 text-left hover:bg-slate-700 focus:bg-slate-700 focus:outline-none"
            >
              <div className="font-medium text-white">{planet.name}</div>
              <div className="text-sm text-slate-400">
                {planet.climate && `${planet.climate} climate`}
                {planet.terrain && ` • ${planet.terrain} terrain`}
                {planet.population && ` • Population: ${planet.population.toLocaleString()}`}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {selectedPlanet && (
        <div className="mt-2 p-2 bg-slate-700/50 rounded text-sm text-slate-300">
          Target: <span className="text-blue-400 font-medium">{selectedPlanet.name}</span>
          {selectedPlanet.climate && (
            <span className="ml-2">({selectedPlanet.climate} climate)</span>
          )}
        </div>
      )}
    </div>
  )
}