DROP TABLE IF EXISTS contributions CASCADE;

CREATE TABLE contributions (
  id SERIAL PRIMARY KEY NOT NULL,
  contributor_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  flavour_text VARCHAR(500) NOT NULL,

  chapter_photo_url VARCHAR(255) NOT NULL,
  text TEXT NOT NULL,
  upvote_count INTEGER  NOT NULL DEFAULT 0,
  is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
  story_id INTEGER NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  -- Stretch
  contribution_location INTEGER
);


