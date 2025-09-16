/*
  # Create crew management tables

  1. New Tables
    - `crews`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `target_planet_id` (integer, references planets)
      - `constraints` (jsonb for mission constraints)
      - `created_at` (timestamptz, default now())
    - `crew_people`
      - `crew_id` (uuid, foreign key to crews)
      - `person_id` (integer, references characters)
    - `crew_starships`
      - `crew_id` (uuid, foreign key to crews)
      - `starship_id` (integer, references starships)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (demo app)
    - Add policies for public write access (demo app)

  3. Sample Data
    - Insert example crew for testing
*/

-- Create crews table
CREATE TABLE IF NOT EXISTS crews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  target_planet_id integer,
  constraints jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create crew_people junction table
CREATE TABLE IF NOT EXISTS crew_people (
  crew_id uuid REFERENCES crews(id) ON DELETE CASCADE,
  person_id integer NOT NULL,
  PRIMARY KEY (crew_id, person_id)
);

-- Create crew_starships junction table
CREATE TABLE IF NOT EXISTS crew_starships (
  crew_id uuid REFERENCES crews(id) ON DELETE CASCADE,
  starship_id integer NOT NULL,
  PRIMARY KEY (crew_id, starship_id)
);

-- Enable RLS
ALTER TABLE crews ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_people ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_starships ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (demo app)
CREATE POLICY "Public can read crews"
  ON crews
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert crews"
  ON crews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read crew_people"
  ON crew_people
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert crew_people"
  ON crew_people
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Public can read crew_starships"
  ON crew_starships
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can insert crew_starships"
  ON crew_starships
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Insert sample crew data
INSERT INTO crews (id, name, target_planet_id, constraints) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Rebel Alliance Strike Team', 1, '{"budget": 500000, "minPassengers": 10, "cargoKg": 1000, "maxStops": 3}');

-- Sample crew members (assuming some character IDs exist)
INSERT INTO crew_people (crew_id, person_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 1),
  ('550e8400-e29b-41d4-a716-446655440000', 2);

-- Sample crew starships (assuming some starship IDs exist)
INSERT INTO crew_starships (crew_id, starship_id) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 1),
  ('550e8400-e29b-41d4-a716-446655440000', 2);