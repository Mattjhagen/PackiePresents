// authSignup.js
const express = require('express');
const passport = require('passport');

module.exports = function (app) {
  // Trigger Google Sign-In
  app.get('/auth/signup/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Callback after successful auth
  app.get('/auth/signup/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const user = req.user;
      console.log('✅ Signup via Google:', user.displayName, user.emails[0].value);

      // Redirect to pricing or signup options
      res.redirect('/signup.html'); // or a dedicated upgrade flow
    }
  );
};
