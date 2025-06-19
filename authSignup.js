const express = require('express');
const passport = require('passport');
const { saveUserDomain } = require('./saveDomain');

module.exports = function (app) {
  // Step 1: Trigger Google Sign-In
  app.get('/auth/signup/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Step 2: Callback after Google auth
  app.get('/auth/signup/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      const user = req.user;
      const email = user.emails?.[0]?.value;
      const displayName = user.displayName || 'user';

      if (email) {
        const subdomain = `${displayName.replace(/\s+/g, '').toLowerCase()}.pacmacmobile.com`;
        saveUserDomain(email, 'subdomain', subdomain);
        console.log('✅ Signup via Google:', displayName, email);
      }

      res.redirect('/signup.html');
    }
  );
};
