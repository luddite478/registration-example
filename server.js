const path = require('path')
const redis = require('redis');
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const morgan = require('morgan');
const mongoose = require('mongoose');

const router = require('./router');
const { mongoPath } = require('./config');

const app = express();
const port = process.env.PORT || 3000

const redisClient = redis.createClient();
redisClient.on('connect', () => console.log('CONNECTED TO REDIS'));
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
  secret: 'super-secret',
  cookie: { maxAge: 1000 * 60 },
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(router);

app.listen(port, function (err) {
  if (err) {
    throw err
  }
  console.log(`server is listening on ${port}...`)
})
