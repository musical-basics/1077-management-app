-- Add is_active column to users table for soft delete
ALTER TABLE users ADD COLUMN is_active boolean DEFAULT true;

-- Update existing users to be active
UPDATE users SET is_active = true WHERE is_active IS NULL;
