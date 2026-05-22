-- SQL seed for initial users
SET client_min_messages TO WARNING;

CREATE TABLE IF NOT EXISTS users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email varchar NOT NULL UNIQUE,
  password_hash varchar NOT NULL,
  full_name varchar NOT NULL,
  bio text,
  profile_photo varchar,
  talent_type varchar NOT NULL,
  city varchar,
  country varchar,
  verified boolean DEFAULT false,
  skills text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

INSERT INTO users (email, password_hash, full_name, talent_type, city, country, bio, skills, verified)
VALUES
('alice@example.com', '$2a$10$XhjeENMIBcTKFGNTy9VL7ucvuIkNRb2AIn3PSX8ACoHE24eo2bhua', 'Alice Singer', 'Singer', 'Austin', 'USA', 'Vocalist and songwriter', ARRAY['vocals','songwriting'], true),
('bob@example.com', '$2a$10$GzeM15HExy05fInfnnX.We10EUvzomSVs0nVS2bzTXw6LyJAwK/CS', 'Bob Chef', 'Chef', 'Portland', 'USA', 'Culinary creator', ARRAY['cooking','recipe development'], false)
ON CONFLICT (email) DO NOTHING;
