const express = require('express');
const router = express.Router();
const Database = require('./userDb');

router.post('/', (req, res) => {
  // do your magic!
})

router.post('/:id/posts', (req, res) => {

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

router.get('/:id', (req, res) => {
  Database.getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ errorMessage: 'The user with the specified ID does not exist' })
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve specified user information' })
    })
})

router.get('/:id/posts', (req, res) => {
  Database.getUserPosts(req.params.id)
    .then(posts => {
      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(404).json({ errorMessage: 'The post with the specified user ID does not exists' })
      }
    })
    .catch(error => {
      res.status(500).json({ errorMessage: 'Could not retrieve post information for the specified user' })
    })
})

router.delete('/:id', (req, res) => {
  // do your magic!
})

router.put('/:id', (req, res) => {
  // do your magic!
})

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
}

function validateUser(req, res, next) {
  // do your magic!
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;