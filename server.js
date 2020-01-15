const express = require('express'); //importing a CommonJS module
const helmet = require('helmet'); //yarn add helmet
const userRouter = require('./users/userRouter.js'); //imports our userRouter
const postRouter = require('./posts/postRouter'); //imports our postRouter
const server = express(); //creates the server

//global middleware
server.use(express.json()); //middleware needed to parse JSON
server.use(helmet()); //middleware that adds a layer of security to the server
server.use(logger);

//endpoints
server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//routes
server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

//custom middleware

function logger(req, res, next) {
  console.log(req.method, req.url, new Date());
  next();
}

module.exports = server;