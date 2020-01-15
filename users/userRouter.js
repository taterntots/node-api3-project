const express = require('express');
const router = express.Router();
const Database = require('./userDb');

router.post('/', (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ errorMessage: 'A name is required to update this user' })
  } else {
    Database.insert(req.body)
      .then(newUser => {
        res.status(201).json(newUser);
      })
      .catch(error => {
        res.status(500).json({ errorMessage: 'There was an error posting the new user to the database' })
      })
  }
})

router.post('/:id/posts', (req, res) => {
  const id = req.params.id;
  let posts = req.body;
  posts = { ...posts, user_Id: id };
  console.log(posts.text);

    if (!posts.text) {
      res.status(400).json({ errorMessage: 'Please provide text for the posts' });
  } else {
      Database.insert(posts)
        .then(newPost => {
          console.log(newPost);
            if (newPost) {
                res.status(201).json(newPost);
            } else {
                res.status(404).json({ errorMessage: 'The post with the specified ID does not exist' });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ errorMessage: 'There was an error while saving the comment to the database' });
        })
    }
})

router.get('/', (req, res) => {
  Database.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve a list of users' })
    })
})

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
  console.log(req.user);
})

router.get('/:id/posts', (req, res) => {
  // console.log(req.params.id);
  // if(req.params.id !== user_id) {
  //   res.status(404).json({ errorMessage: 'A user with the specified ID does not exist' })
  // } else {
  Database.getUserPosts(req.params.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ errorMessage: 'Posts for the specified user ID do not exist' })
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve post information for the specified user' })
    })
})

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  Database.remove(id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ errorMessage: 'The user with the specified ID does not exist' });
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    })
})

router.put('/:id', (req, res) => {
  const id = req.params.id;
  const changes = req.body;

  if (!changes.name) {
    res.status(400).json({ errorMessage: 'Please provide a name for the user' });
  } else {
    Database.update(id, changes)
      .then(editUser => {
        if (editUser) {
          res.status(200).json(editUser);
        } else {
          res.status(404).json({ errorMessage: 'The user with the specified ID does not exist' });
        }
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ errorMessage: 'The user information could not be modified' });
      })
  }
})

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  Database.getById(id)
    .then(user => {
      if (user) {
        // console.log(user);
        req.user = user;
        next();
      } else {
        res.status(400).json({ errorMessage: 'The user with the specified ID does not exist' })
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve specified user information' })
    })
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;