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
