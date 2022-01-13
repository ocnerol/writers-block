/*
 * All routes for Stories are defined here
 * Since this file is loaded in server.js into api/stories,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const database = require('./database.js');

module.exports = (db) => {
  // Browse stories
  router.get("/", (req, res) => {
    const query = `
    SELECT users.name AS author_name, stories.*
    FROM stories
    JOIN users ON stories.author_id = users.id
    ORDER BY id DESC;
    `;
    console.log(query);
    db.query(query)
      .then(data => {
        res.json(data.rows);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // Had to place this before Read Story route bc of route specificity
  // Add story (form)
  router.get("/new", (req, res) => {
    const userID = req.session.user_id;
    // only logged-in users can post a story
    if (!userID) {
      return res.render('pages/login_required');
    }

    res.render("pages/stories_new");  // TODO: make ejs view for new story submission
  });

  // Add story
  router.post("/new", (req, res) => {
    const userId = req.session.user_id;
    const input = req.body;
    const queryString = `
    INSERT INTO stories (title, flavour_text, cover_photo, is_complete, text, genre, author_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
    `;
    const values = [
      input.title,
      input.flavour_text,
      input.cover_photo,
      // returns undefined if checkbox is unchecked, ultimately leading to a server error.
      // Not sure how to fix this through HTML form, so I fixed the error the only way I know how
      input.is_complete ? input.is_complete : false,
      input.text,
      input.genre,
      userId
    ];
    // console.log(queryString, values);
    // console.log(input);
    db.query(queryString, values)
    .then(response => {
      const story = response.rows[0];
      res.redirect("/");
    })
    .catch(error => {
      res
      .sendStatus(500)
      .json({ error: error.message });
    });
  });

  // Read story (/stories/1)
  router.get('/:id', async (req, res) => {
    const userName = await database.getAllUsers(db, req.session.user_id);
    const stories = await database.getAllStories(db);
    const templateVars = {
      userName,
      stories,
      id: req.params.id,
      userID: req.session.user_id
    }
    res.render("pages/story_page", templateVars);
  });


  router.get("/:id/data", (req, res) => {
    const id = req.params.id;
    const query = `
    SELECT stories.title AS story_title,
           stories.cover_photo AS cover_photo,
           stories.is_complete AS is_complete,
           stories.text AS story_text,
           stories.genre AS genre,
           stories.author_id AS story_author_id,
           users.name AS author_name,
           contributions.id AS contribution_id,
           contributions.contributor_id AS contributor_id,
           contribution_users.name AS contributor_name,
           contributions.title AS contribution_title,
           contributions.flavour_text AS contribution_flavour_text,
           contributions.chapter_photo_url AS chapter_photo,
           contributions.text AS contribution_text,
           contributions.upvote_count AS contribution_upvote_count,
           contributions.is_accepted AS contribution_is_accepted
    FROM stories
    LEFT JOIN contributions ON contributions.story_id = stories.id
    JOIN users ON users.id = stories.author_id
    LEFT JOIN users AS contribution_users ON contribution_users.id = contributions.contributor_id
    WHERE stories.id = $1
    ORDER BY contributions.id;
    `;
    console.log(query);
    db.query(query, [id])
      .then(response => {
        // story information
        console.log(id);
        const {
          story_title,
          cover_photo,
          is_complete,
          story_text,
          genre,
          story_author_id,
          author_name
        } = response.rows[0];

        const contributions = [];

        if (response.rows[0].contribution_id) {
          // group info for each contribution
          for (const row of response.rows) {
            const {
              contribution_id,
              contributor_id,
              contribution_title,
              contribution_flavour_text,
              chapter_photo,
              contribution_text,
              contributor_name,
              contribution_upvote_count,
              contribution_is_accepted
            } = row;
            contributions.push(
              {
                contribution_id,
                contributor_id,
                contributor_name,
                contribution_title,
                contribution_flavour_text,
                chapter_photo,
                contribution_text,
                contribution_upvote_count,
                contribution_is_accepted
              }
            );
          }
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

        //const authorName = data.author_name
        //const templateVars = {authorName};
        //console.log('templateVars---->', templateVars)
        //console.log('data---->', data)
        //res.render("pages/story_page", templateVars);
        res.json(data);
      })
      .catch(error => {
        res
          .status(500)
          .json({ error: error.message });
      });
  });

  // Get all contributions with a particular story ID
  router.get("/:id/contributions", (req, res) => {
    db.query(`
    SELECT * FROM contributions
    WHERE story_id = $1;
    `, [req.params.id])
    .then((data) => {
      res.json(data.rows);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  // Render form to add a new contribution to a story
  router.get("/:id/contributions/new", (req, res) => {
    const templateVars = {
      storyId: req.params.id
    };

    res.render("pages/contributions_new", templateVars);
  });


//---------------------------------------------ONGOING/COMPLETE TOGGLE
  //On click of complete toggle, we will mark story as iscomplete TRUE
  router.post("/:id/complete", (req, res) => {
    //const input = req.body;
    db.query(`
      UPDATE stories
      SET is_complete = TRUE
      WHERE author_id= $1 AND id = $2
      RETURNING *;
    `, [
      req.session.user_id,
      req.params.id
    ])
    .then(() => {
     // console.log('res.data ------>', response.data)
      res.status(200).json({ message: "success"});
    })

    .catch(err => {
      console.log('err', err)
      res
        .status(500)
        .json({ error: err.message });
    });
  });


  //On click of ONGOING toggle we will mark story iscomplete FALSE
  router.post("/:id/ongoing", (req, res) => {
   // const input = req.body;
    db.query(`
      UPDATE stories
      SET is_complete = FALSE
      WHERE author_id= $1 AND id = $2
      RETURNING *;
    `, [
      req.session.user_id,
      req.params.id
    ])
    .then(() => {
      res.status(200).json({ message: "success"});
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });

  });



  // Handler for new contribution form. Add data to DB
  router.post("/:id/contributions/new", (req, res) => {
    const input = req.body;

  //fetch the story id and check if is_complete is true or false

    if (req.session.user_id) {

      db.query(`
      SELECT is_complete
      FROM stories
      WHERE id = $1
      `, [req.params.id])
      .then((result) => {
        return result.rows[0].is_complete
      })
      .then((isComplete)=>{
        if (!isComplete) {
          db.query(`
          INSERT INTO contributions (contributor_id, title, flavour_text, chapter_photo_url, text, story_id)
          VALUES($1, $2, $3, $4, $5, $6)
          RETURNING *;
          `, [
            req.session.user_id,
            input.title,
            input.flavour_text,
            input.chapter_photo_url,
            input.text,
            req.params.id
          ])
          .then(() => {
            res.redirect(`/stories/${req.params.id}`);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
        } else {
          return res.status(400).send("Story is complete")
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

    } else {
      return res.render('pages/login_required')
    }

  });


  return router;

};
