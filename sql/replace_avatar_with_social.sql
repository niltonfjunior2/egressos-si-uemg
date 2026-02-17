-- Remove avatar_url and add social_media_url
ALTER TABLE profiles 
DROP COLUMN IF EXISTS avatar_url;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS social_media_url TEXT;

-- Update comment or trigger if necessary (optional)
COMMENT ON COLUMN profiles.social_media_url IS 'URL for a general social media profile (e.g. Instagram, Twitter)';
