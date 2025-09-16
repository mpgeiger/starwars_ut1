export interface Planet {
  id: number
  name: string
  diameter?: number
  rotation_period?: number
  orbital_period?: number
  gravity?: string
  population?: number
  climate?: string
  terrain?: string
  surface_water?: number
  residents?: string
  films?: string
}

export interface Character {
  id: number
  name: string
  species?: string
  gender?: string
  height?: number
  weight?: number
  hair_color?: string
  eye_color?: string
  skin_color?: string
  year_born?: number
  homeworld?: string
  year_died?: number
  description?: string
}

export interface Starship {
  id: number
  name: string
  model?: string
  manufacturer?: string
  cost_in_credits?: number
  length?: number
  max_atmosphering_speed?: number
  crew?: number
  passengers?: number
  cargo_capacity?: number
  consumables?: string
  hyperdrive_rating?: number
  MGLT?: number
  starship_class?: string
  pilots?: string
  films?: string
}

export interface Crew {
  id: string
  name: string
  target_planet_id?: number
  constraints: CrewConstraints
  created_at: string
  people: Character[]
  starships: Starship[]
}

export interface CrewConstraints {
  budget?: number
  minPassengers?: number
  cargoKg?: number
  maxStops?: number
}

export interface FeasibilityResult {
  ok: boolean
  reasons: string[]
  totals: {
    cost: number
    passengers: number
    cargo: number
  }
  hops: number
  refuels: number
  suggestedRoute: Array<{
    planetId: number
    name: string
  }>
}

export interface SearchFilters {
  query?: string
  film_id?: string
  species_id?: string
  homeworld_id?: string
  starship_class?: string
  min_hyperdrive?: number
  min_passengers?: number
  max_cost?: number
  page?: number
}