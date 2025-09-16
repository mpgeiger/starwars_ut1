# StarCrew - Star Wars Crew Builder

A full-stack TypeScript application for building and managing Star Wars crews for galactic missions.

## Features

- **Character Selection**: Browse and select from hundreds of Star Wars characters
- **Starship Fleet Management**: Build your fleet with iconic starships
- **Mission Planning**: Set constraints and analyze mission feasibility
- **Route Optimization**: Calculate optimal routes with hyperdrive capabilities
- **Crew Persistence**: Save and share crew configurations

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for development and building
- Tailwind CSS for styling
- shadcn/ui components
- Zustand for state management
- React Router for navigation

### Backend
- Node.js with Express
- TypeScript
- Supabase for database

### Database
- Supabase (PostgreSQL)
- Star Wars data from existing tables
- Custom crew management tables

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- Supabase account and project

### Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   - Run the migration in `supabase/migrations/create_crew_tables.sql`
   - This creates the `crews`, `crew_people`, and `crew_starships` tables

### Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

This starts:
- Frontend dev server on `http://localhost:5173`
- Backend API server on `http://localhost:3001`

### Building for Production

Build both frontend and backend:

```bash
npm run build
```

### Running in Production

```bash
npm start
```

## API Endpoints

- `GET /api/search/planets?q=...` - Search planets
- `GET /api/search/people?q=...&page=...` - Search characters with pagination
- `GET /api/search/starships?q=...&page=...` - Search starships with filters
- `POST /api/feasibility` - Analyze mission feasibility
- `POST /api/crews` - Save crew configuration
- `GET /api/crews/:id` - Get saved crew by ID

## Database Schema

### Existing Tables
The app assumes existing Star Wars data tables:
- `planets` - Planet information
- `characters` - Character/people data  
- `starships` - Starship specifications

### New Tables
- `crews` - Saved crew configurations
- `crew_people` - Junction table for crew members
- `crew_starships` - Junction table for crew starships

## Mission Feasibility Rules

The feasibility engine checks:

1. **Budget Constraints**: Total starship costs vs budget limit
2. **Passenger Requirements**: Fleet capacity vs minimum passengers needed
3. **Cargo Requirements**: Fleet cargo space vs minimum cargo needed
4. **Reachability**: Hyperdrive capability for interstellar travel
5. **Journey Estimation**: Hops and refuel stops based on distance factors

## Distance Calculation

Simplified distance factors based on planet characteristics:
- Desert/Arid: Factor 5
- Frozen/Tundra: Factor 6  
- Swamp/Jungle: Factor 4
- Temperate/Grasslands/Forests: Factor 3
- Oceanic/Water: Factor 4
- Default: Factor 5

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details