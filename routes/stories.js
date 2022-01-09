/*
 * All routes for Stories are defined here
 * Since this file is loaded in server.js into api/stories,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  // Browse stories
  router.get("/", (req, res) => {
    const query = `SELECT * FROM stories;`;
    console.log(query);
    db.query(query)
      .then(data => {
        const stories = data.rows;
        res.json({ stories });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Read story
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM stories WHERE id = $1;`;
    console.log(query);
    db.query(query, [id])
      .then(data => {
        const story = data.rows[0];
        res.json(story);
      })
      .catch(error => {
        res
          .status(500)
          .json({error: error.message});
      });
  });

  // Add story
  router.get("/new", (req, res) => {
    res.render('stories_new');
  });

  return router;
};
