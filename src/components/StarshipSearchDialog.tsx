import { useState, useEffect } from 'react'
import { useCrewStore } from '@/store/crewStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Starship } from '@/types'
import { debounce, formatCredits } from '@/lib/utils'
import { Search, Plus } from 'lucide-react'

interface StarshipSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function StarshipSearchDialog({ open, onOpenChange }: StarshipSearchDialogProps) {
  const { addStarship } = useCrewStore()
  const [query, setQuery] = useState('')
  const [starships, setStarships] = useState<Starship[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [filters, setFilters] = useState({
    starship_class: '',
    min_hyperdrive: '',
    min_passengers: '',
    max_cost: '',
  })

  const searchStarships = debounce(async (searchQuery: string, pageNum: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: pageNum.toString(),
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        ),
      })
      
      const response = await fetch(`/api/search/starships?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (pageNum === 1) {
          setStarships(data.starships || [])
        } else {
          setStarships(prev => [...prev, ...(data.starships || [])])
        }
        setHasMore(data.hasMore || false)
      }
    } catch (error) {
      console.error('Error searching starships:', error)
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    if (open) {
      setPage(1)
      searchStarships(query, 1)
    }
  }, [query, filters, open])

  const handleAddStarship = (starship: Starship) => {
    addStarship(starship)
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    searchStarships(query, nextPage)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Add Starship</span>
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Search for starships to add to your fleet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <Input
              placeholder="Search starships..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white lg:col-span-2"
            />
            
            <Input
              placeholder="Ship class..."
              value={filters.starship_class}
              onChange={(e) => setFilters(prev => ({ ...prev, starship_class: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
            
            <Input
              type="number"
              placeholder="Min hyperdrive..."
              value={filters.min_hyperdrive}
              onChange={(e) => setFilters(prev => ({ ...prev, min_hyperdrive: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
            
            <Input
              type="number"
              placeholder="Max cost..."
              value={filters.max_cost}
              onChange={(e) => setFilters(prev => ({ ...prev, max_cost: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-3">
            {loading && starships.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                Searching starships...
              </div>
            )}

            {!loading && starships.length === 0 && (query.trim() || Object.values(filters).some(f => f)) && (
              <div className="text-center py-8 text-slate-400">
                No starships found matching your criteria
              </div>
            )}

            {starships.map((starship) => (
              <div
                key={starship.id}
                className="flex items-start justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="font-medium text-white">{starship.name}</div>
                    {starship.starship_class && (
                      <Badge variant="outline" className="border-purple-400 text-purple-400">
                        {starship.starship_class}
                      </Badge>
                    )}
                  </div>
                  
                  {starship.model && (
                    <div className="text-sm text-slate-400 mb-2">{starship.model}</div>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-slate-400">
                    {starship.cost_in_credits && (
                      <div>
                        <span className="text-slate-500">Cost:</span> {formatCredits(starship.cost_in_credits)}
                      </div>
                    )}
                    {starship.passengers && (
                      <div>
                        <span className="text-slate-500">Passengers:</span> {starship.passengers}
                      </div>
                    )}
                    {starship.cargo_capacity && (
                      <div>
                        <span className="text-slate-500">Cargo:</span> {starship.cargo_capacity.toLocaleString()} kg
                      </div>
                    )}
                    {starship.hyperdrive_rating && (
                      <div>
                        <span className="text-slate-500">Hyperdrive:</span> Class {starship.hyperdrive_rating}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAddStarship(starship)}
                  className="ml-3 bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {hasMore && starships.length > 0 && (
              <div className="text-center py-4">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                  className="border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}