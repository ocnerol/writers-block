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

  // Add story (form)
  router.get("/new", (req, res) => {
    res.render('stories_new');
  });

  // Add story
  router.post("/new", (req, res) => {
    const userId = session.userId;
    const input = req.body;
    const queryString = `
    INSERT INTO stories (title, flavour_text, cover_photo, is_complete, text, genre, author_id)
    VALUES ($1, $2, $3, $4, $5, $6);
    `;
    const values = [
      input.title,
      input.flavour_text,
      input.cover_photo,
      input.is_complete,
      input.text,
      input.genre,
      userId
    ];
    console.log(queryString, values);
    db.query(queryString, values)
    .then(response => {
      const story = response.rows[0];
      res.send(story);
    })
    .catch(error => {
      res
      .send(500)
      .json({error: error.message});
    });
  });

  return router;
};
