const passport = require('passport')
const bcrypt = require('bcrypt')
const LocalStrategy = require('passport-local').Strategy
const authenticationMiddleware = require('./middleware')
const User  = require('../models/user.js');

passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser((username, done) => {
  User.findOne({ username: username }, (err, user) => {

    if(user){
      return done(null, user);
    } else {
      return done(null);
    }
  })
})

passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err)
      }

      if (!user) {
        return done(null, false)
      }

      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err) {
          console.log(err);
          return done(err)
        }
        if (!isValid) {
          return done(null, false)
        }
        return done(null, user)
      })
    })
  }
))

  passport.authenticationMiddleware = authenticationMiddleware
