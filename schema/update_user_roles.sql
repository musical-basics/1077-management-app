-- Drop the restrictive check constraint on users.role
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Add a new check constraint that includes the specific roles used in the UI
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'assistant', 'Cleaner', 'Personal Assistant', 'Dog Walker', 'Team Lead'));
