const express = require('express');
const router = express.Router();
const UserDb = require('./userDb');
const PostDb = require('../posts/postDb');

router.post('/', validateUser, (req, res) => {
  UserDb.insert(req.body)
    .then(newUser => {
      res.status(201).json(newUser);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'There was an error posting the new user to the database' })
    })
})

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const id = req.params.id;
  let posts = req.body;
  posts = { ...posts, user_Id: id };

  PostDb.insert(posts)
    .then(newPost => {
      res.status(201).json(newPost);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'There was an error while saving the comment to the database' });
    })
})

router.get('/', (req, res) => {
  UserDb.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve a list of users' })
    })
})

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
  // console.log(req.user);
})

router.get('/:id/posts', validateUserId, (req, res) => {
  UserDb.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve post information for the specified user' })
    })
})

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  // console.log(req.user);

  UserDb.remove(id)
    .then(deleted => {
      res.status(200).json(req.user);
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'The user could not be removed' });
    })
})

router.put('/:id', validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  const updatedUser = { ...changes, id };

  UserDb.update(id, changes)
    .then(editUser => {
      res.status(200).json(updatedUser);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'The user information could not be modified' });
    })
})

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  UserDb.getById(id)
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
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errorMessage: 'missing user data' })
  } else if (!req.body.name) {
    res.status(400).json({ errorMessage: 'missing required name field' })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ errorMessage: 'missing post data' })
  } else if (!req.body.text) {
    res.status(400).json({ errorMessage: 'missing required text field' })
  } else {
    next();
  }
}

module.exports = router;