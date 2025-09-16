import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import { parseNumeric } from './utils'
import { calculateFeasibility } from './feasibility'

const app = express()
const PORT = process.env.PORT || 3001

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

app.use(cors())
app.use(express.json())

// Search planets
app.get('/api/search/planets', async (req, res) => {
  try {
    const { q } = req.query
    
    let query = supabase
      .from('planets')
      .select('*')
      .limit(20)

    if (q) {
      query = query.ilike('name', `%${q}%`)
    }

    const { data, error } = await query

    if (error) throw error

    res.json(data || [])
  } catch (error) {
    console.error('Error searching planets:', error)
    res.status(500).json({ error: 'Failed to search planets' })
  }
})

// Search people/characters
app.get('/api/search/people', async (req, res) => {
  try {
    const { q, film_id, species_id, homeworld_id, page = '1' } = req.query
    const limit = 20
    const offset = (parseInt(page as string) - 1) * limit

    let query = supabase
      .from('characters')
      .select('*')
      .range(offset, offset + limit - 1)

    if (q) {
      query = query.ilike('name', `%${q}%`)
    }
    if (species_id) {
      query = query.eq('species', species_id)
    }
    if (homeworld_id) {
      query = query.eq('homeworld', homeworld_id)
    }

    const { data, error } = await query

    if (error) throw error

    // Check if there are more results
    const { count } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })

    const hasMore = offset + limit < (count || 0)

    res.json({
      people: data || [],
      hasMore,
      total: count
    })
  } catch (error) {
    console.error('Error searching people:', error)
    res.status(500).json({ error: 'Failed to search people' })
  }
})

// Search starships
app.get('/api/search/starships', async (req, res) => {
  try {
    const { 
      q, 
      starship_class, 
      min_hyperdrive, 
      min_passengers, 
      max_cost, 
      page = '1' 
    } = req.query
    
    const limit = 20
    const offset = (parseInt(page as string) - 1) * limit

    let query = supabase
      .from('starships')
      .select('*')
      .range(offset, offset + limit - 1)

    if (q) {
      query = query.ilike('name', `%${q}%`)
    }
    if (starship_class) {
      query = query.ilike('starship_class', `%${starship_class}%`)
    }
    if (min_hyperdrive) {
      query = query.gte('hyperdrive_rating', parseFloat(min_hyperdrive as string))
    }
    if (min_passengers) {
      query = query.gte('passengers', parseInt(min_passengers as string))
    }
    if (max_cost) {
      query = query.lte('cost_in_credits', parseFloat(max_cost as string))
    }

    const { data, error } = await query

    if (error) throw error

    // Check if there are more results
    const { count } = await supabase
      .from('starships')
      .select('*', { count: 'exact', head: true })

    const hasMore = offset + limit < (count || 0)

    res.json({
      starships: data || [],
      hasMore,
      total: count
    })
  } catch (error) {
    console.error('Error searching starships:', error)
    res.status(500).json({ error: 'Failed to search starships' })
  }
})

// Check mission feasibility
app.post('/api/feasibility', async (req, res) => {
  try {
    const { targetPlanetId, constraints, peopleIds, starshipIds } = req.body

    // Get target planet data
    const { data: planet } = await supabase
      .from('planets')
      .select('*')
      .eq('id', targetPlanetId)
      .single()

    // Get starship data
    const { data: starships } = await supabase
      .from('starships')
      .select('*')
      .in('id', starshipIds)

    if (!planet || !starships) {
      return res.status(400).json({ error: 'Invalid planet or starships' })
    }

    const result = calculateFeasibility(planet, starships, constraints)
    res.json(result)
  } catch (error) {
    console.error('Error calculating feasibility:', error)
    res.status(500).json({ error: 'Failed to calculate feasibility' })
  }
})

// Save crew
app.post('/api/crews', async (req, res) => {
  try {
    const { name, targetPlanetId, constraints, peopleIds, starshipIds } = req.body

    // Insert crew
    const { data: crew, error: crewError } = await supabase
      .from('crews')
      .insert({
        name,
        target_planet_id: targetPlanetId,
        constraints: constraints || {}
      })
      .select()
      .single()

    if (crewError) throw crewError

    // Insert crew members
    if (peopleIds && peopleIds.length > 0) {
      const crewPeople = peopleIds.map((personId: number) => ({
        crew_id: crew.id,
        person_id: personId
      }))

      const { error: peopleError } = await supabase
        .from('crew_people')
        .insert(crewPeople)

      if (peopleError) throw peopleError
    }

    // Insert crew starships
    if (starshipIds && starshipIds.length > 0) {
      const crewStarships = starshipIds.map((starshipId: number) => ({
        crew_id: crew.id,
        starship_id: starshipId
      }))

      const { error: starshipsError } = await supabase
        .from('crew_starships')
        .insert(crewStarships)

      if (starshipsError) throw starshipsError
    }

    res.json({ id: crew.id, message: 'Crew saved successfully' })
  } catch (error) {
    console.error('Error saving crew:', error)
    res.status(500).json({ error: 'Failed to save crew' })
  }
})

// Get crew by ID
app.get('/api/crews/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Get crew data
    const { data: crew, error: crewError } = await supabase
      .from('crews')
      .select('*')
      .eq('id', id)
      .single()

    if (crewError) throw crewError

    // Get crew people
    const { data: crewPeople } = await supabase
      .from('crew_people')
      .select(`
        person_id,
        characters (*)
      `)
      .eq('crew_id', id)

    // Get crew starships
    const { data: crewStarships } = await supabase
      .from('crew_starships')
      .select(`
        starship_id,
        starships (*)
      `)
      .eq('crew_id', id)

    const result = {
      ...crew,
      people: crewPeople?.map(cp => cp.characters).filter(Boolean) || [],
      starships: crewStarships?.map(cs => cs.starships).filter(Boolean) || []
    }

    res.json(result)
  } catch (error) {
    console.error('Error fetching crew:', error)
    res.status(500).json({ error: 'Failed to fetch crew' })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})