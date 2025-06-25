/*
  # Create users table for vulnerable auth system

  1. New Tables
    - `vulnerable_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password` (text, plain text - intentionally vulnerable)
      - `role` (text, default 'user')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `vulnerable_users` table
    - Add policy for public access (intentionally vulnerable for educational purposes)

  Note: This implementation is intentionally insecure for educational purposes only
*/

CREATE TABLE IF NOT EXISTS vulnerable_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password text NOT NULL, -- VULNERABLE: Plain text password storage
  role text DEFAULT 'user',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vulnerable_users ENABLE ROW LEVEL SECURITY;

-- VULNERABLE: Allow public access for educational purposes
CREATE POLICY "Allow public access to vulnerable_users"
  ON vulnerable_users
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Insert default admin user
INSERT INTO vulnerable_users (email, password, role) 
VALUES ('admin@test.com', 'Password123!', 'admin')
ON CONFLICT (email) DO NOTHING;