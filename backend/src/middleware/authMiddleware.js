const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect(`${process.env.URL}/auth/google`);
};

module.exports = ensureAuth;
