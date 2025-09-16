import { supabase } from '../src/lib/supabase'

async function testCharacterQuery() {
  console.log('Attempting to query characters table...')
  try {
    const { data, error } = await supabase
      .from('characters')
      .select('id, name, species, homeworld') // Select specific columns
      .limit(5) // Fetch up to 5 characters

    if (error) {
      console.error('Error fetching characters:', error.message)
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