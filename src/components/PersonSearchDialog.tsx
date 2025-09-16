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
import { Character } from '@/types'
import { debounce } from '@/lib/utils'
import { Search, UserPlus } from 'lucide-react'

interface PersonSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function PersonSearchDialog({ open, onOpenChange }: PersonSearchDialogProps) {
  const { addPerson } = useCrewStore()
  const [query, setQuery] = useState('')
  const [people, setPeople] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const searchPeople = debounce(async (searchQuery: string, pageNum: number = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        page: pageNum.toString(),
      })
      
      const response = await fetch(`/api/search/people?${params}`)
      if (response.ok) {
        const data = await response.json()
        if (pageNum === 1) {
          setPeople(data.people || [])
        } else {
          setPeople(prev => [...prev, ...(data.people || [])])
        }
        setHasMore(data.hasMore || false)
      }
    } catch (error) {
      console.error('Error searching people:', error)
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    if (open) {
      setPage(1)
      searchPeople(query, 1)
    }
  }, [query, open])

  const handleAddPerson = (person: Character) => {
    addPerson(person)
    // Optional: show success feedback
  }

  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    searchPeople(query, nextPage)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>Add Character</span>
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Search for Star Wars characters to add to your crew
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Search characters by name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white"
          />

          <div className="max-h-96 overflow-y-auto space-y-2">
            {loading && people.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                Searching characters...
              </div>
            )}

            {!loading && people.length === 0 && query.trim() && (
              <div className="text-center py-8 text-slate-400">
                No characters found matching "{query}"
              </div>
            )}

            {people.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700"
              >
                <div className="flex-1">
                  <div className="font-medium text-white">{person.name}</div>
                  <div className="text-sm text-slate-400 space-x-2">
                    {person.species && (
                      <Badge variant="secondary" className="text-xs">
                        {person.species}
                      </Badge>
                    )}
                    {person.homeworld && (
                      <span>from {person.homeworld}</span>
                    )}
                    {person.gender && (
                      <span>• {person.gender}</span>
                    )}
                  </div>
                  {person.description && (
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {person.description}
                    </div>
                  )}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleAddPerson(person)}
                  className="ml-3 bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {hasMore && people.length > 0 && (
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