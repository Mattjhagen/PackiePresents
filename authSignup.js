const express = require('express');
const passport = require('passport');

module.exports = function (app) {
  app.get('/auth/signup/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/signup/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const user = req.user;
      console.log('✅ Signup via Google:', user.displayName, user.emails?.[0]?.value);
      res.redirect('/signup.html');
    }
  );
};
