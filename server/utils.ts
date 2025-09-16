export function parseNumeric(value: string | number | null): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'unknown' || value.toLowerCase() === 'n/a') return null
    const parsed = parseFloat(value.replace(/,/g, ''))
    return isNaN(parsed) ? null : parsed
  }
  return null
}

export function distanceFactor(terrain?: string, climate?: string): number {
  const terrainFactors: Record<string, number> = {
    desert: 5,
    arid: 5,
    frozen: 6,
    tundra: 6,
    swamp: 4,
    jungle: 4,
    temperate: 3,
    grasslands: 3,
    forests: 3,
    oceanic: 4,
    water: 4,
  }

  const climateFactors: Record<string, number> = {
    desert: 5,
    arid: 5,
    frozen: 6,
    tundra: 6,
    swamp: 4,
    jungle: 4,
    temperate: 3,
    grasslands: 3,
    forests: 3,
    oceanic: 4,
    water: 4,
  }

  let maxFactor = 5 // default

  if (terrain) {
    const terrainWords = terrain.toLowerCase().split(/[,\s]+/)
    for (const word of terrainWords) {
      if (terrainFactors[word]) {
        maxFactor = Math.max(maxFactor, terrainFactors[word])
      }
    }
  }

  if (climate) {
    const climateWords = climate.toLowerCase().split(/[,\s]+/)
    for (const word of climateWords) {
      if (climateFactors[word]) {
        maxFactor = Math.max(maxFactor, climateFactors[word])
      }
    }
  }

  return maxFactor
}