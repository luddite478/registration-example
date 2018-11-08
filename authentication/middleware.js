function authenticationMiddleware(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('index');
}

module.exports = authenticationMiddleware
