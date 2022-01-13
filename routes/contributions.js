/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/contributions,
 *   these routes are mounted onto /contributions
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const database = require('./database');

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

  router.get("/contributor/:id", (req, res) => {
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

  // get contribution by ID
  router.get("/:id", (req, res) => {
    const contributionID = req.params.id;
    db.query(`
    SELECT * FROM contributions
    WHERE id = $1;
    `, [contributionID])
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

  // set contribution_location to zero to delete. Works
  // curl -X POST -i localhost:8080/contributions/12/delete
  router.post("/:id/delete", (req, res) => {
    db.query(`
      UPDATE contributions
      SET contribution_location = 0
      WHERE id = $1
      RETURNING *;
    `, [req.params.id])
      .then((data) => {
        console.log(data.rows);
        res.redirect(`/stories/1`);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // handler for increasing upvote count
  // curl -X POST -i localhost:8080/contributions/6/upvote
  router.post("/:id/upvote", (req, res) => {
    contributionID = req.params.id;
    database.increaseUpvoteCount(db, contributionID)
      .then((data)=> {
        res.end();
      })
      .catch(e => {
        console.error(e);
        res.json(e);
      });
  });

  router.post("/:id/downvote", (req, res) => {
    contributionID = req.params.id;
    database.decreaseUpvoteCount(db, contributionID)
      .then(()=> {
        res.end();
      })
      .catch(e => {
        console.error(e);
        res.json(e);
      });
  });




  router.post("/mark-as-merged/:contributionID", (req, res) => {
    const contributionID = req.params.contributionID;

    db.query(`
    UPDATE contributions
    SET is_accepted = TRUE
    WHERE contributions.id = $1
    RETURNING *;
    `, [ contributionID ])
    .then(response => {
      console.log('successfully updated contribution is_accepted field to TRUE!');
    })
    .catch(error => {
      res.json({ error: `error updating contribution is_accepted field: ${error.message}` });
    });
  });
  return router;
};
