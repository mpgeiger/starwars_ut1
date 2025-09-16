import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client (same as server)
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testPeopleSearch() {
  console.log('Testing people search query...')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Using anon key:', supabaseAnonKey ? 'Yes' : 'No')
  
  try {
    // Test parameters (similar to /api/search/people)
    const testParams = {
      q: 'r2',           // Search for "r2" (like R2-D2)
      page: 1,
      limit: 20
    }
    
    const offset = (testParams.page - 1) * testParams.limit
    
    console.log(`\nSearching for characters with name containing "${testParams.q}"...`)
    
    let query = supabase
      .from('characters')
      .select('*')
      .range(offset, offset + testParams.limit - 1)

    if (testParams.q) {
      query = query.ilike('name', `%${testParams.q}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase query error:', error)
      return
    }

    console.log(`\nFound ${data?.length || 0} characters:`)
    
    if (data && data.length > 0) {
      data.forEach((character, index) => {
        console.log(`${index + 1}. ID: ${character.id}, Name: ${character.name}`)
        if (character.species) console.log(`   Species: ${character.species}`)
        if (character.homeworld) console.log(`   Homeworld: ${character.homeworld}`)
        if (character.gender) console.log(`   Gender: ${character.gender}`)
        console.log('') // Empty line for readability
      })
    } else {
      console.log('No characters found matching the search criteria.')
    }

    // Test count query (like in the API)
    console.log('Testing count query...')
    const { count, error: countError } = await supabase
      .from('characters')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Count query error:', countError)
    } else {
      console.log(`Total characters in database: ${count}`)
    }

  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

// Run the test
testPeopleSearch()