/*
  # Agregar campos para integración con Shopify

  1. Changes
    - Agregar campos relacionados con Shopify a la tabla customers
    - Agregar campos para tracking de Shopify en activities
    
  2. New Fields
    - customers:
      - shopify_customer_id (bigint)
    - activities:
      - shopify_order_id (bigint)
      - shopify_order_number (integer)
*/

-- Agregar campos de Shopify a customers
ALTER TABLE customers
ADD COLUMN IF NOT EXISTS shopify_customer_id bigint UNIQUE;

-- Agregar campos de Shopify a activities
ALTER TABLE activities
ADD COLUMN IF NOT EXISTS shopify_order_id bigint,
ADD COLUMN IF NOT EXISTS shopify_order_number integer;