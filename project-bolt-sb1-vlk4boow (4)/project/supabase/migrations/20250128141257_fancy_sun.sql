/*
  # Schema inicial para el sistema de fidelización

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `email` (text)
      - `name` (text)
      - `points` (integer)
      - `tier` (text)
      - `join_date` (timestamp)
      - `last_purchase` (timestamp)
      - `referrals` (integer)
      - `notification_preferences` (jsonb)
      
    - `rewards`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `points_cost` (integer)
      - `type` (text)
      - `value` (integer)
      - `available` (boolean)
      
    - `activities`
      - `id` (uuid, primary key)
      - `customer_id` (uuid, foreign key)
      - `type` (text)
      - `points` (integer)
      - `date` (timestamp)
      - `description` (text)
      
    - `settings`
      - `id` (uuid, primary key)
      - `store_id` (uuid)
      - `key` (text)
      - `value` (jsonb)
      
  2. Security
    - Enable RLS en todas las tablas
    - Políticas para lectura/escritura basadas en roles
*/

-- Customers table
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  points integer DEFAULT 0,
  tier text DEFAULT 'Bronze',
  join_date timestamptz DEFAULT now(),
  last_purchase timestamptz,
  referrals integer DEFAULT 0,
  notification_preferences jsonb DEFAULT '{"pointsUpdates": true, "tierUpdates": true, "rewards": true, "referrals": true, "promotions": true}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rewards table
CREATE TABLE rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_cost integer NOT NULL,
  type text NOT NULL,
  value integer NOT NULL,
  available boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES customers(id),
  type text NOT NULL,
  points integer NOT NULL,
  date timestamptz DEFAULT now(),
  description text,
  created_at timestamptz DEFAULT now()
);

-- Settings table
CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL,
  key text NOT NULL,
  value jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(store_id, key)
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Customers can view their own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Customers can update their own data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Rewards policies
CREATE POLICY "Anyone can view available rewards"
  ON rewards
  FOR SELECT
  TO authenticated
  USING (available = true);

-- Activities policies
CREATE POLICY "Customers can view their own activities"
  ON activities
  FOR SELECT
  TO authenticated
  USING (customer_id IN (
    SELECT id FROM customers WHERE user_id = auth.uid()
  ));

-- Settings policies
CREATE POLICY "Only store owners can manage settings"
  ON settings
  FOR ALL
  TO authenticated
  USING (store_id IN (
    SELECT id FROM stores WHERE owner_id = auth.uid()
  ));

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_rewards_updated_at
  BEFORE UPDATE ON rewards
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();