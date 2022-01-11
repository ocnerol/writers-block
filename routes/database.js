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
