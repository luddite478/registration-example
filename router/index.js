const router = require('express').Router();
const passport = require('passport');
const authenticationMiddleware = require('../authentication/middleware')
const registerUser = require('./registerUser');

router.get('/', authenticationMiddleware, renderIndexPage);
router.get('/registration', renderRegistrationPage);

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/'
}))
router.post('/registration', registerUser);


function renderRegistrationPage(req, res){
  res.render('registration')
}

function renderIndexPage(req, res) {
  const username = req.isAuthenticated()
    ? req.user.username
    : null
  res.render('index', {username})
}

module.exports = router
