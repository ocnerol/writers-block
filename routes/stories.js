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
    let query = `SELECT * FROM stories`;
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

};
