const path = require('path');
const redis = require('redis');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport')
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const morgan = require('morgan');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');

const router = require('./router');
const { mongoPath, sessionSecret } = require('./config');

const app = express();
const port = process.env.PORT || 8080;

app.use(favicon(__dirname + '/views/favicon.ico'));
app.use(express.static(path.join(__dirname, './views')));

const redisClient = redis.createClient({
  host: process.env.usingDocker ? 'redis' : '127.0.0.1',
  port: 6379,
  logErrors: true
});

redisClient.on('connect', () => console.log('REDIS CONNECTED'));
redisClient.on('error', err => console.log('REDIS ERROR: ' + err));

mongoose.Promise = global.Promise
mongoose.connect(mongoPath);

app.use(morgan('dev'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({
  extended: false
}))

require('./authentication/init')

app.use(session({
  store: new RedisStore({ redisClient }),
  secret: sessionSecret,
  cookie: { maxAge: 1000 * 60 * 10 },
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(router);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.log("ERROR: "+ err.toString());
  res.status(404).send('Sorry');
}

app.listen(port, (err) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on ${port}...`)
})
