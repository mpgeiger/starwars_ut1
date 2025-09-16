import { parseNumeric, distanceFactor } from './utils.js'

interface Planet {
  id: number
  name: string
  terrain?: string
  climate?: string
}

interface Starship {
  id: number
  name: string
  cost_in_credits?: number
  passengers?: number
  cargo_capacity?: number
  hyperdrive_rating?: number
  MGLT?: number
}

interface Constraints {
  budget?: number
  minPassengers?: number
  cargoKg?: number
  maxStops?: number
}

interface FeasibilityResult {
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

export function calculateFeasibility(
  planet: Planet,
  starships: Starship[],
  constraints: Constraints
): FeasibilityResult {
  const reasons: string[] = []
  
  // Calculate totals
  const totals = {
    cost: 0,
    passengers: 0,
    cargo: 0
  }

  let maxHyperdrive = 0
  let avgMGLT = 0
  let mgltCount = 0

  for (const ship of starships) {
    const cost = parseNumeric(ship.cost_in_credits) || 0
    const passengers = parseNumeric(ship.passengers) || 0
    const cargo = parseNumeric(ship.cargo_capacity) || 0
    const hyperdrive = parseNumeric(ship.hyperdrive_rating) || 0
    const mglt = parseNumeric(ship.MGLT) || 0

    totals.cost += cost
    totals.passengers += passengers
    totals.cargo += cargo

    if (hyperdrive > 0) {
      maxHyperdrive = Math.max(maxHyperdrive, hyperdrive)
    }

    if (mglt > 0) {
      avgMGLT += mglt
      mgltCount++
    }
  }

  if (mgltCount > 0) {
    avgMGLT = avgMGLT / mgltCount
  }

  // Check constraints
  if (constraints.budget && totals.cost > constraints.budget) {
    reasons.push(`Total cost (${totals.cost.toLocaleString()} credits) exceeds budget (${constraints.budget.toLocaleString()} credits)`)
  }

  if (constraints.minPassengers && totals.passengers < constraints.minPassengers) {
    reasons.push(`Passenger capacity (${totals.passengers}) is below minimum requirement (${constraints.minPassengers})`)
  }

  if (constraints.cargoKg && totals.cargo < constraints.cargoKg) {
    reasons.push(`Cargo capacity (${totals.cargo.toLocaleString()} kg) is below minimum requirement (${constraints.cargoKg.toLocaleString()} kg)`)
  }

  // Check reachability
  if (maxHyperdrive === 0) {
    reasons.push('No starships with hyperdrive capability - cannot reach target planet')
  }

  // Calculate journey estimates
  const distance = distanceFactor(planet.terrain, planet.climate)
  const hops = maxHyperdrive > 0 ? Math.ceil(distance / maxHyperdrive) : 999
  const refuels = Math.max(0, hops - Math.floor(avgMGLT / 50))

  if (constraints.maxStops && (hops - 1) > constraints.maxStops) {
    reasons.push(`Estimated stops (${hops - 1}) exceeds maximum allowed (${constraints.maxStops})`)
  }

  // Generate suggested route (simplified)
  const suggestedRoute = [
    { planetId: planet.id, name: planet.name }
  ]

  // Add intermediate stops if needed
  if (hops > 1) {
    const intermediateStops = [
      'Coruscant', 'Naboo', 'Tatooine', 'Alderaan', 'Yavin 4'
    ]
    
    for (let i = 1; i < hops && i < 4; i++) {
      suggestedRoute.unshift({
        planetId: i * 100, // dummy ID
        name: intermediateStops[i - 1] || `Stop ${i}`
      })
    }
  }

  return {
    ok: reasons.length === 0,
    reasons,
    totals,
    hops,
    refuels,
    suggestedRoute
  }
}