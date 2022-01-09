/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/contributions,
 *   these routes are mounted onto /contributions
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

// In case
module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM contributions;`)
      .then(data => {
        const contributions = data.rows;
        res.json({ contributions });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    const userID = req.params.id;
    db.query(`
      SELECT * FROM contributions
      WHERE contributor_id = $1;
    `, [userID])
    .then(data => {
      const contribution = data.rows;
      res.json({ contribution });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });
  return router;
};
