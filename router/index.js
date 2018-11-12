const router = require('express').Router();
const passport = require('passport');
const authenticationMiddleware = require('../authentication/middleware');
const registerUser = require('./registerUser');
const logInUser = require('./logInUser');
const logOutUser = require('./logOutUser');


router.get('/', authenticationMiddleware, (req, res)=> {
  res.render('index', { username: req.user.username })
});
router.get('/login', (req, res) => res.render('login'));
router.get('/registration', (req, res) => res.render('registration'));

router.post('/login', logInUser);
router.post('/logout', logOutUser);
router.post('/registration', registerUser);



module.exports = router
