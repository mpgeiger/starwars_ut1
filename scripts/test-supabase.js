import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!')
  console.log('SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCharacterQuery() {
  console.log('Attempting to query characters table...')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Using anon key:', supabaseAnonKey ? 'Yes' : 'No')
  
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, species, homeworld') // Select specific columns
      .limit(5) // Fetch up to 5 characters

    if (error) {
      console.error('Error fetching characters:', error.message)
      console.error('Error details:', error)
      return
    }

    if (data) {
      console.log('Successfully fetched characters:')
      data.forEach(character => {
        console.log(`- ID: ${character.id}, Name: ${character.name}, Species: ${character.species || 'N/A'}, Homeworld: ${character.homeworld || 'N/A'}`)
      })
    } else {
      console.log('No characters found.')
    }
  } catch (err) {
    console.error('An unexpected error occurred:', err)
  }
}

// Call the function to run the test
testCharacterQuery()