function logOutUser(req, res, next) {
  try {
    req.logout();
    res.redirect('/');
  } catch(error) {
    next(error);
  }
};

module.exports = logOutUser;
