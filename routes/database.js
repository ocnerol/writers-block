const getAllStories = (db) => {
  const query = `
    SELECT users.name AS author_name, stories.*
    FROM stories
    JOIN users ON stories.author_id = users.id
    ORDER BY id DESC;
    `;
  // console.log(query);
  return db.query(query)
    .then(data => {
      // console.log(data.rows);
      return (data.rows);
    })
    .catch(err => err.message);
};

exports.getAllStories = getAllStories;

// get all contributions to a story by story ID
const getStoryContributions = (db, storyID) => {
  const query = `
  SELECT * FROM contributions
  JOIN stories ON stories.id = story_id
  WHERE stories.id = $1;
    `;
  // console.log(query);
  return db.query(query, [storyID])
    .then(data => {
      // console.log(data.rows);
      return (data.rows);
    })
    .catch(err => err.message);
};

exports.getStoryContributions = getStoryContributions;

// for / index route. If no user, return null else fetch user by id to display name
const getAllUsers = (db, id) => {
  if (!id) {
    return null;
  }

  const query = `
    SELECT name FROM users
    WHERE id = $1;
    `;
  // console.log(query);
  return db.query(query, [id])
    .then(data => {
      if (data.rows) {
        return (data.rows[0].name);
      } else {
        return null;
      }
    })
    .catch(err => err.message);
};

exports.getAllUsers = getAllUsers;


// Queries for upvote/downvote function
const increaseUpvoteCount = (db, contributionID) => {
  const query = `
    UPDATE contributions
    SET upvote_count = upvote_count + 1
    WHERE id = $1
  `;

  return db.query(query, [contributionID])
    .then(() => {
      console.log('upvote done')
    })
    .catch(err => err.message);
};

exports.increaseUpvoteCount = increaseUpvoteCount;

const decreaseUpvoteCount = (db, contributionID) => {
  const query = `
    UPDATE contributions
    SET upvote_count = upvote_count - 1
    WHERE id = $1
  `;

  return db.query(query, [contributionID])
  .then(() => {
    console.log('downvote done')
  })
  .catch(err => err.message);
};

exports.decreaseUpvoteCount = decreaseUpvoteCount;

