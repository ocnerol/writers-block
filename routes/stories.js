/*
 * All routes for Stories are defined here
 * Since this file is loaded in server.js into api/stories,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

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
    const query = `
    SELECT stories.title AS story_title,
           stories.cover_photo AS cover_photo,
           stories.is_complete AS is_complete,
           stories.text AS story_text,
           stories.genre AS genre,
           stories.author_id AS story_author_id,
           users.name AS author_name,
           contributions.contributor_id AS contributor_id,
           contributions.title AS contributor_title,
           contributions.flavour_text AS contribution_flavour_text,
           contributions.chapter_photo_url AS chapter_photo,
           contributions.text AS contribution_text,
           contribution_users.name AS contributor_name
    FROM stories
    JOIN contributions ON contributions.story_id = stories.id
    JOIN users ON users.id = stories.author_id
    JOIN users AS contribution_users ON contribution_users.id = contributions.contributor_id
    WHERE stories.id = $1
    ORDER BY contributions.id;
    `;
    console.log(query);
    db.query(query, [id])
      .then(response => {
        // story information
        const {
          story_title,
          cover_photo,
          is_complete,
          story_text,
          genre,
          story_author_id,
          author_name
        } = response.rows[0];

        // group info for each contribution
        const contributions = [];
        for (const row of response.rows) {
          const {
            contributor_id,
            contributor_title,
            contribution_flavour_text,
            chapter_photo,
            contribution_text,
            contributor_name
          } = row;
          contributions.push(
            {
              contributor_id,
              contributor_name,
              contributor_title,
              contribution_flavour_text,
              chapter_photo,
              contribution_text
            }
          );
        }

        // bundle up story and contributions array
        const data = {
          author_name,
          story_title,
          cover_photo,
          is_complete,
          story_text,
          genre,
          story_author_id,
          contributions
        };
        res.json(data);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: error.message });
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
          .json({ error: error.message });
      });
  });

  return router;
};
