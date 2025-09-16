import { create } from 'zustand'
import { Character, Starship, CrewConstraints } from '../types'
import { parseNumeric } from '../lib/utils'

interface CrewState {
  targetPlanetId: number | null
  constraints: CrewConstraints
  crew: {
    people: Character[]
    ships: Starship[]
  }
  
  // Actions
  setTargetPlanet: (planetId: number | null) => void
  setConstraints: (constraints: Partial<CrewConstraints>) => void
  addPerson: (person: Character) => void
  removePerson: (personId: number) => void
  addStarship: (starship: Starship) => void
  removeStarship: (starshipId: number) => void
  clearCrew: () => void
  
  // Selectors
  getTotals: () => {
    cost: number
    passengers: number
    cargo: number
  }
}

export const useCrewStore = create<CrewState>((set, get) => ({
  targetPlanetId: null,
  constraints: {},
  crew: {
    people: [],
    ships: []
  },

  setTargetPlanet: (planetId) => set({ targetPlanetId: planetId }),
  
  setConstraints: (newConstraints) => 
    set((state) => ({
      constraints: { ...state.constraints, ...newConstraints }
    })),

  addPerson: (person) =>
    set((state) => ({
      crew: {
        ...state.crew,
        people: state.crew.people.find(p => p.id === person.id) 
          ? state.crew.people 
          : [...state.crew.people, person]
      }
    })),

  removePerson: (personId) =>
    set((state) => ({
      crew: {
        ...state.crew,
        people: state.crew.people.filter(p => p.id !== personId)
      }
    })),

  addStarship: (starship) =>
    set((state) => ({
      crew: {
        ...state.crew,
        ships: state.crew.ships.find(s => s.id === starship.id)
          ? state.crew.ships
          : [...state.crew.ships, starship]
      }
    })),

  removeStarship: (starshipId) =>
    set((state) => ({
      crew: {
        ...state.crew,
        ships: state.crew.ships.filter(s => s.id !== starshipId)
      }
    })),

  clearCrew: () =>
    set({
      crew: { people: [], ships: [] },
      targetPlanetId: null,
      constraints: {}
    }),

  getTotals: () => {
    const { crew } = get()
    
    const cost = crew.ships.reduce((sum, ship) => {
      const shipCost = parseNumeric(ship.cost_in_credits) || 0
      return sum + shipCost
    }, 0)

    const passengers = crew.ships.reduce((sum, ship) => {
      const shipPassengers = parseNumeric(ship.passengers) || 0
      return sum + shipPassengers
    }, 0)

    const cargo = crew.ships.reduce((sum, ship) => {
      const shipCargo = parseNumeric(ship.cargo_capacity) || 0
      return sum + shipCargo
    }, 0)

    return { cost, passengers, cargo }
  }
}))