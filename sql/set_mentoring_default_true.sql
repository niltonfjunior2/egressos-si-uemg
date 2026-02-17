-- Set default value for is_open_to_mentoring to true
ALTER TABLE profiles 
ALTER COLUMN is_open_to_mentoring SET DEFAULT true;

-- Optional: Update existing null values to true if desired, but request specified "new" registrations.
-- However, for consistency, we might want to ensure new rows created via triggers also get this.
-- If the trigger uses the default, this ALTER TABLE is sufficient.
